import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Rocket, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-primary/10 to-blue-500/10">
      <div className="container px-4 sm:px-8 max-w-4xl mx-auto text-center">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="btn-primary-luxury text-lg px-12 py-6"
              onClick={() => navigate("/auth?mode=signup")}
            >
              Start Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 flex-wrap text-sm text-muted-foreground">
            {["Free plan forever", "No credit card required", "2-minute setup", "Export data anytime"].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {text}
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-border/50">
            <p className="text-lg font-semibold text-foreground mb-2">
              Early Adopter Bonus
            </p>
            <p className="text-muted-foreground">
              Sign up during launch and get Pro for <strong className="text-foreground">$4.99/mo</strong> instead
              of $9.99/mo—<strong className="text-foreground">locked in for life</strong>. Limited to first 1,000 users.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
