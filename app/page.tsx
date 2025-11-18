"use client"

import { useState } from "react"
import { SidebarNav } from "../components/sidebar-nav"
import { Header } from "../components/header"
import { CategoryFilter } from "../components/category-filter"
import { FoodGrid } from "../components/food-grid"
import { Cart } from "../components/cart"
import { Footer } from "../components/footer"
import { useMobile } from "@/hooks/use-mobile"
import { usePOS } from "@/context/POSContext"
import { ShoppingCart, Badge } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function POSPage() {
  const isMobile = useMobile()
  const { state } = usePOS()
  const [cartOpen, setCartOpen] = useState(false)

  const totalCartItems = state.cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 flex overflow-hidden relative">
          <main className={`flex-1 overflow-auto p-6 ${isMobile && cartOpen ? "hidden" : "block"}`}>
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {state.settings.restaurantName}
                </h1>
                <p className="text-gray-600">
                  Choose your favorite items from our menu
                </p>
              </div>
              <CategoryFilter />
              <FoodGrid />
            </div>
          </main>

          {/* Mobile Cart Button */}
          {isMobile && !cartOpen && (
            <div className="fixed bottom-6 right-6 z-50">
              <Button
                className="relative rounded-full h-14 w-14 bg-green-600 hover:bg-green-700 shadow-lg"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="h-6 w-6" />
                {totalCartItems > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                    {totalCartItems > 99 ? '99+' : totalCartItems}
                  </div>
                )}
              </Button>
            </div>
          )}

          {/* Cart */}
          {(!isMobile || cartOpen) && (
            <Cart onClose={isMobile ? () => setCartOpen(false) : undefined} />
          )}
        </div>
        <Footer />
      </div>
    </div>
  )
}
