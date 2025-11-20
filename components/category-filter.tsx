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
    <div className="flex gap-4 mb-8 overflow-x-auto pb-3 -mx-2 px-2 scrollbar-hide">
      {categoriesWithCounts.map((category) => (
        <div
          key={category.id}
          onClick={() => handleCategorySelect(category.id)}
          className={`flex flex-col items-center p-4 rounded-2xl min-w-[90px] sm:min-w-[110px] transition-all duration-300 transform hover:scale-105 ${state.selectedCategory === category.id
              ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-200 scale-105 ring-2 ring-green-300 ring-offset-2"
              : "bg-white text-gray-700 hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 hover:text-green-600 shadow-md hover:shadow-lg border border-gray-100"
            } cursor-pointer flex-shrink-0 group`}
        >
          <div className={`p-2 rounded-xl mb-2 transition-all duration-200 ${state.selectedCategory === category.id
              ? "bg-white/20"
              : "bg-gray-50 group-hover:bg-green-100"
            }`}>
            <category.icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-center leading-tight">{category.name}</span>
          <span className={`text-xs mt-1 font-medium ${state.selectedCategory === category.id ? 'text-white/80' : 'text-gray-500 group-hover:text-green-500'
            } ${isMobile ? 'hidden' : 'block'}`}>
            {category.count} Items
          </span>
        </div>
      ))}
    </div>
  )
}
