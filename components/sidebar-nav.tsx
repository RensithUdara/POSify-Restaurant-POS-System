"use client"

import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { usePOS } from "@/context/POSContext"
import {
  Menu,
  TableIcon as TableBar,
  CalendarRange,
  Truck,
  Calculator,
  Settings,
  LogOut,
  ChevronRight,
  BarChart3,
  Users,
  ClipboardList,
  ShoppingBag,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  {
    id: 'menu',
    icon: Menu,
    label: "Menu",
    color: "text-green-600 bg-green-50",
    active: true,
    badge: null
  },
  {
    id: 'orders',
    icon: ClipboardList,
    label: "Orders",
    color: "text-gray-600 hover:text-orange-600 hover:bg-orange-50",
    active: false,
    badge: 'pending'
  },
  {
    id: 'tables',
    icon: TableBar,
    label: "Table Management",
    color: "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
    active: false,
    badge: null
  },
  {
    id: 'customers',
    icon: Users,
    label: "Customers",
    color: "text-gray-600 hover:text-purple-600 hover:bg-purple-50",
    active: false,
    badge: null
  },
  {
    id: 'inventory',
    icon: ShoppingBag,
    label: "Inventory",
    color: "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50",
    active: false,
    badge: null
  },
  {
    id: 'analytics',
    icon: BarChart3,
    label: "Analytics",
    color: "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50",
    active: false,
    badge: null
  },
  {
    id: 'delivery',
    icon: Truck,
    label: "Delivery",
    color: "text-gray-600 hover:text-red-600 hover:bg-red-50",
    active: false,
    badge: null
  },
  {
    id: 'reservations',
    icon: CalendarRange,
    label: "Reservations",
    color: "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50",
    active: false,
    badge: null
  },
  {
    id: 'accounting',
    icon: Calculator,
    label: "Accounting",
    color: "text-gray-600 hover:text-cyan-600 hover:bg-cyan-50",
    active: false,
    badge: null
  },
  {
    id: 'settings',
    icon: Settings,
    label: "Settings",
    color: "text-gray-600 hover:text-gray-800 hover:bg-gray-50",
    active: false,
    badge: null
  },
]

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('menu')
  const isMobile = useMobile()
  const { state } = usePOS()

  const pendingOrders = state.orders.filter(order => order.status === 'pending').length

  const getBadgeCount = (badgeType: string | null) => {
    switch (badgeType) {
      case 'pending':
        return pendingOrders > 0 ? pendingOrders : null
      default:
        return null
    }
  }

  return (
    <TooltipProvider>
      {/* Mobile Menu Button */}
      {isMobile && !isOpen && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 rounded-full shadow-lg bg-white"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${isMobile ? "fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out" : "w-72"
          } 
        ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"} 
        bg-white border-r h-screen flex flex-col shadow-lg`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">POSify</h1>
              <p className="text-xs text-gray-500">Restaurant POS</p>
            </div>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Current Session Info */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="text-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600">Current Session</span>
              <Badge variant="outline" className="text-green-600 border-green-200">
                Active
              </Badge>
            </div>
            <div className="font-medium">
              Table {state.currentTable?.number || 4}
            </div>
            <div className="text-gray-500 text-xs">
              {state.currentCustomer?.name || "Walk-in Customer"}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const badgeCount = getBadgeCount(item.badge)
            const isActive = activeItem === item.id

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left h-12 transition-all duration-200 ${isActive
                        ? "bg-green-50 text-green-700 border-r-2 border-green-600"
                        : item.color
                      }`}
                    onClick={() => {
                      setActiveItem(item.id)
                      if (isMobile) setIsOpen(false)
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {badgeCount && (
                        <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                          {badgeCount > 99 ? '99+' : badgeCount}
                        </Badge>
                      )}
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="text-xs text-gray-500 mb-3">
            <div className="flex justify-between">
              <span>Today's Sales:</span>
              <span className="font-medium text-green-600">
                ${state.orders.reduce((sum, order) =>
                  order.paymentStatus === 'paid' ? sum + order.total : sum, 0
                ).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Orders:</span>
              <span className="font-medium">{state.orders.length}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}
