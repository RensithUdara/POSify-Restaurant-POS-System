"use client"

import { Search, Bell, Settings, Clock, DollarSign, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"
import { usePOS } from "@/context/POSContext"
import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Header() {
  const isMobile = useMobile()
  const { state } = usePOS()
  const [notifications] = useState([
    { id: 1, message: "Order #1234 is ready for pickup", time: "2 min ago", type: "success" },
    { id: 2, message: "Table 7 requested assistance", time: "5 min ago", type: "warning" },
    { id: 3, message: "Low stock: Caesar Salad", time: "10 min ago", type: "info" },
  ])

  const pendingOrders = state.orders.filter(order => order.status === 'pending').length
  const todayRevenue = state.orders.reduce((sum, order) => 
    order.paymentStatus === 'paid' ? sum + order.total : sum, 0
  )

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="px-4 py-3 flex items-center gap-4">
        {/* Search Bar - Hidden on mobile */}
        {!isMobile && (
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Search menu items..." 
              className="pl-10 bg-gray-50 border-0 focus:bg-white"
            />
          </div>
        )}

        {/* Mobile Header */}
        {isMobile && (
          <div className="flex-1">
            <h1 className="font-semibold text-lg">{state.settings.restaurantName}</h1>
            <p className="text-sm text-gray-600">
              Table {state.currentTable?.number || 4} • {state.currentCustomer?.name || "Walk-in"}
            </p>
          </div>
        )}

        {/* Stats - Desktop only */}
        {!isMobile && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="font-medium">{pendingOrders}</span>
              <span className="text-gray-600">Pending</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="font-medium">${todayRevenue.toFixed(2)}</span>
              <span className="text-gray-600">Today</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="font-medium">
                Table {state.currentTable?.number || 4}
              </span>
              <span className="text-gray-600">
                {state.currentCustomer?.name || "Walk-in"}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-xs">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-2">
                <h3 className="font-semibold">Notifications</h3>
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isMobile && (
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Search menu items..." 
              className="pl-10 bg-gray-50 border-0 focus:bg-white"
            />
          </div>
        </div>
      )}
    </div>
  )
}
