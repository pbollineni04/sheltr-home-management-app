"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, Wrench, ShoppingBag, Home, Search, CheckSquare, Filter, Trash2 } from "lucide-react"
import { useTimeline } from "@/features/timeline/hooks/useTimeline"
import AddTimelineEventDialog from "@/features/timeline/components/AddTimelineEventDialog"

const HomeTimeline = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const { events, loading, deleteEvent, refetch } = useTimeline()

  const categories = [
    { id: "all", label: "All Events", icon: Calendar, color: "gray" },
    { id: "renovation", label: "Renovation", icon: Home, color: "blue" },
    { id: "maintenance", label: "Maintenance", icon: Wrench, color: "green" },
    { id: "purchase", label: "Purchase", icon: ShoppingBag, color: "purple" },
    { id: "inspection", label: "Inspection", icon: Search, color: "orange" },
  ]

  const getCategoryColor = (category: string) => {
    const colors = {
      renovation: "bg-blue-100 text-blue-800",
      maintenance: "bg-green-100 text-green-800",
      purchase: "bg-purple-100 text-purple-800",
      inspection: "bg-orange-100 text-orange-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const applyFilters = () => {
    refetch({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      category: selectedCategory,
      searchTerm: searchTerm || undefined,
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setStartDate("")
    setEndDate("")
    refetch()
  }

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEvent(eventId)
  }

  const isTaskEvent = (event: any) => {
    return event.task_id || event.tags?.includes("task")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">Loading timeline...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Home Timeline</h2>
          <p className="text-gray-600">Chronicle every major event in your home</p>
        </div>
        <AddTimelineEventDialog />
      </div>

      {/* Enhanced Filters */}
      <div className="space-y-4">
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
          <div className="flex gap-2">
            <Button onClick={applyFilters} size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
            <Button onClick={clearFilters} variant="outline" size="sm">
              Clear
            </Button>
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Input type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => {
            const IconComponent = category.icon
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
            )
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                      {isTaskEvent(event) && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckSquare className="w-3 h-3 mr-1" />
                          Task
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {event.description && <p className="text-gray-600 mb-3">{event.description}</p>}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {event.tags?.map((tag) => (
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
                    {event.room && (
                      <span className="flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        {event.room}
                      </span>
                    )}
                  </div>
                </div>
                {event.cost && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">${event.cost.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total Cost</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your filters or add your first event.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default HomeTimeline
