"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, MessageSquare } from "lucide-react"
import { CartItem as CartItemType } from "@/types"
import { usePOS } from "@/context/POSContext"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateCartItem, removeFromCart } = usePOS()
  const [showInstructions, setShowInstructions] = useState(false)
  const [instructions, setInstructions] = useState(item.specialInstructions || "")

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id)
    } else {
      updateCartItem(item.id, newQuantity)
    }
  }

  const finalPrice = item.menuItem.discount
    ? item.menuItem.price * (1 - item.menuItem.discount / 100)
    : item.menuItem.price

  const totalPrice = finalPrice * item.quantity

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <img
        src={item.menuItem.image || "/placeholder.svg"}
        alt={item.menuItem.name}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium mb-1 line-clamp-2">{item.menuItem.name}</h4>

        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-green-600 font-bold text-sm">
              ${finalPrice.toFixed(2)} each
            </span>
            <span className="text-xs text-gray-500">
              Total: ${totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleQuantityChange(item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-gray-600"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                {item.specialInstructions ? "Edit Note" : "Add Note"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Special Instructions</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Instructions for {item.menuItem.name}</Label>
                  <Textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g., No onions, extra sauce..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowInstructions(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // In a full implementation, you'd update the cart item with instructions
                      setShowInstructions(false)
                    }}
                    className="flex-1"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => removeFromCart(item.id)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Remove
          </Button>
        </div>

        {item.specialInstructions && (
          <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-gray-600">
            <strong>Note:</strong> {item.specialInstructions}
          </div>
        )}
      </div>
    </div>
  )
}
