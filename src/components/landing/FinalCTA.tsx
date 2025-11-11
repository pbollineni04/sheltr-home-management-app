import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-32 bg-muted/30">
      <div className="container px-4 sm:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Ready to Organize Your Home?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join homeowners who are taking control of their home management with Sheltr.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="btn-primary-luxury text-lg px-8 py-6"
              onClick={() => navigate("/auth")}
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required • Free forever • Takes less than 2 minutes
          </p>
        </div>
      </div>
    </section>
  );
};
