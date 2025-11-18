"use client"

import { useMobile } from "@/hooks/use-mobile"
import { usePOS } from "@/context/POSContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Clock, 
  ChefHat, 
  Wifi, 
  WifiOff, 
  AlertCircle,
  CheckCircle2,
  Users,
  DollarSign
} from "lucide-react"
import { useState, useEffect } from "react"

export function Footer() {
  const isMobile = useMobile()
  const { state } = usePOS()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isOnline, setIsOnline] = useState(true)

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const activeOrders = state.orders.filter(order => 
    order.status === 'pending' || order.status === 'preparing'
  )

  const todayRevenue = state.orders.reduce((sum, order) => 
    order.paymentStatus === 'paid' ? sum + order.total : sum, 0
  )

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  }

  return (
    <div className="bg-white border-t shadow-lg">
      {/* Active Orders Bar */}
      {activeOrders.length > 0 && (
        <div className="p-2 bg-orange-50 border-b">
          <div className="flex gap-2 overflow-x-auto">
            {activeOrders.slice(0, 5).map((order) => {
              const isProcessing = order.status === 'preparing'
              
              return (
                <div
                  key={order.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg min-w-[160px] ${
                    isProcessing ? 'bg-blue-100' : 'bg-yellow-100'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                    isProcessing ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}>
                    {order.tableId ? `T${order.tableId.split('-')[1]}` : 'TO'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">
                      {order.items.length} items
                    </div>
                    <div className={`text-xs ${isProcessing ? 'text-blue-600' : 'text-yellow-600'}`}>
                      {isProcessing ? 'Preparing' : 'Pending'}
                    </div>
                  </div>
                  {isProcessing && (
                    <ChefHat className="h-3 w-3 text-blue-600" />
                  )}
                </div>
              )
            })}
            
            {activeOrders.length > 5 && (
              <div className="flex items-center px-3 py-2 bg-gray-100 rounded-lg min-w-[60px]">
                <span className="text-xs font-medium text-gray-600">
                  +{activeOrders.length - 5}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Footer */}
      <div className="p-3">
        <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-3' : ''}`}>
          {/* Left Section - Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span className="text-xs text-gray-600">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-600">
                {formatTime(currentTime)}
              </span>
            </div>

            {!isMobile && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-gray-600">
                  Table {state.currentTable?.number || 4}
                </span>
              </div>
            )}
          </div>

          {/* Center Section - Quick Stats */}
          {!isMobile && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-xs text-gray-600">
                  {activeOrders.length} Active
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-xs text-gray-600">
                  {state.orders.filter(o => o.status === 'served').length} Completed
                </span>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-xs text-gray-600">
                  ${todayRevenue.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {state.settings.restaurantName}
            </Badge>
            
            {isOnline ? (
              <Badge className="text-xs bg-green-100 text-green-700">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                System OK
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline Mode
              </Badge>
            )}
          </div>
        </div>

        {/* Mobile Stats Row */}
        {isMobile && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t">
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span>Active: {activeOrders.length}</span>
              <span>Completed: {state.orders.filter(o => o.status === 'served').length}</span>
              <span>Revenue: ${todayRevenue.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
