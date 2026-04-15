import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    if (!user) return;

    supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setOnboardingCompleted(data?.onboarding_completed ?? false);
        setOnboardingChecked(true);
      });
  }, [user]);

  if (loading || (user && !onboardingChecked)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (user) {
    if (!onboardingCompleted) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
