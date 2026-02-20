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
        <div className="space-y-4 pt-2">
          {[
            { label: "Utilities", amount: "$420", pct: 60, delay: 0.1 },
            { label: "Maintenance", amount: "$890", pct: 85, delay: 0.2 },
            { label: "Services", amount: "$340", pct: 45, delay: 0.3 },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{item.label}</span>
                <span>{item.amount}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full w-full bg-green-500 dark:bg-green-400 rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: item.pct / 100 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut", delay: item.delay }}
                />
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
          { text: "Replace HVAC filter", done: true, due: "Done", delay: 0.1 },
          { text: "Clean gutters", done: false, due: "Mar 1", delay: 0.2 },
          { text: "Test smoke detectors", done: false, due: "Mar 15", delay: 0.3 },
          { text: "Service water heater", done: false, due: "Apr 1", delay: 0.4 },
        ].map((task, i) => (
          <motion.div
            key={task.text}
            className="flex items-center gap-3 p-2.5 rounded-lg bg-background/80 shadow-sm"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: task.delay }}
          >
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${task.done ? "bg-blue-500 border-blue-500" : "border-muted-foreground/30"}`}>
              {task.done && <CheckSquare className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-xs flex-1 ${task.done ? "line-through text-muted-foreground" : "text-foreground font-medium"}`}>{task.text}</span>
            <span className="text-[10px] text-muted-foreground font-medium">{task.due}</span>
          </motion.div>
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
          { title: "Roof inspection", date: "Feb 10", icon: "🏠", cat: "Inspection", delay: 0.1 },
          { title: "New dishwasher", date: "Jan 28", icon: "🔧", cat: "Purchase", delay: 0.3 },
          { title: "Furnace serviced", date: "Jan 15", icon: "⚙️", cat: "Maintenance", delay: 0.5 },
        ].map((event, i) => (
          <motion.div
            key={event.title}
            className="flex gap-4"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: event.delay }}
          >
            <div className="flex flex-col items-center">
              <motion.div
                className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-lg shadow-sm"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: event.delay }}
              >
                {event.icon}
              </motion.div>
              {i < 2 && (
                <motion.div
                  className="w-0.5 h-8 bg-purple-200 dark:bg-purple-900/50 mt-2 origin-top"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: event.delay + 0.2 }}
                />
              )}
            </div>
            <div className="pb-4 pt-1">
              <p className="text-sm font-semibold text-foreground">{event.title}</p>
              <div className="flex gap-2 items-center mt-1">
                <span className="text-xs text-muted-foreground">{event.date}</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">{event.cat}</span>
              </div>
            </div>
          </motion.div>
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
            { name: "Home Insurance", type: "PDF", size: "2.1 MB", delay: 0.1 },
            { name: "Roof Warranty", type: "PDF", size: "840 KB", delay: 0.2 },
            { name: "HVAC Manual", type: "PDF", size: "5.4 MB", delay: 0.3 },
            { name: "Property Tax", type: "PDF", size: "1.2 MB", delay: 0.4 },
          ].map((doc) => (
            <motion.div
              key={doc.name}
              className="p-3 rounded-xl bg-background border border-border/50 shadow-sm space-y-2 hover:border-orange-200 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: doc.delay }}
            >
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
                <FileText className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground truncate">{doc.name}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400">{doc.type}</span>
                  <span className="text-[10px] text-muted-foreground">{doc.size}</span>
                </div>
              </div>
            </motion.div>
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
