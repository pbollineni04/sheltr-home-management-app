import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { pageEnter, staggerContainer, fadeUpItem, easeDefault } from '@/lib/motion';
import {
  Home,
  MapPin,
  DollarSign,
  Loader2,
  Clock,
  CheckSquare,
  Receipt,
  Zap,
  TrendingUp,
  ArrowRight,
  Pencil,
} from 'lucide-react';

const FEATURES = [
  { icon: CheckSquare, title: 'Tasks', description: 'Smart task management with reminders', iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600' },
  { icon: Receipt, title: 'Expenses', description: 'Track and categorize home spending', iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600' },
  { icon: Clock, title: 'Timeline', description: 'Chronological home service history', iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600' },
  { icon: Zap, title: 'Energy', description: 'Monitor utility usage and costs', iconBg: 'bg-yellow-100 dark:bg-yellow-900/30', iconColor: 'text-yellow-600' },
  { icon: TrendingUp, title: 'HomeWealth', description: 'Track property value and equity', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600' },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [homeAddress, setHomeAddress] = useState('');
  const [homeValue, setHomeValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Address autocomplete state
  const [addressQuery, setAddressQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Property value state
  const [isFetchingValue, setIsFetchingValue] = useState(false);
  const [autoValue, setAutoValue] = useState<{
    price: number;
    priceRangeLow: number;
    priceRangeHigh: number;
  } | null>(null);
  const [isManualOverride, setIsManualOverride] = useState(false);

  // Debounced address autocomplete
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (addressQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsFetchingSuggestions(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await supabase.functions.invoke('address-autocomplete', {
          body: { input: addressQuery },
          headers: { Authorization: `Bearer ${session?.access_token}` },
        });

        if (res.error) throw res.error;
        const items = res.data?.suggestions ?? [];
        setSuggestions(items);
        setShowSuggestions(items.length > 0);
      } catch (err) {
        console.error('Address autocomplete error:', err);
        setSuggestions([]);
      } finally {
        setIsFetchingSuggestions(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [addressQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch property value when address is selected
  const fetchPropertyValue = async (address: string) => {
    setIsFetchingValue(true);
    setAutoValue(null);
    setIsManualOverride(false);
    setHomeValue('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke('property-value', {
        body: { address },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (res.error) throw res.error;

      const { price, priceRangeLow, priceRangeHigh } = res.data;

      if (price) {
        setAutoValue({ price, priceRangeLow, priceRangeHigh });
        setHomeValue(String(price));
      } else {
        throw new Error('No value returned');
      }
    } catch (err) {
      console.error('Property value lookup error:', err);
      toast({
        title: 'Could not look up property value',
        description: 'Please enter your estimated home value manually.',
      });
      setIsManualOverride(true);
    } finally {
      setIsFetchingValue(false);
    }
  };

  const handleSelectSuggestion = (address: string) => {
    setHomeAddress(address);
    setAddressQuery(address);
    setSuggestions([]);
    setShowSuggestions(false);
    fetchPropertyValue(address);
  };

  const handleAddressInputChange = (value: string) => {
    setAddressQuery(value);
    // If user edits the address after selecting one, clear the auto-value
    if (homeAddress && value !== homeAddress) {
      setHomeAddress('');
      setAutoValue(null);
      setHomeValue('');
      setIsManualOverride(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Use addressQuery as fallback if user typed but didn't select
    const finalAddress = homeAddress || addressQuery;

    setIsSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        home_address: finalAddress || null,
        home_value: homeValue ? parseFloat(homeValue) : null,
      });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setStep(2);
    }
    setIsSaving(false);
  };

  const completeOnboarding = async () => {
    if (!user) return;

    setIsSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, onboarding_completed: true });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      navigate('/dashboard', { replace: true });
    }
    setIsSaving(false);
  };

  const progress = step === 1 ? 50 : 100;

  const showAutoValue = autoValue && !isManualOverride;
  const showManualInput = !autoValue || isManualOverride;

  return (
    <motion.div
      {...pageEnter}
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          'linear-gradient(135deg, hsl(221 83% 53% / 0.05) 0%, hsl(var(--background)) 50%, hsl(270 70% 60% / 0.05) 100%)',
      }}
    >
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 mb-3 shadow-lg overflow-hidden rounded-2xl">
            <img src="/sheltr-logo.svg" alt="Sheltr Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-heading-xl text-foreground">Welcome to Sheltr</h1>
          <p className="text-muted-foreground text-sm mt-1">Let's get your home set up</p>
        </div>

        {/* Progress */}
        <Progress value={progress} className="mb-6 h-2" />

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="profile-step"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={easeDefault}
            >
              <Card className="rounded-2xl shadow-xl border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Home className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Your Home</CardTitle>
                      <CardDescription>Tell us about your home to personalize your experience</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-5">
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="show"
                      className="space-y-4"
                    >
                      {/* Address autocomplete */}
                      <motion.div variants={fadeUpItem} className="space-y-2">
                        <Label htmlFor="home-address">Home Address</Label>
                        <div className="relative" ref={dropdownRef}>
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                          {isFetchingSuggestions && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                          )}
                          <Input
                            id="home-address"
                            type="text"
                            placeholder="Start typing your address..."
                            className="pl-10"
                            value={addressQuery}
                            onChange={(e) => handleAddressInputChange(e.target.value)}
                            onFocus={() => {
                              if (suggestions.length > 0) setShowSuggestions(true);
                            }}
                            autoComplete="off"
                            role="combobox"
                            aria-expanded={showSuggestions && suggestions.length > 0}
                            aria-controls="address-listbox"
                            aria-autocomplete="list"
                          />
                          {showSuggestions && suggestions.length > 0 && (
                            <div
                              id="address-listbox"
                              role="listbox"
                              aria-label="Address suggestions"
                              className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
                            >
                              {suggestions.map((suggestion, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  role="option"
                                  aria-selected={false}
                                  className="w-full text-left px-3 py-2.5 text-sm hover:bg-accent transition-colors flex items-center gap-2"
                                  onClick={() => handleSelectSuggestion(suggestion)}
                                >
                                  <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                  <span className="truncate">{suggestion}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {/* Home value */}
                      <motion.div variants={fadeUpItem} className="space-y-2">
                        <Label htmlFor="home-value">Estimated Home Value</Label>

                        {/* Loading state */}
                        {isFetchingValue && (
                          <div className="flex items-center gap-2 px-3 py-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Looking up property value...
                          </div>
                        )}

                        {/* Auto-fetched value display */}
                        {!isFetchingValue && showAutoValue && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 px-3 py-3 rounded-lg bg-primary/5 border border-primary/20">
                              <DollarSign className="w-4 h-4 text-primary shrink-0" />
                              <span className="text-lg font-semibold text-foreground">
                                {formatCurrency(autoValue.price)}
                              </span>
                              <button
                                type="button"
                                className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                                onClick={() => {
                                  setIsManualOverride(true);
                                  setHomeValue(String(autoValue.price));
                                }}
                              >
                                <Pencil className="w-3 h-3" />
                                Edit manually
                              </button>
                            </div>
                            {autoValue.priceRangeLow && autoValue.priceRangeHigh && (
                              <p className="text-xs text-muted-foreground px-1">
                                Estimated range: {formatCurrency(autoValue.priceRangeLow)} – {formatCurrency(autoValue.priceRangeHigh)}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Manual input (default or fallback) */}
                        {!isFetchingValue && showManualInput && (
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                              id="home-value"
                              type="number"
                              placeholder="350,000"
                              className="pl-10"
                              min={0}
                              value={homeValue}
                              onChange={(e) => setHomeValue(e.target.value)}
                            />
                          </div>
                        )}
                      </motion.div>
                    </motion.div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => setStep(2)}
                      >
                        Skip for now
                      </Button>
                      <Button type="submit" className="flex-1 font-semibold" disabled={isSaving || isFetchingValue}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="tour-step"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={easeDefault}
            >
              <Card className="rounded-2xl shadow-xl border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl text-center">You're all set!</CardTitle>
                  <CardDescription className="text-center">Here's what you can do with Sheltr</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {FEATURES.map((feat) => {
                      const Icon = feat.icon;
                      return (
                        <div key={feat.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <div className={`w-9 h-9 rounded-lg ${feat.iconBg} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-4 h-4 ${feat.iconColor}`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{feat.title}</p>
                            <p className="text-xs text-muted-foreground">{feat.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Button
                    onClick={completeOnboarding}
                    className="w-full font-semibold"
                    disabled={isSaving}
                  >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Onboarding;
