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
import { ShoppingCart, TrendingUp, Clock, DollarSign, Users, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function POSPage() {
  const isMobile = useMobile()
  const { state } = usePOS()
  const [cartOpen, setCartOpen] = useState(false)

  const totalCartItems = state.cart.reduce((sum, item) => sum + item.quantity, 0)
  const pendingOrders = state.orders.filter(order => order.status === 'pending').length
  const todayRevenue = state.orders.reduce((sum, order) =>
    order.paymentStatus === 'paid' ? sum + order.total : sum, 0
  )
  const totalOrders = state.orders.length
  const availableItems = state.menuItems.filter(item => item.available).length

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 flex overflow-hidden relative">
          <main className={`flex-1 overflow-auto ${isMobile && cartOpen ? "hidden" : "block"}`}>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
              {/* Dashboard Header */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Welcome to {state.settings.restaurantName}
                    </h1>
                    <p className="text-gray-600 text-lg">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                      <span className="text-green-600 font-medium">
                        Table {state.currentTable?.number || 4}
                      </span>
                    </div>
                    <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                      <span className="text-blue-600 font-medium">
                        {state.currentCustomer?.name || "Walk-in"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              {!isMobile && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Today's Revenue</CardTitle>
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">${todayRevenue.toFixed(2)}</div>
                      <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        +12% from yesterday
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
                      <Clock className="h-5 w-5 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{pendingOrders}</div>
                      <p className="text-xs text-gray-500 mt-1">
                        {pendingOrders > 0 ? 'Needs attention' : 'All caught up!'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                      <Users className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
                      <p className="text-xs text-blue-600 mt-1">
                        Served today
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Menu Items</CardTitle>
                      <ChefHat className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{availableItems}</div>
                      <p className="text-xs text-gray-500 mt-1">
                        Available items
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Menu Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Menu Items
                  </h2>
                  <p className="text-gray-600">
                    Choose your favorite items from our menu
                  </p>
                </div>
                <CategoryFilter />
                <FoodGrid />
              </div>
            </div>
          </main>

          {/* Mobile Cart Button */}
          {isMobile && !cartOpen && (
            <div className="fixed bottom-6 right-6 z-50">
              <Button
                className="relative rounded-full h-16 w-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-2xl transform transition-all duration-200 hover:scale-110"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart className="h-7 w-7 text-white" />
                {totalCartItems > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full h-7 w-7 flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-lg">
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
