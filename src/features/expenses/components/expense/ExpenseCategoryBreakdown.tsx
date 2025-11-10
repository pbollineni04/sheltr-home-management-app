import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home, 
  Calendar, 
  Wrench,
  ShoppingBag,
  Lightbulb
} from "lucide-react";

interface Category {
  id: string;
  label: string;
  icon: any;
  color: string;
  amount: number;
}

interface ExpenseCategoryBreakdownProps {
  categories: Category[];
}

export const ExpenseCategoryBreakdown = ({ categories }: ExpenseCategoryBreakdownProps) => {
  // Calculate total for percentages
  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <Card className="card-luxury">
      <CardHeader>
        <CardTitle className="text-heading-xl text-foreground">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="text-sm text-muted-foreground p-4">No expenses in categories yet.</div>
        ) : (
          <>
            {/* Legends */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => {
                const colorClasses = {
                  blue: { bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-600" },
                  green: { bg: "bg-green-100 dark:bg-green-900/20", text: "text-green-700 dark:text-green-400", dot: "bg-green-600" },
                  purple: { bg: "bg-purple-100 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-400", dot: "bg-purple-600" },
                  orange: { bg: "bg-orange-100 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-600" },
                  yellow: { bg: "bg-yellow-100 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-400", dot: "bg-yellow-600" }
                } as const;
                const { bg, text, dot } =
                  colorClasses[category.color as keyof typeof colorClasses] ?? {
                    bg: "bg-gray-100 dark:bg-gray-900/20",
                    text: "text-gray-700 dark:text-gray-400",
                    dot: "bg-gray-600"
                  };
                return (
                  <span key={`legend-${category.id}`} className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${bg} ${text}`}>
                    <span className={`w-2 h-2 rounded-full ${dot}`} />
                    {category.label}
                  </span>
                );
              })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const percentage = total > 0 ? ((category.amount / total) * 100).toFixed(1) : 0;
                const colorClasses = {
                  blue: { bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400", badge: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
                  green: { bg: "bg-green-100 dark:bg-green-900/20", text: "text-green-600 dark:text-green-400", badge: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800" },
                  purple: { bg: "bg-purple-100 dark:bg-purple-900/20", text: "text-purple-600 dark:text-purple-400", badge: "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
                  orange: { bg: "bg-orange-100 dark:bg-orange-900/20", text: "text-orange-600 dark:text-orange-400", badge: "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800" },
                  yellow: { bg: "bg-yellow-100 dark:bg-yellow-900/20", text: "text-yellow-600 dark:text-yellow-400", badge: "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800" }
                } as const;
                const { bg, text, badge } =
                  colorClasses[category.color as keyof typeof colorClasses] ?? {
                    bg: "bg-gray-100 dark:bg-gray-900/20",
                    text: "text-gray-600 dark:text-gray-400",
                    badge: "bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                  };

                return (
                  <div
                    key={category.id}
                    className="card-luxury p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
                        <IconComponent className={`w-5 h-5 ${text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">{category.label}</p>
                        <p className="text-xl font-bold text-foreground">
                          ${category.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${text.replace('text-', 'bg-')}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground shrink-0">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};