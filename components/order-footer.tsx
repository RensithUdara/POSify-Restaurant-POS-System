"use client"

import { Button } from "@/components/ui/button"
import { CreditCard, QrCode, Banknote, Trash2, ShoppingCart } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PaymentProcessing } from "./payment-processing"
import { PaymentMethod } from "@/types"
import { toast } from "sonner"

interface OrderFooterProps {
  onPayment: (paymentType: string) => void
}

const paymentMethods = [
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'digital', label: 'Digital', icon: QrCode },
]

export function OrderFooter({ onPayment }: OrderFooterProps) {
  const { state, getCartTotal, clearCart, createOrder } = usePOS()
  const { subtotal, tax, total } = getCartTotal()
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  const handlePayment = () => {
    if (state.cart.length === 0) {
      toast.error("Cart is empty")
      return
    }
    setShowPaymentDialog(true)
  }

  const handlePaymentComplete = (paymentMethod: PaymentMethod) => {
    createOrder(paymentMethod)
    setShowPaymentDialog(false)
    setSelectedPayment(null)
    toast.success("Order placed successfully!")
  }

  const handlePaymentCancel = () => {
    setShowPaymentDialog(false)
    setSelectedPayment(null)
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

      {/* Quick Actions */}
      <div className="space-y-2">
        <div className="text-sm text-gray-600 text-center">
          Ready to place order • {state.cart.length} items
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
          className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12"
          onClick={handlePayment}
          disabled={state.cart.length === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Place Order • ${total.toFixed(2)}
        </Button>
      </div>

      {/* Payment Processing Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          <PaymentProcessing
            onPaymentComplete={handlePaymentComplete}
            onCancel={handlePaymentCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
