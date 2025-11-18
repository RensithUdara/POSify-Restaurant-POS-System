import { MenuItem, Order, CartItem } from '@/types'

export const formatCurrency = (amount: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount)
}

export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date)
}

export const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(date)
}

export const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(date)
}

export const calculateItemPrice = (item: MenuItem): number => {
    if (item.discount) {
        return item.price * (1 - item.discount / 100)
    }
    return item.price
}

export const calculateCartTotal = (
    items: CartItem[],
    taxRate = 0.08,
    serviceCharge = 0
): {
    subtotal: number
    tax: number
    service: number
    total: number
} => {
    const subtotal = items.reduce((sum, item) => {
        const itemPrice = calculateItemPrice(item.menuItem)
        return sum + itemPrice * item.quantity
    }, 0)

    const service = subtotal * serviceCharge
    const tax = (subtotal + service) * taxRate
    const total = subtotal + tax + service

    return {
        subtotal,
        tax,
        service,
        total,
    }
}

export const generateOrderId = (): string => {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substr(2, 5)
    return `ORD-${timestamp.slice(-6)}-${random.toUpperCase()}`
}

export const getOrderStatusColor = (status: Order['status']): string => {
    const colors = {
        pending: 'bg-yellow-100 text-yellow-800',
        preparing: 'bg-blue-100 text-blue-800',
        ready: 'bg-green-100 text-green-800',
        served: 'bg-gray-100 text-gray-800',
        cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || colors.pending
}

export const getPaymentStatusColor = (status: Order['paymentStatus']): string => {
    const colors = {
        pending: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800',
        refunded: 'bg-red-100 text-red-800',
    }
    return colors[status] || colors.pending
}

export const calculateOrderTime = (createdAt: Date): string => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / 60000)

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
}

export const filterMenuItems = (
    items: MenuItem[],
    category?: string,
    searchQuery?: string,
    dietaryFilter?: 'all' | 'veg' | 'non-veg'
): MenuItem[] => {
    let filtered = items

    // Filter by availability
    filtered = filtered.filter(item => item.available)

    // Filter by category
    if (category && category !== 'all') {
        filtered = filtered.filter(item => item.category === category)
    }

    // Filter by dietary preference
    if (dietaryFilter && dietaryFilter !== 'all') {
        const targetType = dietaryFilter === 'veg' ? 'Veg' : 'Non Veg'
        filtered = filtered.filter(item => item.type === targetType)
    }

    // Filter by search query
    if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.ingredients?.some(ingredient =>
                ingredient.toLowerCase().includes(query)
            )
        )
    }

    return filtered
}

export const sortOrders = (
    orders: Order[],
    sortBy: 'newest' | 'oldest' | 'amount-high' | 'amount-low' | 'status'
): Order[] => {
    return [...orders].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            case 'oldest':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            case 'amount-high':
                return b.total - a.total
            case 'amount-low':
                return a.total - b.total
            case 'status':
                const statusOrder = { pending: 0, preparing: 1, ready: 2, served: 3, cancelled: 4 }
                return statusOrder[a.status] - statusOrder[b.status]
            default:
                return 0
        }
    })
}

export const validateMenuItem = (item: Partial<MenuItem>): string[] => {
    const errors: string[] = []

    if (!item.name?.trim()) errors.push('Name is required')
    if (!item.price || item.price <= 0) errors.push('Price must be greater than 0')
    if (!item.category?.trim()) errors.push('Category is required')
    if (!item.type) errors.push('Type (Veg/Non Veg) is required')
    if (item.discount && (item.discount < 0 || item.discount > 100)) {
        errors.push('Discount must be between 0 and 100')
    }

    return errors
}

export const exportToCSV = (data: any[], filename: string): void => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header]
                // Escape commas and quotes in values
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`
                }
                return value
            }).join(',')
        )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}

export const printReceipt = (order: Order): void => {
    const receiptWindow = window.open('', '_blank')
    if (!receiptWindow) return

    const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt - ${order.id}</title>
      <style>
        body { font-family: monospace; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .order-info { margin: 10px 0; }
        .items { margin: 10px 0; }
        .item { display: flex; justify-content: space-between; }
        .total { border-top: 2px solid #000; padding-top: 10px; font-weight: bold; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>POSify Restaurant</h2>
        <p>Order Receipt</p>
      </div>
      
      <div class="order-info">
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Date:</strong> ${formatDateTime(order.createdAt)}</p>
        <p><strong>Type:</strong> ${order.type}</p>
        ${order.tableId ? `<p><strong>Table:</strong> ${order.tableId}</p>` : ''}
        ${order.customer ? `<p><strong>Customer:</strong> ${order.customer.name}</p>` : ''}
      </div>
      
      <div class="items">
        <h3>Items:</h3>
        ${order.items.map(item => `
          <div class="item">
            <span>${item.quantity}x ${item.menuItem.name}</span>
            <span>${formatCurrency(calculateItemPrice(item.menuItem) * item.quantity)}</span>
          </div>
        `).join('')}
      </div>
      
      <div class="total">
        <div class="item">
          <span>Subtotal:</span>
          <span>${formatCurrency(order.subtotal)}</span>
        </div>
        <div class="item">
          <span>Tax:</span>
          <span>${formatCurrency(order.tax)}</span>
        </div>
        <div class="item">
          <span><strong>Total:</strong></span>
          <span><strong>${formatCurrency(order.total)}</strong></span>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <p>Thank you for dining with us!</p>
      </div>
    </body>
    </html>
  `

    receiptWindow.document.write(receiptHTML)
    receiptWindow.document.close()
    receiptWindow.print()
}