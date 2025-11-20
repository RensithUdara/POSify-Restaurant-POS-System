"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, QrCode, Banknote, Edit2, X, Minus, Plus, Trash2, User, Phone } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { usePOS } from "@/context/POSContext"
import { CartItem } from "./cart-item"
import { DiningMode } from "./dining-mode"
import { OrderFooter } from "./order-footer"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface CartProps {
  onClose?: () => void
}

export function Cart({ onClose }: CartProps) {
  const isMobile = useMobile()
  const { state, dispatch, getCartTotal, createOrder, clearCart } = usePOS()
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const [customerName, setCustomerName] = useState(state.currentCustomer?.name || "")
  const [customerPhone, setCustomerPhone] = useState(state.currentCustomer?.phone || "")
  const [tableNumber, setTableNumber] = useState(state.currentTable?.number || 4)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)

  const { subtotal, tax, total } = getCartTotal()

  const handleCustomerSave = () => {
    if (customerName.trim()) {
      dispatch({
        type: 'SET_CURRENT_CUSTOMER',
        payload: {
          id: `customer-${Date.now()}`,
          name: customerName.trim(),
          phone: customerPhone.trim() || undefined
        }
      })

      dispatch({
        type: 'SET_CURRENT_TABLE',
        payload: {
          id: `table-${tableNumber}`,
          number: tableNumber,
          capacity: 4,
          status: 'occupied'
        }
      })

      setShowCustomerDialog(false)
      toast.success("Customer information saved")
    }
  }

  const handlePayment = (paymentType: string) => {
    if (state.cart.length === 0) {
      toast.error("Cart is empty")
      return
    }

    setSelectedPaymentMethod(paymentType)

    // Create order with payment method
    createOrder({ type: paymentType })

    toast.success(`Order placed successfully! Payment: ${paymentType}`)
    setSelectedPaymentMethod(null)
  }

  const isEmpty = state.cart.length === 0

  return (
    <div className={`${isMobile ? "fixed inset-0 z-50" : "w-[420px]"} bg-white border-l flex flex-col h-full shadow-xl`}>
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Table {tableNumber}</h2>
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <User className="h-4 w-4" />
              {state.currentCustomer?.name || "Walk-in Customer"}
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full shadow-sm">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Customer Information</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="table">Table Number</Label>
                    <Input
                      id="table"
                      type="number"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Customer Name</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <Button onClick={handleCustomerSave} className="w-full">
                    Save Information
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {onClose && (
              <Button variant="outline" size="icon" onClick={onClose} className="rounded-full shadow-sm">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <DiningMode />
        
        {/* Order Summary Badge */}
        {!isEmpty && (
          <div className="mt-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Items in cart</span>
              <span className="font-semibold text-gray-900">{state.cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-center max-w-xs">Add some delicious items from the menu to get started</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {state.cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isEmpty && <OrderFooter onPayment={handlePayment} />}
    </div>
  )
}
