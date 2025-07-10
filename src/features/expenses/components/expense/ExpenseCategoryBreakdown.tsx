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
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const colorClasses = {
              blue: { bg: "bg-blue-100", text: "text-blue-600" },
              green: { bg: "bg-green-100", text: "text-green-600" },
              purple: { bg: "bg-purple-100", text: "text-purple-600" },
              orange: { bg: "bg-orange-100", text: "text-orange-600" },
              yellow: { bg: "bg-yellow-100", text: "text-yellow-600" }
            } as const;
            const { bg, text } =
              colorClasses[category.color as keyof typeof colorClasses] ?? {
                bg: "bg-gray-100",
                text: "text-gray-600"
              };

            return (
              <div
                key={category.id}
                className="flex items-center gap-3 p-4 rounded-lg border"
              >
                <div
                  className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}
                >
                  <IconComponent className={`w-5 h-5 ${text}`} />
                </div>
                <div>
                  <p className="font-medium text-foreground">{category.label}</p>
                  <p className="text-lg font-bold text-foreground">
                    ${category.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};