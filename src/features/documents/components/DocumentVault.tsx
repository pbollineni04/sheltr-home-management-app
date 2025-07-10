"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Star,
  Archive,
  FolderOpen,
  BarChart3,
  ShieldCheck,
  Lock,
} from "lucide-react"
import { useDocuments } from "@/hooks/useDocuments"
import type { DocumentFilter, DocumentCategory } from "@/types/document"
import { categoryIcons, getCategoryColor } from "@/utils/categoryIcons"
import DocumentUploadDialog from "./document/DocumentUploadDialog"
import DocumentCard from "./document/DocumentCard"
import DocumentList from "./document/DocumentList"
import DocumentFilters from "./document/DocumentFilters"
import DocumentStats from "./document/DocumentStats"
import FolderView from "./document/FolderView"

const CATEGORIES: { value: DocumentCategory; label: string; color: string }[] = [
  { value: "personal", label: "Personal", color: getCategoryColor("personal") },
  { value: "financial", label: "Financial", color: getCategoryColor("financial") },
  { value: "legal", label: "Legal", color: getCategoryColor("legal") },
  { value: "medical", label: "Medical", color: getCategoryColor("medical") },
  { value: "insurance", label: "Insurance", color: getCategoryColor("insurance") },
  { value: "warranty", label: "Warranty", color: getCategoryColor("warranty") },
  { value: "tax", label: "Tax", color: getCategoryColor("tax") },
  { value: "property", label: "Property", color: getCategoryColor("property") },
  { value: "education", label: "Education", color: getCategoryColor("education") },
  { value: "employment", label: "Employment", color: getCategoryColor("employment") },
  { value: "travel", label: "Travel", color: getCategoryColor("travel") },
  { value: "automotive", label: "Automotive", color: getCategoryColor("automotive") },
  { value: "other", label: "Other", color: getCategoryColor("other") },
]

const DocumentVault = () => {
  const { documents, loading, fetchDocuments, getDocumentStats } = useDocuments()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<DocumentFilter>({})
  const [viewMode, setViewMode] = useState<"grid" | "list" | "folders">("grid")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | "all">("all")
  const [showFavorites, setShowFavorites] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

  const stats = getDocumentStats()

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || doc.category_enum === selectedCategory
    const matchesFavorites = !showFavorites || doc.is_favorite
    const matchesArchived = showArchived ? doc.archived : !doc.archived

    return matchesSearch && matchesCategory && matchesFavorites && matchesArchived
  })

  const handleFilterChange = (filter: DocumentFilter) => {
    setActiveFilter(filter)
    fetchDocuments(filter)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <div className="relative">
            <ShieldCheck className="w-6 h-6 text-primary-foreground" />
            <Lock className="w-3 h-3 text-primary-foreground absolute -bottom-1 -right-1" />
          </div>
        </div>
        <h2 className="text-3xl font-bold">Document Vault</h2>
        <p className="text-muted-foreground">Secure storage and management for all your important documents</p>
      </div>

      {/* Quick Stats */}
      <DocumentStats stats={stats} />

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search documents, tags, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "folders" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("folders")}
            >
              <FolderOpen className="w-4 h-4" />
            </Button>
          </div>

          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary/80">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
              </DialogHeader>
              <DocumentUploadDialog onClose={() => setIsUploadDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      {isFilterOpen && <DocumentFilters onFilterChange={handleFilterChange} onClose={() => setIsFilterOpen(false)} />}

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
          className="gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          All Documents
        </Button>
        {CATEGORIES.map((category) => {
          const CategoryIcon = categoryIcons[category.value]
          return (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="gap-2"
            >
              <CategoryIcon className="w-4 h-4" />
              {category.label}
            </Button>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant={showFavorites ? "default" : "outline"}
          size="sm"
          onClick={() => setShowFavorites(!showFavorites)}
        >
          <Star className="w-4 h-4 mr-2" />
          Favorites
        </Button>
        <Button variant={showArchived ? "default" : "outline"} size="sm" onClick={() => setShowArchived(!showArchived)}>
          <Archive className="w-4 h-4 mr-2" />
          {showArchived ? "Hide Archived" : "Show Archived"}
        </Button>
      </div>

      {/* Document Display */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4 w-2/3"></div>
                <div className="h-2 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <ShieldCheck className="w-10 h-10 text-muted-foreground" />
              <Lock className="w-4 h-4 text-muted-foreground absolute -bottom-1 -right-1" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== "all" || showFavorites || showArchived
                ? "No documents match your current filters."
                : "Get started by uploading your first document to the vault."}
            </p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {viewMode === "folders" ? (
            <FolderView documents={filteredDocuments} />
          ) : viewMode === "list" ? (
            <DocumentList documents={filteredDocuments} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DocumentVault
