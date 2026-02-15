import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, CheckSquare, Calendar, FileText, TrendingUp, Clock, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: DollarSign,
    title: "Expense Tracking",
    description: "Track every home expense with Plaid integration. Auto-categorize transactions, set budgets, and monitor spending in real-time.",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-950/30",
    mockUI: () => (
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Monthly Spending</span>
          <span className="text-xs text-muted-foreground">Feb 2026</span>
        </div>
        <div className="text-3xl font-bold text-foreground">$2,847</div>
        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
          <TrendingUp className="w-3 h-3" />
          12% under budget
        </div>
        <div className="space-y-2 pt-2">
          {[
            { label: "Utilities", amount: "$420", pct: 60 },
            { label: "Maintenance", amount: "$890", pct: 85 },
            { label: "Services", amount: "$340", pct: 45 },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{item.label}</span>
                <span>{item.amount}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 dark:bg-green-400 rounded-full" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: CheckSquare,
    title: "Task Management",
    description: "Never miss maintenance, shopping, or renovation tasks. Organize by lists, set due dates, and track by room.",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-950/30",
    mockUI: () => (
      <div className="space-y-2 p-4">
        <div className="text-sm font-semibold text-foreground mb-3">Maintenance Tasks</div>
        {[
          { text: "Replace HVAC filter", done: true, due: "Done" },
          { text: "Clean gutters", done: false, due: "Mar 1" },
          { text: "Test smoke detectors", done: false, due: "Mar 15" },
          { text: "Service water heater", done: false, due: "Apr 1" },
        ].map((task) => (
          <div key={task.text} className="flex items-center gap-3 p-2 rounded-lg bg-background/60">
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${task.done ? "bg-blue-500 border-blue-500" : "border-muted-foreground/30"}`}>
              {task.done && <CheckSquare className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-xs flex-1 ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.text}</span>
            <span className="text-xs text-muted-foreground">{task.due}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Calendar,
    title: "Home Timeline",
    description: "Build a complete history of your home. Automatically create timeline entries from completed tasks and major expenses.",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-950/30",
    mockUI: () => (
      <div className="space-y-3 p-4">
        <div className="text-sm font-semibold text-foreground mb-3">Recent History</div>
        {[
          { title: "Roof inspection", date: "Feb 10", icon: "🏠", cat: "Inspection" },
          { title: "New dishwasher", date: "Jan 28", icon: "🔧", cat: "Purchase" },
          { title: "Furnace serviced", date: "Jan 15", icon: "⚙️", cat: "Maintenance" },
        ].map((event, i) => (
          <div key={event.title} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-sm">{event.icon}</div>
              {i < 2 && <div className="w-0.5 flex-1 bg-border mt-1" />}
            </div>
            <div className="pb-3">
              <p className="text-xs font-medium text-foreground">{event.title}</p>
              <div className="flex gap-2 items-center">
                <span className="text-xs text-muted-foreground">{event.date}</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400">{event.cat}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: FileText,
    title: "Document Storage",
    description: "Store and organize all home-related documents. Categorize by type, search instantly, and keep everything secure.",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-950/30",
    mockUI: () => (
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-foreground">Documents</span>
          <FolderOpen className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "Home Insurance", type: "PDF", size: "2.1 MB" },
            { name: "Roof Warranty", type: "PDF", size: "840 KB" },
            { name: "HVAC Manual", type: "PDF", size: "5.4 MB" },
            { name: "Property Tax", type: "PDF", size: "1.2 MB" },
          ].map((doc) => (
            <div key={doc.name} className="p-2.5 rounded-lg bg-background/60 space-y-1">
              <div className="w-6 h-7 rounded bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <p className="text-xs font-medium text-foreground truncate">{doc.name}</p>
              <p className="text-xs text-muted-foreground">{doc.size}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 sm:py-32 bg-muted/30">
      <div className="container px-4 sm:px-8">
        <motion.div
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Everything You Need to Manage Your Home
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to keep your home organized and your life simplified.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="card-luxury overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="p-6 sm:p-8 space-y-4">
                    <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Mock UI preview */}
                  <div className="relative border-t bg-muted/40">
                    <feature.mockUI />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
