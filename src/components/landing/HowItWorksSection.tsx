import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Upload, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

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
    <section id="how-it-works" className="py-20 sm:py-32">
      <div className="container px-4 sm:px-8">
        <motion.div
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Get Started in Minutes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple setup, powerful results. Start organizing your home today.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line for desktop */}
          <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="card-luxury text-center hover:shadow-xl transition-all duration-300 relative z-10">
                <CardContent className="p-8 space-y-4">
                  {/* Icon with step number badge */}
                  <div className="relative inline-block">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md">
                      {step.number}
                    </div>
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
