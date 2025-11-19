import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { 
  Loader2, 
  Home, 
  DollarSign, 
  MapPin, 
  CheckCircle2,
  BarChart3,
  Clock,
  ListTodo,
  Receipt,
  FileText,
  TrendingUp,
  Shield,
  Info
} from 'lucide-react';

type OnboardingStep = 'profile' | 'tour';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const [formData, setFormData] = useState({
    homeAddress: '',
    homeValue: ''
  });

  // Format number with commas for display
  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    return new Intl.NumberFormat('en-US').format(parseInt(numbers));
  };

  // Handle home value input with formatting
  const handleHomeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, homeValue: rawValue });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.homeAddress || !formData.homeValue) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          home_address: formData.homeAddress,
          home_value: parseFloat(formData.homeValue)
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated!",
      });
      setCurrentStep('tour');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTourComplete = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Welcome to Sheltr!",
        description: "You're all set. Let's start managing your home.",
      });
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipTour = async () => {
    await handleTourComplete();
  };

  const tourPoints = [
    {
      title: "Dashboard Overview",
      icon: BarChart3,
      description: "Your home's command center. See upcoming tasks, recent expenses, and important reminders at a glance.",
      features: [
        "Quick stats on spending and tasks",
        "Upcoming maintenance reminders",
        "Recent activity timeline"
      ],
      color: "text-blue-500",
      screenshot: "/screenshots/dashboard.png"
    },
    {
      title: "Home Timeline",
      icon: Clock,
      description: "Build your home's story. Track renovations, repairs, inspections, and major events to maintain a complete history.",
      features: [
        "Document all home improvements",
        "Track inspection dates and results",
        "Build resale value with records"
      ],
      color: "text-purple-500",
      screenshot: "/screenshots/timeline.png"
    },
    {
      title: "Tasks & Projects",
      icon: ListTodo,
      description: "Stay organized with smart task lists. Manage maintenance schedules, home projects, and shopping lists in one place.",
      features: [
        "Create custom task lists",
        "Set reminders and due dates",
        "Track project progress"
      ],
      color: "text-green-500",
      screenshot: "/screenshots/tasks.png"
    },
    {
      title: "Expense Tracking",
      icon: Receipt,
      description: "Know exactly where your home budget goes. Categorize expenses, spot trends, and make smarter spending decisions.",
      features: [
        "Automatic categorization",
        "Monthly budget insights",
        "Export for tax season"
      ],
      color: "text-orange-500",
      screenshot: "/screenshots/expenses.png"
    },
    {
      title: "Document Vault",
      icon: Shield,
      description: "Your secure digital filing cabinet. Store warranties, insurance docs, contracts, and receipts in one safe location.",
      features: [
        "Encrypted cloud storage",
        "Quick search and retrieval",
        "Never lose important paperwork"
      ],
      color: "text-red-500",
      screenshot: "/screenshots/vault.png"
    }
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)' }}
    >
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Home className="w-8 h-8 icon-luxury" />
            <h1 className="text-3xl font-bold">Sheltr</h1>
          </div>
          <p className="text-body-luxury text-muted-foreground">
            {currentStep === 'profile' 
              ? "Welcome! Let's set up your home profile" 
              : "Here's what you can do with Sheltr"}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8 justify-center">
          {(['profile', 'tour'] as OnboardingStep[]).map((step) => (
            <div
              key={step}
              className={`h-2 w-16 rounded-full transition-all ${
                step === currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Card className="card-luxury">
          {/* Step 1: Profile */}
          {currentStep === 'profile' && (
            <>
              <CardHeader>
                <CardTitle>Tell us about your home</CardTitle>
                <CardDescription>
                  This helps us provide personalized insights and maintenance recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Home Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street, City, State ZIP"
                      value={formData.homeAddress}
                      onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                      required
                      className="text-base"
                    />
                    <p className="text-xs text-muted-foreground">
                      Used to provide location-specific maintenance tips and weather alerts
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value" className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Estimated Home Value
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="value"
                        type="text"
                        placeholder="350,000"
                        value={formatCurrency(formData.homeValue)}
                        onChange={handleHomeValueChange}
                        required
                        className="pl-7 text-base"
                      />
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                      <Info className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <p className="text-xs text-blue-900 dark:text-blue-100">
                        We use this to calculate maintenance budgets (typically 1-3% annually), 
                        estimate insurance costs, and help you track your home's equity over time.
                      </p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          {/* Step 2: Visual Feature Tour */}
          {currentStep === 'tour' && (
            <>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>What you can do with Sheltr</CardTitle>
                    <CardDescription>Everything you need to manage your home in one place</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkipTour}
                    disabled={isLoading}
                  >
                    Skip tour
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Screenshot Preview */}
                  <div className="rounded-lg overflow-hidden border-2 border-primary/20 bg-muted/30 max-h-64 flex items-center justify-center">
                    <img 
                      src={tourPoints[tourStep].screenshot} 
                      alt={tourPoints[tourStep].title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Main Feature Card */}
                  <div className="p-6 bg-gradient-to-br from-muted/50 to-muted rounded-lg border-2 border-primary/20">
                    <div className="flex items-start gap-4 mb-4">
                      {(() => {
                        const Icon = tourPoints[tourStep].icon;
                        return <Icon className={`w-8 h-8 ${tourPoints[tourStep].color} flex-shrink-0`} />;
                      })()}
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl mb-2">
                          {tourPoints[tourStep].title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {tourPoints[tourStep].description}
                        </p>
                      </div>
                    </div>

                    {/* Feature List */}
                    <div className="space-y-2 ml-12">
                      {tourPoints[tourStep].features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress Dots */}
                  <div className="flex gap-2 justify-center">
                    {tourPoints.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setTourStep(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === tourStep ? 'w-8 bg-primary' : 'w-2 bg-muted hover:bg-muted-foreground/20'
                        }`}
                        aria-label={`Go to step ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setTourStep(Math.max(0, tourStep - 1))}
                      disabled={tourStep === 0}
                    >
                      Back
                    </Button>
                    {tourStep < tourPoints.length - 1 ? (
                      <Button
                        className="flex-1"
                        onClick={() => setTourStep(tourStep + 1)}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        className="flex-1"
                        onClick={handleTourComplete}
                        disabled={isLoading}
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Go to Dashboard
                      </Button>
                    )}
                  </div>

                  {/* Quick Overview of All Features */}
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground text-center mb-3">
                      Quick overview of all features:
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {tourPoints.map((point, idx) => {
                        const Icon = point.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => setTourStep(idx)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                              idx === tourStep 
                                ? 'bg-primary/10 border border-primary/30' 
                                : 'hover:bg-muted'
                            }`}
                            title={point.title}
                          >
                            <Icon className={`w-5 h-5 ${idx === tourStep ? point.color : 'text-muted-foreground'}`} />
                            <span className={`text-xs ${idx === tourStep ? 'font-medium' : 'text-muted-foreground'}`}>
                              {point.title.split(' ')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Footer hint */}
        {currentStep === 'profile' && (
          <p className="text-xs text-center text-muted-foreground mt-4">
            Takes less than 2 minutes · Your data is encrypted and secure
          </p>
        )}
      </div>
    </div>
  );
};

export default Onboarding;