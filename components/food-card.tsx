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
      <Card className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${!menuItem.available ? 'opacity-60' : ''}`}>
        <div className="relative">
          <img 
            src={menuItem.image || "/placeholder.svg"} 
            alt={menuItem.name} 
            className="w-full h-40 object-cover" 
          />
          {menuItem.discount && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-md text-xs font-medium">
              {menuItem.discount}% Off
            </div>
          )}
          {!menuItem.available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-medium">Unavailable</span>
            </div>
          )}
          {currentQuantity > 0 && (
            <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
              {currentQuantity}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
            onClick={() => setShowDetails(true)}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium mb-1 line-clamp-2">{menuItem.name}</h3>
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-col">
              <span className="text-green-600 font-bold">
                ${finalPrice.toFixed(2)}
              </span>
              {menuItem.discount && (
                <span className="text-xs text-gray-500 line-through">
                  ${menuItem.price.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${menuItem.type === "Veg" ? "bg-green-500" : "bg-red-500"}`}></span>
              <span className="text-xs text-gray-500">{menuItem.type}</span>
            </div>
          </div>
          {menuItem.preparationTime && (
            <div className="flex items-center gap-1 mb-2">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{menuItem.preparationTime} min</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-8 w-8"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-medium w-8 text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-8 w-8"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button 
              size="sm" 
              onClick={handleAddToCart}
              disabled={!menuItem.available}
              className="bg-green-600 hover:bg-green-700"
            >
              Add
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
