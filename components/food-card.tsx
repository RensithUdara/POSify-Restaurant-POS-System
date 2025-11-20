"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Clock, Info } from "lucide-react"
import { MenuItem } from "@/types"
import { usePOS } from "@/context/POSContext"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface FoodCardProps {
  menuItem: MenuItem
}

export function FoodCard({ menuItem }: FoodCardProps) {
  const { state, addToCart } = usePOS()
  const [quantity, setQuantity] = useState(1)
  const [showDetails, setShowDetails] = useState(false)

  const cartItem = state.cart.find(item => item.menuItem.id === menuItem.id)
  const currentQuantity = cartItem?.quantity || 0

  const handleAddToCart = () => {
    if (!menuItem.available) {
      toast.error("This item is currently unavailable")
      return
    }

    addToCart(menuItem, quantity)
    toast.success(`Added ${quantity}x ${menuItem.name} to cart`)
    setQuantity(1)
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change)
    setQuantity(newQuantity)
  }

  const finalPrice = menuItem.discount
    ? menuItem.price * (1 - menuItem.discount / 100)
    : menuItem.price

  return (
    <>
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 shadow-md bg-white ${!menuItem.available ? 'opacity-60' : ''}`}>
        <div className="relative">
          <div className="overflow-hidden">
            <img
              src={menuItem.image || "/placeholder.svg"}
              alt={menuItem.name}
              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>
          {menuItem.discount && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {menuItem.discount}% OFF
            </div>
          )}
          {!menuItem.available && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-semibold text-lg">Unavailable</span>
            </div>
          )}
          {currentQuantity > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold shadow-lg ring-2 ring-white">
              {currentQuantity}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-3 right-3 bg-white/90 hover:bg-white shadow-lg rounded-full h-10 w-10 backdrop-blur-sm"
            onClick={() => setShowDetails(true)}
          >
            <Info className="h-4 w-4 text-gray-700" />
          </Button>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${menuItem.type === "Veg" ? "bg-green-500" : "bg-red-500"}`}></div>
              <Badge variant={menuItem.type === "Veg" ? "outline" : "secondary"} className="text-xs">
                {menuItem.type}
              </Badge>
            </div>
            {menuItem.preparationTime && (
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{menuItem.preparationTime}m</span>
              </div>
            )}
          </div>
          
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{menuItem.name}</h3>
          
          {menuItem.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{menuItem.description}</p>
          )}
          
          <div className="flex justify-between items-end mb-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-green-600">
                ${finalPrice.toFixed(2)}
              </span>
              {menuItem.discount && (
                <span className="text-sm text-gray-500 line-through">
                  ${menuItem.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1 bg-gray-50 rounded-full p-1">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 hover:bg-white"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-bold w-8 text-center text-gray-900">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 hover:bg-white"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button
              size="default"
              onClick={handleAddToCart}
              disabled={!menuItem.available}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 rounded-full shadow-lg transition-all duration-200"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{menuItem.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={menuItem.image}
              alt={menuItem.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            {menuItem.description && (
              <p className="text-gray-600">{menuItem.description}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">
                ${finalPrice.toFixed(2)}
              </span>
              <Badge variant={menuItem.type === "Veg" ? "outline" : "destructive"}>
                {menuItem.type}
              </Badge>
            </div>
            {menuItem.ingredients && (
              <div>
                <h4 className="font-medium mb-2">Ingredients:</h4>
                <div className="flex flex-wrap gap-1">
                  {menuItem.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {menuItem.allergens && (
              <div>
                <h4 className="font-medium mb-2 text-red-600">Allergens:</h4>
                <div className="flex flex-wrap gap-1">
                  {menuItem.allergens.map((allergen, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {menuItem.preparationTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{menuItem.preparationTime} min</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
