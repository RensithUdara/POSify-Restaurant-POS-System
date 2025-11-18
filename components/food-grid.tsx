"use client"

import { FoodCard } from "./food-card"
import { useMobile } from "@/hooks/use-mobile"
import { usePOS } from "@/context/POSContext"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState, useMemo } from "react"

export function FoodGrid() {
  const isMobile = useMobile()
  const { state } = usePOS()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = useMemo(() => {
    let items = state.menuItems

    // Filter by category
    if (state.selectedCategory && state.selectedCategory !== 'all') {
      items = items.filter(item => item.category === state.selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.ingredients?.some(ingredient => ingredient.toLowerCase().includes(query))
      )
    }

    return items
  }, [state.menuItems, state.selectedCategory, searchQuery])

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No items found</div>
          <p className="text-gray-400">
            {searchQuery.trim() 
              ? "Try adjusting your search terms" 
              : "No items available in this category"
            }
          </p>
        </div>
      ) : (
        <div className={`grid ${isMobile ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"} gap-4`}>
          {filteredItems.map((item) => (
            <FoodCard key={item.id} menuItem={item} />
          ))}
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-gray-500 text-center">
        Showing {filteredItems.length} of {state.menuItems.length} items
      </div>
    </div>
  )
}
