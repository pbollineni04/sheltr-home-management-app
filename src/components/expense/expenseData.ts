import {
  Home,
  Calendar,
  Wrench,
  ShoppingBag,
  Lightbulb
} from "lucide-react";

export const expenses = [
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

export const categories = [
  { id: "renovation", label: "Renovation", icon: Home, color: "blue", amount: 2800 },
  { id: "maintenance", label: "Maintenance", icon: Wrench, color: "green", amount: 45 },
  { id: "appliances", label: "Appliances", icon: ShoppingBag, color: "purple", amount: 1899 },
  { id: "services", label: "Services", icon: Calendar, color: "orange", amount: 350 },
  { id: "utilities", label: "Utilities", icon: Lightbulb, color: "yellow", amount: 67 }
];

export const getCategoryColor = (category: string) => {
  const colors = {
    renovation: "bg-blue-100 text-blue-800",
    maintenance: "bg-green-100 text-green-800",
    appliances: "bg-purple-100 text-purple-800",
    services: "bg-orange-100 text-orange-800",
    utilities: "bg-yellow-100 text-yellow-800"
  };
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
};