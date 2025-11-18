"use client"

import { useState } from "react"
import { SidebarNav } from "../components/sidebar-nav"
import { Header } from "../components/header"
import { CategoryFilter } from "../components/category-filter"
import { FoodGrid } from "../components/food-grid"
import { Cart } from "../components/cart"
import { Footer } from "../components/footer"
import { useMobile } from "@/hooks/use-mobile"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function POSPage() {
  const isMobile = useMobile()
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 flex overflow-hidden relative">
          <main className={`flex-1 overflow-auto p-4 ${isMobile && cartOpen ? "hidden" : "block"}`}>
            <CategoryFilter />
            <FoodGrid />
          </main>

          {isMobile && !cartOpen && (
            <Button
              className="fixed bottom-20 right-4 rounded-full h-14 w-14 bg-green-600 hover:bg-green-700 shadow-lg"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6" />
            </Button>
          )}

          {(!isMobile || cartOpen) && <Cart onClose={isMobile ? () => setCartOpen(false) : undefined} />}
        </div>
        <Footer />
      </div>
    </div>
  )
}
