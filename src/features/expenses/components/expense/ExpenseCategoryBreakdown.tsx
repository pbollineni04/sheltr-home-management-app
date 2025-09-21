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
  return (
    <Card className="card-luxury">
      <CardHeader>
        <CardTitle className="text-heading-xl text-neutral-900">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Legends */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => {
            const colorClasses = {
              blue: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-600" },
              green: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-600" },
              purple: { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-600" },
              orange: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-600" },
              yellow: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-600" }
            } as const;
            const { bg, text, dot } =
              colorClasses[category.color as keyof typeof colorClasses] ?? {
                bg: "bg-gray-100",
                text: "text-gray-700",
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
            const colorClasses = {
              blue: { bg: "bg-blue-100", text: "text-blue-600", badge: "bg-blue-50 text-blue-700 border-blue-200" },
              green: { bg: "bg-green-100", text: "text-green-600", badge: "bg-green-50 text-green-700 border-green-200" },
              purple: { bg: "bg-purple-100", text: "text-purple-600", badge: "bg-purple-50 text-purple-700 border-purple-200" },
              orange: { bg: "bg-orange-100", text: "text-orange-600", badge: "bg-orange-50 text-orange-700 border-orange-200" },
              yellow: { bg: "bg-yellow-100", text: "text-yellow-600", badge: "bg-yellow-50 text-yellow-700 border-yellow-200" }
            } as const;
            const { bg, text, badge } =
              colorClasses[category.color as keyof typeof colorClasses] ?? {
                bg: "bg-gray-100",
                text: "text-gray-600",
                badge: "bg-gray-50 text-gray-700 border-gray-200"
              };

            return (
              <div
                key={category.id}
                className="card-luxury p-4 flex items-center gap-3"
              >
                <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 ${text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-luxury text-neutral-700">{category.label}</p>
                  <p className="text-heading-xl text-neutral-900">
                    ${category.amount.toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs border ${badge}`}>{category.label}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};