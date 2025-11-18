"use client"

import { Button } from "@/components/ui/button"
import { usePOS } from "@/context/POSContext"
import { Car, Home, ShoppingBag } from "lucide-react"

const modes = [
  { id: "dine-in", label: "Dine In", icon: Home },
  { id: "takeaway", label: "Take Away", icon: ShoppingBag },
  { id: "delivery", label: "Delivery", icon: Car },
] as const

export function DiningMode() {
  const { state, dispatch } = usePOS()

  const handleModeChange = (mode: typeof modes[number]["id"]) => {
    dispatch({ type: 'SET_ORDER_TYPE', payload: mode })
  }

  return (
    <div className="flex gap-2">
      {modes.map((mode) => (
        <Button 
          key={mode.id}
          variant={state.orderType === mode.id ? "default" : "outline"}
          className={`flex-1 rounded-full text-xs ${
            state.orderType === mode.id 
              ? "bg-green-600 hover:bg-green-700" 
              : "hover:bg-green-50 hover:text-green-600"
          }`}
          onClick={() => handleModeChange(mode.id)}
        >
          <mode.icon className="h-3 w-3 mr-1" />
          {mode.label}
        </Button>
      ))}
    </div>
  )
}
