export interface MenuItem {
    id: string
    name: string
    description?: string
    price: number
    category: string
    image: string
    type: "Veg" | "Non Veg"
    discount?: number
    available: boolean
    preparationTime?: number
    ingredients?: string[]
    allergens?: string[]
}

export interface CartItem {
    id: string
    menuItem: MenuItem
    quantity: number
    specialInstructions?: string
    customizations?: Record<string, any>
}

export interface Category {
    id: string
    name: string
    icon?: string
    color?: string
}

export interface Table {
    id: string
    number: number
    capacity: number
    status: "available" | "occupied" | "reserved" | "cleaning"
    customer?: Customer
}

export interface Customer {
    id: string
    name: string
    phone?: string
    email?: string
    loyaltyPoints?: number
}

export interface Order {
    id: string
    tableId?: string
    customer?: Customer
    items: CartItem[]
    status: "pending" | "preparing" | "ready" | "served" | "cancelled"
    type: "dine-in" | "takeaway" | "delivery"
    subtotal: number
    tax: number
    discount: number
    total: number
    paymentMethod?: PaymentMethod
    paymentStatus: "pending" | "paid" | "refunded"
    createdAt: Date
    updatedAt: Date
    servedAt?: Date
    specialInstructions?: string
}

export interface PaymentMethod {
    type: "cash" | "card" | "digital" | "qr"
    details?: Record<string, any>
}

export interface Staff {
    id: string
    name: string
    role: "admin" | "manager" | "waiter" | "chef" | "cashier"
    email: string
    phone?: string
    isActive: boolean
}

export interface Analytics {
    dailySales: number
    totalOrders: number
    popularItems: MenuItem[]
    peakHours: { hour: number; orders: number }[]
    revenue: {
        today: number
        week: number
        month: number
    }
}

export interface Settings {
    restaurantName: string
    currency: string
    taxRate: number
    serviceCharge: number
    orderAutoAccept: boolean
    printReceipts: boolean
    theme: "light" | "dark"
}