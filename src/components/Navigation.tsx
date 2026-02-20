
import { useState } from "react";
import {
  Home,
  LayoutDashboard,
  Calendar,
  Brain,
  CheckSquare,
  DollarSign,
  TrendingUp,
  Zap,
  FolderLock,
  Move,
  Bell,
  LogOut,
  User,
  Menu,
  X,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { featureFlags } from "@/lib/featureFlags";

interface SidebarNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, flag: featureFlags.dashboardOverview },
  { id: "homewealth", label: "HomeWealth", icon: TrendingUp, flag: featureFlags.homeWealth },
  { id: "timeline", label: "Timeline", icon: Calendar, flag: featureFlags.homeTimeline },
  { id: "tasks", label: "Tasks", icon: CheckSquare, flag: featureFlags.tasksLists },
  { id: "expenses", label: "Expenses", icon: DollarSign, flag: featureFlags.expenseTracker },
  { id: "services", label: "Services", icon: Wrench, flag: featureFlags.services },
  { id: "vault", label: "Documents", icon: FolderLock, flag: featureFlags.documentVault },
  { id: "move", label: "Move", icon: Move, flag: featureFlags.moveInOut },
  { id: "helper", label: "Helper", icon: Brain, flag: featureFlags.sheltrHelper },
  { id: "energy", label: "Utilities", icon: Zap, flag: featureFlags.energyTracker },
  { id: "alerts", label: "Alerts", icon: Bell, flag: featureFlags.smartAlerts },
];

const SidebarNavigation = ({ activeTab, onTabChange }: SidebarNavigationProps) => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  const enabledNavItems = navItems.filter((item) => item.flag);

  return (
    <>
      {/* Mobile Header */}
      <header className="mobile-header lg:hidden bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <img src="/sheltr-logo.svg" alt="Sheltr Logo" className="w-8 h-8" />
          <div>
            <h1 className="font-bold text-foreground text-base">Sheltr</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="sidebar-overlay lg:hidden"
          style={{ marginTop: "65px" }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar-nav ${isMobileMenuOpen ? "" : "sidebar-nav-hidden"
          } lg:translate-x-0`}
        style={{ top: isMobileMenuOpen ? "65px" : "0" }}
      >
        <div className="p-6 flex-1">
          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center gap-3 mb-8">
            <img src="/sheltr-logo.svg" alt="Sheltr Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Sheltr</h1>
              <p className="text-xs text-muted-foreground">Home Management</p>
            </div>
          </div>

          {/* Navigation items */}
          <nav className="space-y-1">
            {enabledNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`sidebar-nav-item transition-colors ${isActive ? "active" : ""}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="p-6 border-t" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
          {/* User info */}
          {user && (
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground px-1">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="truncate text-xs">{user.email}</span>
            </div>
          )}

          {/* Theme toggle (desktop) */}
          <div className="hidden lg:flex items-center justify-between px-1 mb-3">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="sidebar-nav-item text-destructive hover:bg-destructive/10"
            style={{ color: 'hsl(var(--destructive))' }}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>

          {/* Pro Tip */}
          <div className="hidden lg:block mt-4 p-3 rounded-lg" style={{ background: 'hsl(var(--primary) / 0.08)' }}>
            <p className="text-xs font-medium mb-1" style={{ color: 'hsl(var(--primary))' }}>Pro Tip</p>
            <p className="text-xs text-muted-foreground">
              Keep your home organized by regularly updating your tasks and expenses!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarNavigation;
