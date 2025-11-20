"use client"

import { FoodCard } from "./food-card"
import { SearchFilter, FilterOptions } from "./search-filter"
import { useMobile } from "@/hooks/use-mobile"
import { usePOS } from "@/context/POSContext"
import { useState, useMemo } from "react"
import { MenuItem } from "@/types"

const DEFAULT_FILTERS: FilterOptions = {
  category: 'all',
  priceRange: [0, 100],
  type: 'all',
  availability: 'available',
  sortBy: 'name'
}

export function FoodGrid() {
  const isMobile = useMobile()
  const { state } = usePOS()
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS)

  const filteredAndSortedItems = useMemo(() => {
    let items = state.menuItems

    // Filter by category
    if (filters.category !== 'all') {
      items = items.filter(item => item.category === filters.category)
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

    // Filter by type
    if (filters.type !== 'all') {
      items = items.filter(item => item.type === filters.type)
    }

    // Filter by availability
    if (filters.availability === 'available') {
      items = items.filter(item => item.available)
    } else if (filters.availability === 'unavailable') {
      items = items.filter(item => !item.available)
    }

    // Filter by price range
    items = items.filter(item => {
      const price = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Sort items
    const sortedItems = [...items].sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-low':
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price
          return priceA - priceB
        case 'price-high':
          const priceA2 = a.discount ? a.price * (1 - a.discount / 100) : a.price
          const priceB2 = b.discount ? b.price * (1 - b.discount / 100) : b.price
          return priceB2 - priceA2
        case 'popular':
          // For now, sort by preparation time (shorter = more popular)
          return (a.preparationTime || 0) - (b.preparationTime || 0)
        default:
          return 0
      }
    })

    return sortedItems
  }, [state.menuItems, searchQuery, filters])

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <SearchFilter
        onSearch={setSearchQuery}
        onFilter={setFilters}
        searchQuery={searchQuery}
        filters={filters}
      />

      {/* Items Grid */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="h-8 w-8 text-gray-400" />
          </div>
          <div className="text-gray-600 text-lg mb-2 font-medium">No items found</div>
          <p className="text-gray-500 max-w-sm mx-auto">
            {searchQuery.trim() || JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS)
              ? "Try adjusting your search or filters to find what you're looking for"
              : "No items are currently available in our menu"
            }
          </p>
        </div>
      ) : (
        <div className={`grid ${isMobile ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"} gap-6`}>
          {filteredAndSortedItems.map((item) => (
            <FoodCard key={item.id} menuItem={item} />
          ))}
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-gray-500 text-center mt-6 py-4 border-t border-gray-100">
        <span className="font-medium">Showing {filteredAndSortedItems.length} of {state.menuItems.length} items</span>
        {(searchQuery.trim() || JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS)) &&
          <span className="text-green-600 ml-1">(filtered)</span>
        }
      </div>
    </div>
  )
}
