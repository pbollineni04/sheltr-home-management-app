import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)',
        }}
      />

      <div className="container px-4 sm:px-8 py-20 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Stop Losing Track of{" "}
                <span className="text-primary">Your Home</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Sheltr helps homeowners manage expenses, maintenance, documents,
                and history—all in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="btn-primary-luxury text-lg px-8 py-6"
                onClick={() => navigate("/auth")}
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={() => navigate("/auth")}
              >
                Log In
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              No credit card required • Free forever
            </p>
          </div>

          {/* Right: Hero Image Placeholder */}
          <div className="relative animate-in fade-in slide-in-from-right duration-700">
            <div className="relative rounded-lg border-2 border-border bg-card shadow-2xl overflow-hidden">
              {/* Placeholder for dashboard screenshot */}
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-primary/40" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Dashboard Preview
                  </p>
                  <p className="text-sm text-muted-foreground/60">
                    Screenshot placeholder
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative blur circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};
