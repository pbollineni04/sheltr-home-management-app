import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, RefreshCw, Trash2, Plug, Clock } from 'lucide-react';
import { getConnections, disconnectUtility, syncBills } from '@/integrations/utility/utilityService';
import { useToast } from '@/hooks/use-toast';

interface Connection {
  id: string;
  provider: string;
  utility_name: string | null;
  status: string;
  created_at: string;
  utility_sync_state?: { last_synced_at: string | null }[] | null;
}

interface UtilityConnectionSettingsProps {
  onConnectionChange: () => void;
}

const UtilityConnectionSettings = ({ onConnectionChange }: UtilityConnectionSettingsProps) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const data = await getConnections();
      setConnections(data);
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleSync = async (connectionId: string) => {
    try {
      setSyncingId(connectionId);
      const result = await syncBills(connectionId);
      toast({
        title: "Sync Complete",
        description: `Imported ${result.imported} bill(s), skipped ${result.skipped}, flagged ${result.flagged} for review`,
      });
      fetchConnections();
      onConnectionChange();
    } catch (error) {
      console.error('Error syncing:', error);
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : 'Failed to sync bills',
        variant: "destructive",
      });
    } finally {
      setSyncingId(null);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    try {
      await disconnectUtility(connectionId);
      toast({
        title: "Disconnected",
        description: "Utility account disconnected successfully",
      });
      fetchConnections();
      onConnectionChange();
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect utility account",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">Active</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Inactive</Badge>;
    }
  };

  const formatLastSynced = (connection: Connection): string => {
    const syncState = connection.utility_sync_state;
    const lastSynced = Array.isArray(syncState)
      ? syncState[0]?.last_synced_at
      : null;

    if (!lastSynced) return 'Never synced';

    const date = new Date(lastSynced);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (connections.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 gap-3">
          <Plug className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No utility accounts connected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Connected Accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {connections.map((connection) => (
          <div
            key={connection.id}
            className="flex items-center justify-between p-4 rounded-lg border"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Plug className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{connection.utility_name || 'Utility'}</span>
                  {getStatusBadge(connection.status)}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatLastSynced(connection)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSync(connection.id)}
                disabled={syncingId === connection.id}
              >
                {syncingId === connection.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Disconnect Utility?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove the connection to {connection.utility_name || 'this utility'}.
                      Previously imported readings will not be deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDisconnect(connection.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Disconnect
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UtilityConnectionSettings;
