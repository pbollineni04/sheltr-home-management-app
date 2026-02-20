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
import { pageEnter, fadeUpItem, staggerContainer } from '@/lib/motion';
import {
  Home,
  MapPin,
  DollarSign,
  Loader2,
  LayoutDashboard,
  Clock,
  CheckSquare,
  Receipt,
  FileText,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Pencil,
} from 'lucide-react';

const TOUR_SLIDES = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    description: 'Get a bird\'s-eye view of your home — equity, expenses, tasks, and more all in one place.',
  },
  {
    icon: Clock,
    title: 'Timeline',
    description: 'Track every home event chronologically — repairs, upgrades, inspections, and milestones.',
  },
  {
    icon: CheckSquare,
    title: 'Tasks',
    description: 'Stay on top of maintenance with smart task management, reminders, and recurring schedules.',
  },
  {
    icon: Receipt,
    title: 'Expenses',
    description: 'Monitor all home-related spending with automatic categorization and trend insights.',
  },
  {
    icon: FileText,
    title: 'Document Vault',
    description: 'Securely store warranties, contracts, receipts, and important home documents.',
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

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
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);

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

  const nextSlide = () => {
    if (slideIndex < TOUR_SLIDES.length - 1) {
      setSlideDirection(1);
      setSlideIndex((i) => i + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevSlide = () => {
    if (slideIndex > 0) {
      setSlideDirection(-1);
      setSlideIndex((i) => i - 1);
    }
  };

  const progress = step === 1 ? 50 : 50 + ((slideIndex + 1) / TOUR_SLIDES.length) * 50;

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
          <h1 className="text-2xl font-bold text-foreground">Welcome to Sheltr</h1>
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
              transition={{ duration: 0.3 }}
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
                          />
                          {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                              {suggestions.map((suggestion, i) => (
                                <button
                                  key={i}
                                  type="button"
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
              transition={{ duration: 0.3 }}
            >
              <Card className="rounded-2xl shadow-xl border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl text-center">Explore Sheltr</CardTitle>
                  <CardDescription className="text-center">Here's what you can do with Sheltr</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-hidden min-h-[200px] flex items-center justify-center">
                    <AnimatePresence mode="wait" custom={slideDirection}>
                      <motion.div
                        key={slideIndex}
                        custom={slideDirection}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.25 }}
                        className="flex flex-col items-center text-center px-4"
                      >
                        {(() => {
                          const slide = TOUR_SLIDES[slideIndex];
                          const Icon = slide.icon;
                          return (
                            <>
                              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                <Icon className="w-8 h-8 text-primary" />
                              </div>
                              <h3 className="text-lg font-semibold mb-2">{slide.title}</h3>
                              <p className="text-muted-foreground text-sm max-w-sm">{slide.description}</p>
                            </>
                          );
                        })()}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Dot indicators */}
                  <div className="flex justify-center gap-2 mt-4 mb-6">
                    {TOUR_SLIDES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSlideDirection(i > slideIndex ? 1 : -1);
                          setSlideIndex(i);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          i === slideIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex gap-3">
                    {slideIndex > 0 ? (
                      <Button variant="outline" onClick={prevSlide} className="flex-1">
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        onClick={completeOnboarding}
                        className="flex-1"
                        disabled={isSaving}
                      >
                        Skip tour
                      </Button>
                    )}
                    <Button onClick={nextSlide} className="flex-1 font-semibold" disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {slideIndex < TOUR_SLIDES.length - 1 ? (
                        <>
                          Next
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        'Get Started'
                      )}
                    </Button>
                  </div>
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
