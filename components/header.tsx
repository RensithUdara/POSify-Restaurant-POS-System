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

  return (
    <div className="relative bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-lg overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5"></div>\n      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-xl"></div>\n      <div className="absolute -bottom-5 -left-5 w-15 h-15 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-lg"></div>\n      \n      <div className="relative px-6 py-5 flex items-center gap-6">
        {/* Search Bar - Enhanced for desktop */}
        {!isMobile && (
          <div className="flex-1 relative max-w-lg group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-green-500 transition-colors duration-200" />
              <Input
                type="text"
                placeholder="Search delicious items..."
                className="pl-12 pr-4 py-3 bg-white/80 border-gray-200/50 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-300 rounded-2xl shadow-lg text-gray-700 placeholder:text-gray-400 font-medium"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        )}

        {/* Mobile Header - Enhanced */}
        {isMobile && (
          <div className="flex-1">
            <h1 className="font-black text-xl bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">{state.settings.restaurantName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-600 font-medium">
                Quick service mode
              </p>
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
