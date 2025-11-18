"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Printer, 
  Download, 
  Mail, 
  Share, 
  QrCode,
  Receipt,
  Clock,
  MapPin,
  Phone,
  Globe
} from "lucide-react"
import { Order, Settings } from "@/types"
import { usePOS } from "@/context/POSContext"
import { toast } from "sonner"

interface ReceiptSystemProps {
  order: Order
  onClose?: () => void
}

export function ReceiptSystem({ order, onClose }: ReceiptSystemProps) {
  const { state } = usePOS()
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.settings.currency
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const generateReceiptData = () => {
    return {
      receiptNumber: `REC-${order.id.slice(-8).toUpperCase()}`,
      orderNumber: order.id.slice(-8).toUpperCase(),
      restaurantName: state.settings.restaurantName,
      address: "123 Restaurant Street, Food City, FC 12345",
      phone: "+1 (555) 123-4567",
      website: "www.posifyrestaurant.com",
      date: formatDate(order.createdAt),
      table: order.tableId ? `Table ${state.currentTable?.number || 'N/A'}` : 'Takeaway',
      customer: order.customer?.name || 'Walk-in Customer',
      orderType: order.type.charAt(0).toUpperCase() + order.type.slice(1),
      items: order.items.map(item => ({
        name: item.menuItem.name,
        quantity: item.quantity,
        unitPrice: item.menuItem.discount 
          ? item.menuItem.price * (1 - item.menuItem.discount / 100)
          : item.menuItem.price,
        total: (item.menuItem.discount 
          ? item.menuItem.price * (1 - item.menuItem.discount / 100)
          : item.menuItem.price) * item.quantity,
        discount: item.menuItem.discount || 0
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount,
      total: order.total,
      paymentMethod: order.paymentMethod?.type || 'Cash',
      paymentStatus: order.paymentStatus
    }
  }

  const receiptData = generateReceiptData()

  const handlePrint = async () => {
    setIsGenerating(true)
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        toast.error("Please allow popups to print receipts")
        return
      }

      const receiptHTML = generateReceiptHTML()
      printWindow.document.write(receiptHTML)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()

      toast.success("Receipt sent to printer")
    } catch (error) {
      toast.error("Failed to print receipt")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      const receiptHTML = generateReceiptHTML()
      const blob = new Blob([receiptHTML], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `receipt-${receiptData.receiptNumber}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Receipt downloaded")
    } catch (error) {
      toast.error("Failed to download receipt")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEmail = async () => {
    if (!order.customer?.email) {
      toast.error("Customer email not available")
      return
    }

    setIsGenerating(true)
    try {
      // In a real app, you would send this to your backend API
      const emailData = {
        to: order.customer.email,
        subject: `Receipt - Order ${receiptData.orderNumber}`,
        html: generateReceiptHTML(),
        attachments: []
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(`Receipt emailed to ${order.customer.email}`)
    } catch (error) {
      toast.error("Failed to email receipt")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt - ${receiptData.restaurantName}`,
          text: `Order ${receiptData.orderNumber} - Total: ${formatCurrency(receiptData.total)}`,
          url: window.location.href
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      const shareText = `Receipt from ${receiptData.restaurantName}\nOrder: ${receiptData.orderNumber}\nTotal: ${formatCurrency(receiptData.total)}\nDate: ${receiptData.date}`
      
      try {
        await navigator.clipboard.writeText(shareText)
        toast.success("Receipt details copied to clipboard")
      } catch (error) {
        toast.error("Failed to copy receipt details")
      }
    }
  }

  const generateReceiptHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Receipt - ${receiptData.receiptNumber}</title>
        <style>
          body { 
            font-family: 'Courier New', monospace; 
            max-width: 300px; 
            margin: 0 auto; 
            padding: 20px; 
            line-height: 1.4;
            font-size: 14px;
          }
          .header { text-align: center; margin-bottom: 20px; }
          .company-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
          .separator { border-top: 1px dashed #000; margin: 10px 0; }
          .row { display: flex; justify-content: space-between; margin: 5px 0; }
          .item-row { margin: 8px 0; }
          .item-name { font-weight: bold; }
          .item-details { font-size: 12px; color: #666; }
          .total-section { margin-top: 15px; }
          .total-row { font-weight: bold; font-size: 16px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; }
          @media print {
            body { margin: 0; padding: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">${receiptData.restaurantName}</div>
          <div>${receiptData.address}</div>
          <div>Tel: ${receiptData.phone}</div>
          <div>${receiptData.website}</div>
        </div>
        
        <div class="separator"></div>
        
        <div class="row">
          <span>Receipt #:</span>
          <span>${receiptData.receiptNumber}</span>
        </div>
        <div class="row">
          <span>Order #:</span>
          <span>${receiptData.orderNumber}</span>
        </div>
        <div class="row">
          <span>Date:</span>
          <span>${receiptData.date}</span>
        </div>
        <div class="row">
          <span>Table:</span>
          <span>${receiptData.table}</span>
        </div>
        <div class="row">
          <span>Customer:</span>
          <span>${receiptData.customer}</span>
        </div>
        <div class="row">
          <span>Type:</span>
          <span>${receiptData.orderType}</span>
        </div>
        
        <div class="separator"></div>
        
        ${receiptData.items.map(item => `
          <div class="item-row">
            <div class="item-name">${item.name}</div>
            <div class="item-details">
              ${item.quantity}x ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.total)}
              ${item.discount > 0 ? `(${item.discount}% off)` : ''}
            </div>
          </div>
        `).join('')}
        
        <div class="separator"></div>
        
        <div class="total-section">
          <div class="row">
            <span>Subtotal:</span>
            <span>${formatCurrency(receiptData.subtotal)}</span>
          </div>
          ${receiptData.discount > 0 ? `
            <div class="row">
              <span>Discount:</span>
              <span>-${formatCurrency(receiptData.discount)}</span>
            </div>
          ` : ''}
          <div class="row">
            <span>Tax (${(state.settings.taxRate * 100).toFixed(1)}%):</span>
            <span>${formatCurrency(receiptData.tax)}</span>
          </div>
          <div class="separator"></div>
          <div class="row total-row">
            <span>TOTAL:</span>
            <span>${formatCurrency(receiptData.total)}</span>
          </div>
        </div>
        
        <div class="separator"></div>
        
        <div class="row">
          <span>Payment:</span>
          <span>${receiptData.paymentMethod}</span>
        </div>
        <div class="row">
          <span>Status:</span>
          <span>${receiptData.paymentStatus.toUpperCase()}</span>
        </div>
        
        <div class="footer">
          <div>Thank you for dining with us!</div>
          <div>Please visit us again soon.</div>
          <div style="margin-top: 10px;">
            ${order.customer?.phone ? `SMS updates: ${order.customer.phone}` : ''}
          </div>
        </div>
      </body>
      </html>
    `
  }

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handlePrint} disabled={isGenerating}>
          <Printer className="h-4 w-4 mr-2" />
          Print Receipt
        </Button>
        
        <Button variant="outline" onClick={handleDownload} disabled={isGenerating}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        
        {order.customer?.email && (
          <Button variant="outline" onClick={handleEmail} disabled={isGenerating}>
            <Mail className="h-4 w-4 mr-2" />
            Email Receipt
          </Button>
        )}
        
        <Button variant="outline" onClick={handleShare}>
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Receipt className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Receipt Preview</DialogTitle>
            </DialogHeader>
            <div className="max-h-96 overflow-y-auto">
              <ReceiptPreview receiptData={receiptData} settings={state.settings} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Receipt Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Receipt Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Receipt Number:</span>
            <span className="font-mono">{receiptData.receiptNumber}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Order Total:</span>
            <span className="font-bold text-lg">{formatCurrency(receiptData.total)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Payment Method:</span>
            <Badge variant="outline">{receiptData.paymentMethod}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Payment Status:</span>
            <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
              {receiptData.paymentStatus.toUpperCase()}
            </Badge>
          </div>
          
          <Separator />
          
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Generated: {formatDate(new Date())}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {receiptData.table} • {receiptData.orderType}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Receipt Preview Component
function ReceiptPreview({ receiptData, settings }: { receiptData: any, settings: Settings }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency
    }).format(amount)
  }

  return (
    <div className="font-mono text-sm bg-white p-4 border rounded-lg max-w-xs mx-auto">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="font-bold text-lg">{receiptData.restaurantName}</div>
        <div className="text-xs">{receiptData.address}</div>
        <div className="text-xs">Tel: {receiptData.phone}</div>
        <div className="text-xs">{receiptData.website}</div>
      </div>

      <div className="border-t border-dashed my-2"></div>

      {/* Order Info */}
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Receipt #:</span>
          <span>{receiptData.receiptNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{receiptData.date}</span>
        </div>
        <div className="flex justify-between">
          <span>Table:</span>
          <span>{receiptData.table}</span>
        </div>
        <div className="flex justify-between">
          <span>Customer:</span>
          <span>{receiptData.customer}</span>
        </div>
      </div>

      <div className="border-t border-dashed my-2"></div>

      {/* Items */}
      <div className="space-y-2">
        {receiptData.items.map((item: any, index: number) => (
          <div key={index} className="text-xs">
            <div className="font-bold">{item.name}</div>
            <div className="flex justify-between">
              <span>{item.quantity}x {formatCurrency(item.unitPrice)}</span>
              <span>{formatCurrency(item.total)}</span>
            </div>
            {item.discount > 0 && (
              <div className="text-gray-500">({item.discount}% off)</div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-dashed my-2"></div>

      {/* Totals */}
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(receiptData.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>{formatCurrency(receiptData.tax)}</span>
        </div>
        <div className="border-t border-dashed my-1"></div>
        <div className="flex justify-between font-bold">
          <span>TOTAL:</span>
          <span>{formatCurrency(receiptData.total)}</span>
        </div>
      </div>

      <div className="border-t border-dashed my-2"></div>

      {/* Payment */}
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Payment:</span>
          <span>{receiptData.paymentMethod}</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span>{receiptData.paymentStatus.toUpperCase()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-4 text-xs space-y-1">
        <div>Thank you for dining with us!</div>
        <div>Please visit us again soon.</div>
      </div>
    </div>
  )
}