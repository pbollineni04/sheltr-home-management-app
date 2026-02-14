import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, ExternalLink, CheckCircle2 } from 'lucide-react';
import { createLinkToken, exchangeAuthorization } from '@/integrations/utility/utilityService';
import { useToast } from '@/hooks/use-toast';

interface UtilityConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnected: () => void;
}

type Step = 'select' | 'connecting' | 'authorizing' | 'success' | 'error';

const UtilityConnectionDialog = ({ open, onOpenChange, onConnected }: UtilityConnectionDialogProps) => {
  const [step, setStep] = useState<Step>('select');
  const [loading, setLoading] = useState(false);
  const [authUid, setAuthUid] = useState<string | null>(null);
  const [accountCount, setAccountCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      setLoading(true);
      setStep('connecting');

      const { url, uid } = await createLinkToken();
      setAuthUid(uid);

      // Open UtilityAPI authorization in new window
      window.open(url, '_blank', 'width=600,height=700');
      setStep('authorizing');
    } catch (error) {
      console.error('Error starting connection:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to start connection');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAuth = async () => {
    if (!authUid) return;

    try {
      setLoading(true);
      const { accounts } = await exchangeAuthorization(authUid);
      setAccountCount(accounts);
      setStep('success');
      toast({
        title: "Utility Connected",
        description: `${accounts} account(s) connected successfully`,
      });
      onConnected();
    } catch (error: any) {
      console.error('Error completing authorization:', error);
      // Surface the full error including edge function response
      const msg = error?.context?.body || error?.message || 'Failed to complete authorization';
      console.error('Full error details:', JSON.stringify(error, null, 2));
      setErrorMessage(typeof msg === 'string' ? msg : JSON.stringify(msg));
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('select');
    setAuthUid(null);
    setErrorMessage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Connect Utility Provider
          </DialogTitle>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your utility accounts to automatically import bills and usage data.
            </p>
            <div
              className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={handleConnect}
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">UtilityAPI</h4>
                <p className="text-sm text-muted-foreground">Electric, Gas, Water providers</p>
              </div>
              <Badge variant="outline">Recommended</Badge>
            </div>
          </div>
        )}

        {step === 'connecting' && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-muted-foreground">Preparing connection...</p>
          </div>
        )}

        {step === 'authorizing' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center py-6 gap-3">
              <ExternalLink className="w-8 h-8 text-blue-600" />
              <p className="text-sm text-muted-foreground text-center">
                A new window has opened for you to authorize access to your utility account.
                Click the button below once you've completed authorization.
              </p>
            </div>
            <Button
              onClick={handleCompleteAuth}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
              ) : (
                "I've Completed Authorization"
              )}
            </Button>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center py-6 gap-3">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
              <h3 className="font-semibold text-lg">Connected!</h3>
              <p className="text-sm text-muted-foreground text-center">
                {accountCount} utility account(s) connected. Bills will sync automatically.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}

        {step === 'error' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-sm text-red-600 text-center">{errorMessage}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setStep('select')} className="flex-1">
                Try Again
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UtilityConnectionDialog;
