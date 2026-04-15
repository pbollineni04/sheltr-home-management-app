
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    if (!user) return;

    setOnboardingChecked(false);
    supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setOnboardingCompleted(data?.onboarding_completed ?? false);
        setOnboardingChecked(true);
      });
  }, [user, location.pathname]);

  if (loading || (user && !onboardingChecked)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Not completed onboarding and not already on /onboarding → redirect there
  if (!onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Already completed onboarding but visiting /onboarding → redirect to dashboard
  if (onboardingCompleted && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
