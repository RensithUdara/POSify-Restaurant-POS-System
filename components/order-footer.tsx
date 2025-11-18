"use client"

import { Button } from "@/components/ui/button"
import { CreditCard, QrCode, Banknote, Trash2 } from "lucide-react"
import { usePOS } from "@/context/POSContext"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface OrderFooterProps {
  onPayment: (paymentType: string) => void
}

const paymentMethods = [
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'digital', label: 'Digital', icon: QrCode },
]

export function OrderFooter({ onPayment }: OrderFooterProps) {
  const { state, getCartTotal, clearCart } = usePOS()
  const { subtotal, tax, total } = getCartTotal()
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)

  const handlePayment = () => {
    if (selectedPayment) {
      onPayment(selectedPayment)
      setSelectedPayment(null)
    }
  }

  return (
    <div className="border-t bg-white p-4 space-y-4">
      {/* Order Summary */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({state.cart.length} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax ({(state.settings.taxRate * 100).toFixed(0)}%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="h-px bg-gray-200" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-green-600">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Payment Method</h3>
        <div className="grid grid-cols-3 gap-2">
          {paymentMethods.map((method) => (
            <Button
              key={method.id}
              variant={selectedPayment === method.id ? "default" : "outline"}
              className={`flex flex-col items-center py-3 h-auto ${
                selectedPayment === method.id 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "hover:bg-green-50 hover:text-green-600"
              }`}
              onClick={() => setSelectedPayment(method.id)}
            >
              <method.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{method.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Cart</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove all items from the cart? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearCart} className="bg-red-600 hover:bg-red-700">
                Clear Cart
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button 
          className="flex-1 bg-green-600 hover:bg-green-700"
          onClick={handlePayment}
          disabled={!selectedPayment || state.cart.length === 0}
        >
          {selectedPayment ? `Pay with ${paymentMethods.find(m => m.id === selectedPayment)?.label}` : 'Select Payment'}
        </Button>
      </div>
    </div>
  )
}
