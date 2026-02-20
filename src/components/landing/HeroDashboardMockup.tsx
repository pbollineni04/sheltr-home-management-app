import { motion } from "framer-motion";
import { TrendingUp, CheckSquare, Calendar, Shield, Zap, Home, PieChart, FileText, Settings, Bell, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";

export const HeroDashboardMockup = () => {
  return (
    <div className="relative w-full z-10">
      {/* App Window - Removed redundant animation as parent HeroSection handles entrance */}
      <div className="relative rounded-xl border border-border/50 shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] overflow-hidden bg-background flex flex-col w-full aspect-[4/3] sm:aspect-[16/10] min-h-[450px] lg:min-h-[550px]">
        {/* Top Bar (MacOS style) */}
        <div className="h-10 border-b border-border/50 bg-muted/30 flex items-center px-4 gap-2 shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
          </div>
          <div className="mx-auto flex items-center gap-2 px-4 py-1.5 rounded-md bg-background/50 border border-border/50 text-[10px] text-muted-foreground w-1/3 max-w-[200px]">
            <Search className="w-3 h-3" /> Search...
          </div>
        </div>

        {/* App Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar mockup */}
          <div className="w-16 sm:w-48 border-r border-border/50 bg-muted/10 flex flex-col items-center sm:items-stretch py-4 shrink-0 hidden xs:flex">
            <div className="px-3 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Home className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-sm hidden sm:block">Sheltr</span>
            </div>

            <div className="flex-1 px-3 space-y-2 text-muted-foreground">
              {[
                { icon: Home, label: "Dashboard", active: true },
                { icon: PieChart, label: "Expenses" },
                { icon: CheckSquare, label: "Tasks" },
                { icon: FileText, label: "Documents" },
                { icon: Settings, label: "Settings" }
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${item.active ? 'bg-primary/10 text-primary' : 'hover:bg-muted/30 hover:text-foreground'}`}>
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:block">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-hidden flex flex-col gap-4 sm:gap-6 bg-gradient-to-br from-background via-background to-muted/20">

            {/* Dashboard Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-sm sm:text-lg font-bold">Good morning, Alex</h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Here's what's happening with your home</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center border border-border/50">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                  A
                </div>
              </div>
            </div>

            {/* Header Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <motion.div
                className="p-3 rounded-lg border border-border/50 bg-background/50 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
              >
                <div className="text-[10px] text-muted-foreground font-medium mb-1 truncate">Est. Home Value</div>
                <div className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                  $342,800
                </div>
                <div className="text-[10px] text-green-500 font-medium flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" /> +1.2% this month
                </div>
              </motion.div>

              <motion.div
                className="p-3 rounded-lg border border-border/50 bg-background/50 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
              >
                <div className="text-[10px] text-muted-foreground font-medium mb-1 truncate">Total Equity</div>
                <div className="text-lg sm:text-xl font-bold">$115k</div>
                <div className="text-[10px] text-green-500 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +$4.2k this year
                </div>
              </motion.div>

              <motion.div
                className="p-3 rounded-lg border border-border/50 bg-background/50 shadow-[0_2px_10px_rgba(0,0,0,0.05)] hidden sm:block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
              >
                <div className="text-[10px] text-muted-foreground font-medium mb-1">Monthly Expenses</div>
                <div className="text-lg sm:text-xl font-bold">$1,240</div>
                <div className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-1">
                  <ArrowDownRight className="w-3 h-3 text-red-400" /> -4% vs last month
                </div>
              </motion.div>
            </div>

            {/* Bottom Widgets Row - Fixed height to prevent collapse */}
            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4 sm:gap-6" style={{ height: '200px' }}>
              {/* Main Chart Area */}
              <motion.div
                className="rounded-lg border border-border/50 bg-background/50 shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-4 flex flex-col overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.5 }}
              >
                <div className="text-xs font-semibold mb-3 text-foreground flex justify-between items-center">
                  <span>Utilities</span>
                  <span className="text-[10px] text-muted-foreground font-normal">This Month</span>
                </div>
                {/* Bar Chart with explicit pixel heights */}
                <div className="flex-1 flex items-end justify-around gap-1 px-1 border-b border-border/30">
                  {[
                    { label: 'Power', h: 90, highlight: true },
                    { label: 'Water', h: 50, highlight: true },
                    { label: 'Gas', h: 30, highlight: false },
                    { label: 'Net', h: 55, highlight: false },
                    { label: 'Trash', h: 18, highlight: false },
                    { label: 'Pest', h: 12, highlight: false },
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <div className="w-full flex justify-center items-end" style={{ height: '100px' }}>
                        <motion.div
                          className="rounded-t-sm"
                          style={{
                            width: '60%',
                            maxWidth: '28px',
                            backgroundColor: bar.highlight ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground)/0.25)',
                          }}
                          initial={{ height: 0 }}
                          animate={{ height: `${bar.h}px` }}
                          transition={{ duration: 0.8, delay: 0.3 + (i * 0.06), ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-around px-1 pt-1.5 text-[8px] sm:text-[9px] text-muted-foreground font-medium">
                  <span>Power</span><span>Water</span><span>Gas</span><span>Net</span><span>Trash</span><span>Pest</span>
                </div>
              </motion.div>

              {/* Todo List Area */}
              <motion.div
                className="rounded-lg border border-border/50 bg-background/50 shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-4 hidden sm:flex flex-col overflow-hidden"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              >
                <div className="text-xs font-semibold mb-3">Upcoming</div>
                <div
                  className="space-y-2 flex-1 overflow-hidden relative"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                    maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
                  }}
                >
                  {[
                    { title: "HVAC Filter", due: "Today", icon: CheckSquare, color: "text-blue-500", delay: 0.35 },
                    { title: "Clean Gutters", due: "This week", icon: Calendar, color: "text-orange-500", delay: 0.4 },
                    { title: "Smoke Alarms", due: "Mar 1", icon: Shield, color: "text-red-500", delay: 0.45 },
                    { title: "Property Tax", due: "Mar 15", icon: CheckSquare, color: "text-primary", delay: 0.5 },
                  ].map((task, i) => (
                    <motion.div
                      key={i}
                      className="flex justify-between items-center p-2 rounded-md bg-muted/40 border border-border/40"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: task.delay - 0.15, duration: 0.3, ease: "easeOut" }}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-md bg-background shadow-sm border border-border/50`}>
                          <task.icon className={`w-3 h-3 ${task.color}`} />
                        </div>
                        <span className="text-[10px] font-medium text-foreground">{task.title}</span>
                      </div>
                      <span className="text-[9px] text-muted-foreground">{task.due}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements with performant animations and anti-flicker */}
      <motion.div
        className="absolute -left-4 sm:-left-6 top-1/4 bg-background/90 px-3 py-2 rounded-xl border border-border/50 shadow-2xl hidden sm:flex items-center gap-3 z-20"
        style={{ backfaceVisibility: "hidden", WebkitFontSmoothing: "antialiased", z: 0 }}
        initial={{ opacity: 0, x: -20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
      >
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
          <Shield className="w-4 h-4 text-green-500" />
        </div>
        <div className="pr-1">
          <p className="text-xs font-bold leading-tight">Protected</p>
          <p className="text-[10px] text-muted-foreground hidden lg:block leading-tight mt-0.5">Coverage active</p>
        </div>
      </motion.div>

      <motion.div
        className="absolute -right-4 sm:-right-6 bottom-1/3 bg-background/90 px-3 py-2 rounded-xl border border-border/50 shadow-2xl hidden sm:flex items-center gap-3 z-20"
        style={{ backfaceVisibility: "hidden", WebkitFontSmoothing: "antialiased", z: 0 }}
        initial={{ opacity: 0, x: 20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
      >
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
          <Zap className="w-4 h-4 text-blue-500" />
        </div>
        <div className="pr-1">
          <p className="text-xs font-bold leading-tight">Synced</p>
          <p className="text-[10px] text-muted-foreground hidden lg:block leading-tight mt-0.5">Transactions updated</p>
        </div>
      </motion.div>
    </div>
  );
};
