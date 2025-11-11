import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export const LandingHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Home className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold">Sheltr</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/auth")}
          >
            Log In
          </Button>
          <Button
            className="btn-primary-luxury"
            onClick={() => navigate("/auth")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};
