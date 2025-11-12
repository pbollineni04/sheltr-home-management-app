import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, Rocket, CheckCircle } from "lucide-react";

export const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-primary/10 to-blue-500/10">
      <div className="container px-4 sm:px-8 max-w-4xl mx-auto text-center">
        <div className="space-y-8">
          {/* Honest positioning */}
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-950/30 px-4 py-2 rounded-full">
            <Rocket className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Launching Now • Be an Early Adopter
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
            Your Home Is a $300K+ Asset.
            <span className="block text-primary mt-2">
              Start Managing It Like One.
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            85 million US homeowners are managing their biggest investment with
            spreadsheets and sticky notes. You don't have to.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="btn-primary-luxury text-lg px-12 py-6"
              onClick={() => navigate("/auth?mode=signup")}
            >
              Start Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-12 py-6"
              onClick={() => navigate("/auth?mode=signup")}
            >
              See How It Works
              <Play className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="flex items-center justify-center gap-8 flex-wrap text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Free plan forever
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              2-minute setup
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Export data anytime
            </div>
          </div>

          {/* Early Adopter Benefit */}
          <div className="pt-8 border-t border-border/50">
            <p className="text-lg font-semibold text-foreground mb-2">
              Early Adopter Bonus
            </p>
            <p className="text-muted-foreground">
              Sign up during launch and get Pro for <strong className="text-foreground">$4.99/mo</strong> instead
              of $9.99/mo—<strong className="text-foreground">locked in for life</strong>. Limited to first 1,000 users.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
