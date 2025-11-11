import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Upload, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your account in seconds. No credit card required."
  },
  {
    number: "2",
    icon: Upload,
    title: "Add Data",
    description: "Connect Plaid for expenses, add tasks, and upload documents."
  },
  {
    number: "3",
    icon: BarChart3,
    title: "Stay Organized",
    description: "Track everything in one beautiful dashboard. Your home, simplified."
  }
];

export const HowItWorksSection = () => {
  return (
    <section className="py-20 sm:py-32">
      <div className="container px-4 sm:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Get Started in Minutes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple setup, powerful results. Start organizing your home today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="card-luxury text-center hover:shadow-xl transition-all duration-300 relative z-10">
                <CardContent className="p-8 space-y-4">
                  {/* Step number badge */}
                  <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-primary">{step.number}</span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
