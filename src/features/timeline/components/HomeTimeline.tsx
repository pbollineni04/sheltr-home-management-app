import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Wrench,
  ShoppingBag,
  Home,
  Search,
  CheckSquare,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Zap
} from "lucide-react";
import { useTimeline } from "../hooks/useTimeline";
import AddTimelineEventDialog from "./AddTimelineEventDialog";
import { cn } from "@/lib/utils";

const HomeTimeline = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<"year" | "6months" | "all">("year");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [collapsedYears, setCollapsedYears] = useState<Set<string>>(new Set());
  const [collapsedMonths, setCollapsedMonths] = useState<Set<string>>(new Set());

  const { events, loading, deleteEvent } = useTimeline();

  // Category configuration with icons and colors
  const categories = {
    renovation: {
      label: "Renovation",
      icon: Home,
      color: "bg-blue-600",
      borderColor: "border-l-blue-600 dark:border-l-blue-500",
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    },
    maintenance: {
      label: "Maintenance",
      icon: Wrench,
      color: "bg-green-600",
      borderColor: "border-l-green-600 dark:border-l-green-500",
      badgeColor: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    },
    purchase: {
      label: "Purchase",
      icon: ShoppingBag,
      color: "bg-purple-600",
      borderColor: "border-l-purple-600 dark:border-l-purple-500",
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
    },
    inspection: {
      label: "Inspection",
      icon: FileText,
      color: "bg-orange-600",
      borderColor: "border-l-orange-600 dark:border-l-orange-500",
      badgeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
    }
  };

  // Get source badge info
  const getSourceInfo = (event: any) => {
    if (event.task_id) {
      return { label: "Auto from Task", icon: CheckSquare, color: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800" };
    }
    if (event.metadata?.source === 'expense' || event.metadata?.source === 'plaid') {
      return { label: "Auto from Expense", icon: Zap, color: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800" };
    }
    return null;
  };

  // Apply filters and presets
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Apply date preset filter
    const now = new Date();
    if (selectedPreset === "year") {
      const yearAgo = new Date(now.getFullYear(), 0, 1);
      filtered = filtered.filter(e => new Date(e.date) >= yearAgo);
    } else if (selectedPreset === "6months") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      filtered = filtered.filter(e => new Date(e.date) >= sixMonthsAgo);
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchLower) ||
        e.description?.toLowerCase().includes(searchLower) ||
        e.room?.toLowerCase().includes(searchLower) ||
        e.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [events, selectedPreset, selectedCategory, searchTerm]);

  // Group events by year and month
  const groupedEvents = useMemo(() => {
    const groups: Record<string, Record<string, typeof filteredEvents>> = {};

    filteredEvents.forEach(event => {
      const date = new Date(event.date);
      const year = date.getFullYear().toString();
      const month = date.toLocaleString('default', { month: 'long' });

      if (!groups[year]) groups[year] = {};
      if (!groups[year][month]) groups[year][month] = [];

      groups[year][month].push(event);
    });

    return groups;
  }, [filteredEvents]);

  const toggleYear = (year: string) => {
    const newCollapsed = new Set(collapsedYears);
    if (newCollapsed.has(year)) {
      newCollapsed.delete(year);
    } else {
      newCollapsed.add(year);
    }
    setCollapsedYears(newCollapsed);
  };

  const toggleMonth = (yearMonth: string) => {
    const newCollapsed = new Set(collapsedMonths);
    if (newCollapsed.has(yearMonth)) {
      newCollapsed.delete(yearMonth);
    } else {
      newCollapsed.add(yearMonth);
    }
    setCollapsedMonths(newCollapsed);
  };

  if (loading) {
    return (
      <div className="space-y-6 px-3 sm:px-4">
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-muted-foreground">Loading timeline...</div>
        </div>
      </div>
    );
  }

  const sortedYears = Object.keys(groupedEvents).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-6 px-3 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-heading-xl text-foreground">Home Timeline</h2>
          <p className="text-body-luxury text-muted-foreground">Your home's complete service history</p>
        </div>
        <AddTimelineEventDialog />
      </div>

      {/* Simplified Filters */}
      <Card className="card-luxury p-4 sm:p-6">
        <div className="space-y-4">
          {/* Preset Filters */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Time Range</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedPreset === "year" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPreset("year")}
                className={cn(
                  "transition-all duration-200",
                  selectedPreset === "year" ? "btn-primary-luxury shadow-md" : "btn-secondary-luxury hover:border-primary/50"
                )}
              >
                This Year
              </Button>
              <Button
                variant={selectedPreset === "6months" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPreset("6months")}
                className={cn(
                  "transition-all duration-200",
                  selectedPreset === "6months" ? "btn-primary-luxury shadow-md" : "btn-secondary-luxury hover:border-primary/50"
                )}
              >
                Last 6 Months
              </Button>
              <Button
                variant={selectedPreset === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPreset("all")}
                className={cn(
                  "transition-all duration-200",
                  selectedPreset === "all" ? "btn-primary-luxury shadow-md" : "btn-secondary-luxury hover:border-primary/50"
                )}
              >
                All Time
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Category</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "transition-all duration-200",
                  selectedCategory === null ? "btn-primary-luxury shadow-md" : "btn-secondary-luxury hover:border-primary/50"
                )}
              >
                All Categories
              </Button>
              {Object.entries(categories).map(([key, cat]) => {
                const IconComponent = cat.icon;
                return (
                  <Button
                    key={key}
                    variant={selectedCategory === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(key)}
                    className={cn(
                      "transition-all duration-200",
                      selectedCategory === key ? "btn-primary-luxury shadow-md" : "btn-secondary-luxury hover:border-primary/50"
                    )}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {cat.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Search */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Search</h3>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-luxury transition-all duration-200 focus:shadow-md"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Visual Timeline */}
      <div className="relative">
        {sortedYears.length === 0 ? (
          <Card className="card-luxury">
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-heading-xl text-foreground">No events found</h3>
              <p className="text-body-luxury text-muted-foreground">Try adjusting your filters or add your first event.</p>
            </CardContent>
          </Card>
        ) : (
          sortedYears.map((year) => {
            const isYearCollapsed = collapsedYears.has(year);
            const monthsInYear = Object.keys(groupedEvents[year]).sort((a, b) => {
              const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June',
                                'July', 'August', 'September', 'October', 'November', 'December'];
              return monthOrder.indexOf(b) - monthOrder.indexOf(a);
            });

            return (
              <div key={year} className="mb-8">
                {/* Year Header */}
                <div
                  className="flex items-center gap-4 mb-8 cursor-pointer group"
                  onClick={() => toggleYear(year)}
                >
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-border to-border"></div>
                  <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-br from-muted/80 to-muted/50 hover:from-muted hover:to-muted/70 transition-all duration-200 shadow-sm hover:shadow-md border border-border/50">
                    <span className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{year}</span>
                    {isYearCollapsed ? (
                      <ChevronDown className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                    ) : (
                      <ChevronUp className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </div>
                  <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-border to-border"></div>
                </div>

                {/* Timeline Events for Year */}
                {!isYearCollapsed && (
                  <div className="relative pl-8 sm:pl-12">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-[14px] sm:left-[22px] top-0 bottom-0 w-1 bg-gradient-to-b from-border via-border/50 to-transparent rounded-full"></div>

                    {monthsInYear.map((month, monthIdx) => {
                      const monthKey = `${year}-${month}`;
                      const isMonthCollapsed = collapsedMonths.has(monthKey);
                      const eventsInMonth = groupedEvents[year][month];

                      return (
                        <div key={monthKey} className="mb-8">
                          {/* Month Header */}
                          <div
                            className="flex items-center gap-3 mb-6 cursor-pointer group"
                            onClick={() => toggleMonth(monthKey)}
                          >
                            <div className="absolute left-[6px] sm:left-[14px] w-5 h-5 rounded-full bg-primary border-[3px] border-background shadow-lg group-hover:scale-110 transition-transform duration-200 z-10"></div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-all duration-200 ml-6 border border-border/30 hover:border-border/50 shadow-sm">
                              <span className="text-lg font-bold text-foreground">{month}</span>
                              <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                                {eventsInMonth.length}
                              </span>
                              {isMonthCollapsed ? (
                                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                              ) : (
                                <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                              )}
                            </div>
                          </div>

                          {/* Events in Month */}
                          {!isMonthCollapsed && (
                            <div className="space-y-6 ml-6 animate-in fade-in duration-300">
                              {eventsInMonth.map((event) => {
                                const categoryInfo = categories[event.category as keyof typeof categories];
                                const CategoryIcon = categoryInfo?.icon || Calendar;
                                const sourceInfo = getSourceInfo(event);
                                const SourceIcon = sourceInfo?.icon;

                                return (
                                  <div key={event.id} className="relative group/event">
                                    {/* Timeline Dot with Glow */}
                                    <div className="absolute left-[-22px] sm:left-[-26px] top-6 z-10">
                                      <div
                                        className={cn(
                                          "w-4 h-4 rounded-full border-[3px] border-background shadow-lg group-hover/event:scale-125 transition-transform duration-200",
                                          categoryInfo?.color || "bg-gray-600"
                                        )}
                                      ></div>
                                      {/* Connecting Line to Card */}
                                      <div className="absolute left-4 top-2 w-[18px] sm:w-[22px] h-[2px] bg-border"></div>
                                    </div>

                                    {/* Event Card */}
                                    <Card className={cn(
                                      "card-luxury hover:shadow-lg transition-all duration-200 border-l-4",
                                      categoryInfo?.borderColor || "border-l-gray-600 dark:border-l-gray-500"
                                    )}>
                                      <CardContent className="p-4 sm:p-5">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                          <div className="flex-1 min-w-0">
                                            {/* Title and Badges */}
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                              <div className="flex items-start gap-2 flex-wrap min-w-0">
                                                <h3 className="text-lg font-semibold text-foreground break-words">
                                                  {event.title}
                                                </h3>
                                                {sourceInfo && SourceIcon && (
                                                  <Badge variant="outline" className={cn("shrink-0", sourceInfo.color)}>
                                                    <SourceIcon className="w-3 h-3 mr-1" />
                                                    {sourceInfo.label}
                                                  </Badge>
                                                )}
                                              </div>
                                              <div className="flex items-center gap-2 shrink-0">
                                                <Badge className={categoryInfo?.badgeColor}>
                                                  {categoryInfo?.label || event.category}
                                                </Badge>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => deleteEvent(event.id)}
                                                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                                >
                                                  <Trash2 className="w-4 h-4" />
                                                </Button>
                                              </div>
                                            </div>

                                            {/* Description */}
                                            {event.description && (
                                              <p className="text-sm text-muted-foreground mb-3 break-words">
                                                {event.description}
                                              </p>
                                            )}

                                            {/* Tags */}
                                            {event.tags && event.tags.length > 0 && (
                                              <div className="flex flex-wrap gap-2 mb-3">
                                                {event.tags.map((tag) => (
                                                  <Badge key={tag} variant="outline" className="text-xs">
                                                    {tag}
                                                  </Badge>
                                                ))}
                                              </div>
                                            )}

                                            {/* Metadata */}
                                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                                              <span className="flex items-center gap-1 shrink-0">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(event.date).toLocaleDateString('en-US', {
                                                  month: 'short',
                                                  day: 'numeric',
                                                  year: 'numeric'
                                                })}
                                              </span>
                                              {event.room && (
                                                <span className="flex items-center gap-1 shrink-0">
                                                  <Home className="w-4 h-4" />
                                                  {event.room}
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          {/* Cost Display */}
                                          {event.cost && (
                                            <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0">
                                              <p className="text-xl font-bold text-foreground">
                                                ${event.cost.toLocaleString()}
                                              </p>
                                              <p className="text-sm text-muted-foreground">Total Cost</p>
                                            </div>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HomeTimeline;
