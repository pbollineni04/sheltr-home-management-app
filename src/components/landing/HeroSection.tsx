import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, Shield, CreditCard, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)',
        }}
      />

      <div className="container px-4 sm:px-8 py-20 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Your Home Is a $300K+ Asset.
                <span className="block text-primary mt-2">
                  Stop Managing It Like It's Not.
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl">
                Important documents lost in email. Maintenance forgotten until things break.
                Expenses tracked in spreadsheets—or not at all.
              </p>
            </div>

            <p className="text-lg text-foreground font-medium">
              Sheltr gives you one place for expenses, maintenance, documents, and history.
              Finally manage your home like the valuable asset it is.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="btn-primary-luxury text-lg px-8 py-6"
                onClick={() => navigate("/auth?mode=signup")}
              >
                Start Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={scrollToHowItWorks}
              >
                See How It Works
                <Play className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="flex items-center gap-6 flex-wrap text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                Bank-level security
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                2-minute setup
              </div>
            </div>
          </motion.div>

          {/* Right: Hero Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >
            <div className="relative rounded-xl border-2 border-border shadow-2xl overflow-hidden">
              <img
                src="/screenshots/dashboard-hero.png"
                alt="Sheltr Dashboard showing expense tracking, tasks, and home timeline"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
