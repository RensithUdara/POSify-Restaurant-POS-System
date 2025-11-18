"use client"

import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import {
  Menu,
  TableIcon as TableBar,
  CalendarRange,
  Truck,
  Calculator,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { icon: Menu, label: "Menu", color: "text-green-600" },
  { icon: TableBar, label: "Table Services", color: "text-gray-600" },
  { icon: CalendarRange, label: "Reservation", color: "text-gray-600" },
  { icon: Truck, label: "Delivery", color: "text-gray-600" },
  { icon: Calculator, label: "Accounting", color: "text-gray-600" },
  { icon: Settings, label: "Settings", color: "text-gray-600" },
]

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMobile()

  return (
    <>
      {isMobile && !isOpen && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 rounded-full"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      <div
        className={`${isMobile ? "fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out" : "w-64"} 
        ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"} 
        bg-white p-4 border-r h-screen`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg"
              alt="Chili POS Logo"
              className="w-8 h-8"
            />
            <span className="font-semibold">CHILI POS</span>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <Button key={index} variant="ghost" className={`w-full justify-start ${item.color}`}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        <Button variant="ghost" className="w-full justify-start mt-auto text-gray-600 absolute bottom-4">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  )
}
