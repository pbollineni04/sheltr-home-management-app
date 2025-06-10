
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Filter, 
  Calendar, 
  Wrench, 
  ShoppingBag, 
  Home, 
  Search 
} from "lucide-react";

const HomeTimeline = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const timelineEvents = [
    {
      id: 1,
      title: "New Water Heater Installation",
      description: "Replaced old 40-gallon unit with high-efficiency tankless system",
      date: "2024-05-15",
      category: "renovation",
      room: "Basement",
      cost: 2800,
      tags: ["plumbing", "water heater"]
    },
    {
      id: 2,
      title: "HVAC Filter Replacement",
      description: "Monthly maintenance - replaced all air filters",
      date: "2024-05-10",
      category: "maintenance",
      room: "Basement",
      cost: 45,
      tags: ["hvac", "maintenance"]
    },
    {
      id: 3,
      title: "Kitchen Appliance Purchase",
      description: "New stainless steel refrigerator from Samsung",
      date: "2024-04-22",
      category: "purchase",
      room: "Kitchen",
      cost: 1899,
      tags: ["appliances", "kitchen"]
    },
    {
      id: 4,
      title: "Annual Home Inspection",
      description: "Comprehensive inspection before insurance renewal",
      date: "2024-04-01",
      category: "inspection",
      room: "Whole House",
      cost: 350,
      tags: ["inspection", "insurance"]
    }
  ];

  const categories = [
    { id: "all", label: "All Events", icon: Calendar, color: "gray" },
    { id: "renovation", label: "Renovation", icon: Home, color: "blue" },
    { id: "maintenance", label: "Maintenance", icon: Wrench, color: "green" },
    { id: "purchase", label: "Purchase", icon: ShoppingBag, color: "purple" },
    { id: "inspection", label: "Inspection", icon: Search, color: "orange" }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      renovation: "bg-blue-100 text-blue-800",
      maintenance: "bg-green-100 text-green-800",
      purchase: "bg-purple-100 text-purple-800",
      inspection: "bg-orange-100 text-orange-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredEvents = timelineEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Home Timeline</h2>
          <p className="text-gray-600">Chronicle every major event in your home</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <IconComponent className="w-4 h-4" />
                {category.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredEvents.map((event, index) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                    <Badge className={getCategoryColor(event.category)}>
                      {event.category}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{event.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      {event.room}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${event.cost.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Total Cost</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your filters or add your first event.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HomeTimeline;
