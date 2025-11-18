"use client"

import { Grid, Coffee, Soup, UtensilsCrossed, ChefHat, Sandwich, Apple, Pizza, Cake } from "lucide-react"
import { usePOS } from "@/context/POSContext"
import { useMobile } from "@/hooks/use-mobile"
import { useMemo } from "react"

const categoryIcons = {
  all: Grid,
  appetizers: Soup,
  mains: ChefHat,
  desserts: Cake,
  beverages: Coffee,
  salads: Apple,
  burgers: Sandwich,
  pizzas: Pizza,
}

export function CategoryFilter() {
  const { state, dispatch } = usePOS()
  const isMobile = useMobile()

  const categoriesWithCounts = useMemo(() => {
    return state.categories.map(category => {
      const count = category.id === 'all' 
        ? state.menuItems.length
        : state.menuItems.filter(item => item.category === category.id).length
      
      return {
        ...category,
        count,
        icon: categoryIcons[category.id as keyof typeof categoryIcons] || Grid
      }
    })
  }, [state.categories, state.menuItems])

  const handleCategorySelect = (categoryId: string) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: categoryId })
  }

  return (
    <div className="flex gap-3 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
      {categoriesWithCounts.map((category) => (
        <div
          key={category.id}
          onClick={() => handleCategorySelect(category.id)}
          className={`flex flex-col items-center p-3 rounded-xl min-w-[80px] sm:min-w-[100px] transition-all duration-200 ${
            state.selectedCategory === category.id 
              ? "bg-green-600 text-white shadow-lg scale-105" 
              : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-600"
          } border cursor-pointer flex-shrink-0`}
        >
          <category.icon className="h-5 w-5 sm:h-6 sm:w-6 mb-1" />
          <span className="text-xs sm:text-sm font-medium">{category.name}</span>
          <span className={`text-xs ${
            state.selectedCategory === category.id ? 'text-green-100' : 'text-gray-500'
          } ${isMobile ? 'hidden' : 'block'}`}>
            {category.count} Items
          </span>
        </div>
      ))}
    </div>
  )
}
