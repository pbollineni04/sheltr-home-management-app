
import { Button } from "@/components/ui/button";
import { Home, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navigation = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <nav className="border-b" style={{ background: 'linear-gradient(180deg, var(--neutral-50) 0%, var(--neutral-100) 100%)' }}>
      <div className="container-luxury py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6 icon-luxury" />
            <h1 className="text-heading-xl text-neutral-900">Sheltr</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user && (
              <>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <User className="w-4 h-4 icon-luxury" />
                  <span>{user.email}</span>
                </div>
                <Button 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 btn-secondary-luxury"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
