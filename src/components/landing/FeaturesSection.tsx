import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, CheckSquare, Calendar, FileText } from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Expense Tracking",
    description: "Track every home expense with Plaid integration. Auto-categorize transactions, set budgets, and monitor spending in real-time.",
    image: "expense-tracking",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-950/30"
  },
  {
    icon: CheckSquare,
    title: "Task Management",
    description: "Never miss maintenance, shopping, or renovation tasks. Organize by lists, set due dates, and track by room.",
    image: "task-management",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-950/30"
  },
  {
    icon: Calendar,
    title: "Home Timeline",
    description: "Build a complete history of your home. Automatically create timeline entries from completed tasks and major expenses.",
    image: "timeline",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-950/30"
  },
  {
    icon: FileText,
    title: "Document Storage",
    description: "Store and organize all home-related documents. Categorize by type, search instantly, and keep everything secure.",
    image: "documents",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-950/30"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 sm:py-32 bg-muted/30">
      <div className="container px-4 sm:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Everything You Need to Manage Your Home
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to keep your home organized and your life simplified.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <Card key={index} className="card-luxury overflow-hidden group hover:shadow-xl transition-all duration-300">
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

                {/* Screenshot placeholder */}
                <div className="relative h-64 bg-gradient-to-br from-muted to-muted/50 border-t">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2 p-6">
                      <div className={`w-12 h-12 mx-auto rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        {feature.title} Screenshot
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
