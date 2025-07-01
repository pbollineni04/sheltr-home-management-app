
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Home,
  Wrench,
  ShoppingBag,
  Lightbulb
} from "lucide-react";

const ExpenseTracker = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const expenses = [
    {
      id: 1,
      description: "Water Heater Installation",
      amount: 2800,
      category: "renovation",
      date: "2024-05-15",
      vendor: "Smith Plumbing",
      room: "Basement"
    },
    {
      id: 2,
      description: "HVAC Filters",
      amount: 45,
      category: "maintenance",
      date: "2024-05-10",
      vendor: "Home Depot",
      room: "Basement"
    },
    {
      id: 3,
      description: "Samsung Refrigerator",
      amount: 1899,
      category: "appliances",
      date: "2024-04-22",
      vendor: "Best Buy",
      room: "Kitchen"
    },
    {
      id: 4,
      description: "Home Inspection",
      amount: 350,
      category: "services",
      date: "2024-04-01",
      vendor: "ABC Home Inspections",
      room: "Whole House"
    },
    {
      id: 5,
      description: "LED Light Bulbs",
      amount: 67,
      category: "utilities",
      date: "2024-05-08",
      vendor: "Amazon",
      room: "Whole House"
    }
  ];

  const categories = [
    { id: "renovation", label: "Renovation", icon: Home, color: "blue", amount: 2800 },
    { id: "maintenance", label: "Maintenance", icon: Wrench, color: "green", amount: 45 },
    { id: "appliances", label: "Appliances", icon: ShoppingBag, color: "purple", amount: 1899 },
    { id: "services", label: "Services", icon: Calendar, color: "orange", amount: 350 },
    { id: "utilities", label: "Utilities", icon: Lightbulb, color: "yellow", amount: 67 }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      renovation: "bg-blue-100 text-blue-800",
      maintenance: "bg-green-100 text-green-800",
      appliances: "bg-purple-100 text-purple-800",
      services: "bg-orange-100 text-orange-800",
      utilities: "bg-yellow-100 text-yellow-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = expenses
    .filter(expense => new Date(expense.date).getMonth() === new Date().getMonth())
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Expense Tracker</h2>
          <p className="text-muted-foreground">Monitor all home-related spending</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold text-foreground">${thisMonthExpenses.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm text-green-600 mt-2">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-3xl font-bold text-foreground">${totalExpenses.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg per Month</p>
                <p className="text-3xl font-bold text-foreground">${Math.round(totalExpenses / 12).toLocaleString()}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">12 month average</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
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

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium text-foreground">{expense.description}</h4>
                    <Badge className={getCategoryColor(expense.category)}>
                      {expense.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{expense.vendor}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      {expense.room}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">${expense.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTracker;
