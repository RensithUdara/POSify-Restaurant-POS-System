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
      <div className="group relative">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
        
        <Card className={`relative overflow-hidden transition-all duration-500 transform hover:scale-105 active:scale-95 border-0 shadow-xl hover:shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl ${!menuItem.available ? 'opacity-60 grayscale' : ''}`}>
          <div className="relative overflow-hidden">
            <div className="overflow-hidden rounded-t-3xl">
              <img
                src={menuItem.image || "/placeholder.svg"}
                alt={menuItem.name}
                className="w-full h-52 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Floating badges */}
            {menuItem.discount && (
              <div className="absolute top-4 left-4 animate-float">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full text-xs font-black shadow-2xl ring-2 ring-white/50">
                    {menuItem.discount}% OFF
                  </div>
                </div>
              </div>
            )}
            
            {!menuItem.available && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center rounded-t-3xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <span className="text-2xl">⛔</span>
                  </div>
                  <span className="text-white font-bold text-lg">Unavailable</span>
                </div>
              </div>
            )}
            
            {currentQuantity > 0 && (
              <div className="absolute top-4 right-4 animate-pulse">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-sm"></div>
                  <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full h-10 w-10 flex items-center justify-center text-sm font-black shadow-2xl ring-4 ring-white/80">
                    {currentQuantity}
                  </div>
                </div>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white shadow-2xl rounded-full h-12 w-12 backdrop-blur-sm border border-white/50 transition-all duration-300 hover:scale-110"
              onClick={() => setShowDetails(true)}
            >
              <Info className="h-5 w-5 text-gray-700" />
            </Button>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
          </div>
          <div className="p-6 bg-gradient-to-b from-white to-gray-50/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full shadow-md ${menuItem.type === "Veg" ? "bg-gradient-to-r from-green-400 to-green-500" : "bg-gradient-to-r from-red-400 to-red-500"}`}></div>
                <Badge 
                  variant={menuItem.type === "Veg" ? "outline" : "secondary"} 
                  className={`text-xs font-semibold px-3 py-1 rounded-full border-2 ${
                    menuItem.type === "Veg" 
                      ? "border-green-200 text-green-700 bg-green-50" 
                      : "border-red-200 text-red-700 bg-red-50"
                  }`}
                >
                  {menuItem.type}
                </Badge>
              </div>
              {menuItem.preparationTime && (
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-600">{menuItem.preparationTime}m</span>
                </div>
              )}
            </div>
            
            <h3 className="font-black text-gray-900 mb-3 line-clamp-2 leading-tight text-lg group-hover:text-green-700 transition-colors duration-300">
              {menuItem.name}
            </h3>
            
            {menuItem.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{menuItem.description}</p>
            )}
            
            <div className="flex justify-between items-center mb-5">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ${finalPrice.toFixed(2)}
                  </span>
                  {menuItem.discount && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 line-through font-medium">
                        ${menuItem.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-orange-600 font-bold">
                        Save ${(menuItem.price - finalPrice).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-1 shadow-inner border border-gray-200">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-9 w-9 hover:bg-white hover:shadow-md transition-all duration-200"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-black w-10 text-center text-gray-900 text-lg">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-9 w-9 hover:bg-white hover:shadow-md transition-all duration-200"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="group/btn relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-25 group-hover/btn:opacity-75 transition duration-1000"></div>
                <Button
                  size="default"
                  onClick={handleAddToCart}
                  disabled={!menuItem.available}
                  className="relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-3 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </Card>
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
