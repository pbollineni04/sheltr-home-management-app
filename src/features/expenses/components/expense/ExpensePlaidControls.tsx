import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { createLinkToken, exchangePublicToken, getLatestItemId, getSyncState, syncTransactions } from "@/integrations/plaid/plaidService";
import { usePlaidLink } from "react-plaid-link";

export const ExpensePlaidControls = () => {
  const [itemId, setItemId] = useState<string | null>(null);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load current item and sync state
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const existing = await getLatestItemId();
        if (!mounted) return;
        setItemId(existing);
        if (existing) {
          const state = await getSyncState(existing);
          if (!mounted) return;
          setLastSyncedAt(state?.last_synced_at ?? null);
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(e.message || "Failed to load Plaid status");
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Configure Plaid Link when we have a link token
  const plaidConfig = useMemo(() => ({
    token: linkToken || "",
    onSuccess: async (public_token: string) => {
      try {
        setLoading(true);
        const { item_id } = await exchangePublicToken(public_token);
        setItemId(item_id);
        const state = await getSyncState(item_id);
        setLastSyncedAt(state?.last_synced_at ?? null);
        setLinkToken(null); // close out token
      } catch (e: any) {
        setError(e.message || "Exchange failed");
      } finally {
        setLoading(false);
      }
    },
    onExit: () => setLinkToken(null),
  }), [linkToken]);

  const { open, ready } = usePlaidLink(plaidConfig as any);

  const handleConnect = async () => {
    try {
      setError(null);
      setLoading(true);
      const token = await createLinkToken();
      setLinkToken(token);
    } catch (e: any) {
      setError(e.message || "Failed to create link token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (linkToken && ready) open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkToken, ready]);

  const handleSync = async () => {
    if (!itemId) return;
    try {
      setError(null);
      setSyncing(true);
      const res = await syncTransactions(itemId);
      const state = await getSyncState(itemId);
      setLastSyncedAt(state?.last_synced_at ?? null);

      // Show success message with import count
      const { imported = 0, skipped = 0 } = res as any;
      if (imported > 0) {
        // Force page reload to show new expenses
        window.location.reload();
      } else if (imported === 0 && skipped === 0) {
        setError("No transactions found. Try connecting a different account.");
      } else {
        setError(`No new transactions (${skipped} already imported)`);
      }
    } catch (e: any) {
      setError(e.message || "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs text-muted-foreground flex items-center gap-2">
        {error ? (
          <span className="px-2 py-0.5 rounded-full text-xs border bg-destructive/10 text-destructive border-destructive/20">{error}</span>
        ) : itemId ? (
          lastSyncedAt ? (
            <>
              <span className="px-2 py-0.5 rounded-full text-xs border bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">Linked</span>
              <span className="text-muted-foreground">Last synced {new Date(lastSyncedAt).toLocaleString()}</span>
            </>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-xs border bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">Linked • Not synced yet</span>
          )
        ) : (
          <span className="px-2 py-0.5 rounded-full text-xs border bg-muted text-muted-foreground border-border">No bank linked</span>
        )}
      </div>
      <div className="flex gap-2">
        {!itemId && (
          <Button onClick={handleConnect} disabled={loading} className="btn-secondary-luxury">
            {loading ? 'Preparing…' : 'Connect Bank'}
          </Button>
        )}
        {itemId && (
          <Button onClick={handleSync} disabled={syncing} className="btn-secondary-luxury">
            {syncing ? 'Syncing…' : 'Sync Now'}
          </Button>
        )}
      </div>
    </div>
  );
};
