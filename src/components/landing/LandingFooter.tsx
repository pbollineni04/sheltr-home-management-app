import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export const LandingFooter = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Home className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Sheltr</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your home's complete management system. Track expenses, maintenance, and history—all in one place.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-foreground transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-foreground transition-colors"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => navigate("/auth")}
                  className="hover:text-foreground transition-colors"
                >
                  About
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => navigate("/auth")}
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/auth")}
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} Sheltr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
