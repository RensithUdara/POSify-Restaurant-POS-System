"use client"

import { Grid, Coffee, Soup, UtensilsCrossed, ChefHat, Sandwich, Apple, Pizza, Cake, Clock, User, Users, ClipboardList } from "lucide-react"
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
    <div className="relative">
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
        {categoriesWithCounts.map((category, index) => {
          const isSelected = state.selectedCategory === category.id;
          return (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`relative flex flex-col items-center p-5 rounded-3xl min-w-[100px] sm:min-w-[120px] transition-all duration-500 transform hover:scale-110 active:scale-95 ${isSelected
                  ? "bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white shadow-2xl shadow-green-300/50 scale-110 ring-4 ring-green-200 ring-offset-4 ring-offset-white"
                  : "bg-white text-gray-700 hover:bg-gradient-to-br hover:from-green-50 hover:via-blue-50 hover:to-purple-50 hover:text-green-600 shadow-lg hover:shadow-xl border border-gray-200 hover:border-green-200"
                } cursor-pointer flex-shrink-0 group backdrop-blur-sm`}
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              {/* Animated background particles */}
              {isSelected && (
                <>
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white/20 rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 -left-1 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                  </div>
                </>n              )}
              
              <div className={`relative p-3 rounded-2xl mb-3 transition-all duration-300 ${isSelected
                  ? "bg-white/20 backdrop-blur-sm shadow-inner"
                  : "bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-green-100 group-hover:to-blue-100 shadow-sm"
                } group-hover:scale-110`}>
                <category.icon className={`h-6 w-6 sm:h-7 sm:w-7 transition-all duration-300 ${isSelected ? 'drop-shadow-sm' : 'group-hover:text-green-600'}`} />
                
                {/* Glow effect for selected category */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-2xl bg-white/10 animate-pulse"></div>
                )}
              </div>
              
              <div className="text-center space-y-1">
                <span className={`text-sm font-bold tracking-wide ${isSelected ? 'text-white drop-shadow-sm' : 'text-gray-800 group-hover:text-green-700'}`}>
                  {category.name}
                </span>
                <div className={`text-xs font-medium transition-all duration-200 ${isSelected ? 'text-green-100' : 'text-gray-500 group-hover:text-green-600'} ${isMobile ? 'hidden' : 'block'}`}>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/10 backdrop-blur-sm">
                    {category.count} Items
                  </span>
                </div>
              </div>
              
              {/* Hover shimmer effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </div>
          );
        })}
      </div>
      
      {/* Gradient fade edges for horizontal scroll */}
      <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
      <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
    </div>
  )
}
