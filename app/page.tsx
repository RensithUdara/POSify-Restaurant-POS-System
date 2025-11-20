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
import { ShoppingCart, TrendingUp, Clock, DollarSign, Users, ChefHat, User, ClipboardList } from "lucide-react"
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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-200/10 to-orange-200/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header />
        <div className="flex-1 flex overflow-hidden relative">
          <main className={`flex-1 overflow-auto ${isMobile && cartOpen ? "hidden" : "block"}`}>
            <div className="max-w-7xl mx-auto p-6 space-y-8">
              {/* Dashboard Header */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 overflow-hidden">
                {/* Header background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-xl"></div>
                
                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100/80 backdrop-blur-sm rounded-full border border-green-200/50">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-700 font-medium text-sm">Live Session</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-green-900 bg-clip-text text-transparent leading-tight">
                      Welcome to {state.settings.restaurantName}
                    </h1>
                    <p className="text-gray-600 text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                      <div className="relative px-6 py-3 bg-white rounded-full border border-green-200 shadow-lg">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-green-600" />
                          <span className="text-green-700 font-semibold">
                            Table {state.currentTable?.number || 4}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                      <div className="relative px-6 py-3 bg-white rounded-full border border-blue-200 shadow-lg">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-600" />
                          <span className="text-blue-700 font-semibold">
                            {state.currentCustomer?.name || "Walk-in"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              {!isMobile && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Revenue Card */}
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                    <Card className="relative border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
                      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-semibold text-gray-600">Today's Revenue</CardTitle>
                        <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ${todayRevenue.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-xs font-medium text-green-600">+12%</span>
                          </div>
                          <span className="text-xs text-gray-500">from yesterday</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Pending Orders Card */}
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                    <Card className="relative border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5"></div>
                      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-semibold text-gray-600">Pending Orders</CardTitle>
                        <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl">
                          <Clock className="h-5 w-5 text-orange-600" />
                        </div>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                          {pendingOrders}
                        </div>
                        <p className={`text-xs font-medium mt-2 ${pendingOrders > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          {pendingOrders > 0 ? '⚡ Needs attention' : '✅ All caught up!'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Total Orders Card */}
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                    <Card className="relative border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-semibold text-gray-600">Total Orders</CardTitle>
                        <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
                          <ClipboardList className="h-5 w-5 text-blue-600" />
                        </div>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {totalOrders}
                        </div>
                        <p className="text-xs text-blue-600 font-medium mt-2">
                          🍽️ Served today
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Menu Items Card */}
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                    <Card className="relative border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-semibold text-gray-600">Menu Items</CardTitle>
                        <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                          <ChefHat className="h-5 w-5 text-purple-600" />
                        </div>
                      </CardHeader>
                      <CardContent className="relative">
                        <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {availableItems}
                        </div>
                        <p className="text-xs text-purple-600 font-medium mt-2">
                          👨‍🍳 Available items
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Menu Section */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 overflow-hidden">
                {/* Background decorations */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-200/10 to-blue-200/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-xl"></div>
                
                <div className="relative">
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl">
                        <ChefHat className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                          Our Menu Collection
                        </h2>
                        <p className="text-gray-600 text-sm">
                          Discover our carefully curated selection of delicious items
                        </p>
                      </div>
                    </div>
                  </div>
                  <CategoryFilter />
                  <FoodGrid />
                </div>
              </div>
            </div>
          </main>

          {/* Mobile Cart Button - Ultra Enhanced */}
          {isMobile && !cartOpen && (
            <div className="fixed bottom-8 right-6 z-50">
              <div className="relative group">
                {/* Outer glow ring */}
                <div className="absolute -inset-3 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-full blur-lg opacity-30 group-hover:opacity-60 animate-pulse"></div>
                \n                {/* Middle glow ring */}\n                <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-500"></div>\n                \n                <Button\n                  className="relative rounded-full h-18 w-18 bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95 border-4 border-white/50"\n                  onClick={() => setCartOpen(true)}\n                >\n                  {/* Inner shine effect */}\n                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>\n                  \n                  <ShoppingCart className="relative h-8 w-8 text-white drop-shadow-lg" />\n                  \n                  {totalCartItems > 0 && (\n                    <div className="absolute -top-3 -right-3 animate-bounce">\n                      <div className="relative">\n                        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-500 rounded-full blur-sm opacity-75"></div>\n                        <div className="relative bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-black ring-4 ring-white shadow-2xl">\n                          {totalCartItems > 99 ? '99+' : totalCartItems}\n                        </div>\n                      </div>\n                    </div>\n                  )}\n                </Button>\n                \n                {/* Floating particles */}\n                <div className="absolute inset-0 pointer-events-none">\n                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-white/40 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>\n                  <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-green-300/60 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>\n                  <div className="absolute top-0 -right-2 w-1 h-1 bg-blue-300/60 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>\n                </div>
              </div>
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
