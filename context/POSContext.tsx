"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { CartItem, MenuItem, Order, Table, Customer, Settings } from '@/types'

// Local Storage Keys
const STORAGE_KEYS = {
    CART: 'pos_cart',
    ORDERS: 'pos_orders',
    SETTINGS: 'pos_settings',
    CURRENT_TABLE: 'pos_current_table',
    CURRENT_CUSTOMER: 'pos_current_customer',
    ORDER_TYPE: 'pos_order_type'
}

// Utility functions for localStorage
const saveToStorage = (key: string, data: any) => {
    try {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(data))
        }
    } catch (error) {
        console.error('Error saving to localStorage:', error)
    }
}

const getFromStorage = (key: string, defaultValue: any = null) => {
    try {
        if (typeof window !== 'undefined') {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : defaultValue
        }
    } catch (error) {
        console.error('Error reading from localStorage:', error)
    }
    return defaultValue
}

interface POSState {
    cart: CartItem[]
    currentTable?: Table
    currentCustomer?: Customer
    orders: Order[]
    menuItems: MenuItem[]
    categories: { id: string; name: string; icon?: string }[]
    selectedCategory: string | null
    orderType: 'dine-in' | 'takeaway' | 'delivery'
    settings: Settings
}

type POSAction =
    | { type: 'ADD_TO_CART'; payload: { menuItem: MenuItem; quantity?: number } }
    | { type: 'REMOVE_FROM_CART'; payload: { itemId: string } }
    | { type: 'UPDATE_CART_ITEM'; payload: { itemId: string; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'SET_CURRENT_TABLE'; payload: Table }
    | { type: 'SET_CURRENT_CUSTOMER'; payload: Customer }
    | { type: 'SET_ORDER_TYPE'; payload: 'dine-in' | 'takeaway' | 'delivery' }
    | { type: 'SET_SELECTED_CATEGORY'; payload: string | null }
    | { type: 'CREATE_ORDER'; payload: Order }
    | { type: 'UPDATE_ORDER'; payload: { orderId: string; updates: Partial<Order> } }
    | { type: 'SET_MENU_ITEMS'; payload: MenuItem[] }
    | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }

const getInitialState = (): POSState => {
    const defaultState: POSState = {
        cart: [],
        orders: [],
        menuItems: [],
        categories: [
            { id: 'all', name: 'All Items' },
            { id: 'appetizers', name: 'Appetizers' },
            { id: 'mains', name: 'Main Course' },
            { id: 'desserts', name: 'Desserts' },
            { id: 'beverages', name: 'Beverages' },
            { id: 'salads', name: 'Salads' },
            { id: 'burgers', name: 'Burgers' },
            { id: 'pizzas', name: 'Pizzas' },
        ],
        selectedCategory: 'all',
        orderType: 'dine-in',
        settings: {
            restaurantName: 'POSify Restaurant',
            currency: 'USD',
            taxRate: 0.08,
            serviceCharge: 0.10,
            orderAutoAccept: true,
            printReceipts: true,
            theme: 'light'
        }
    }

    // Load persisted data
    return {
        ...defaultState,
        cart: getFromStorage(STORAGE_KEYS.CART, []),
        orders: getFromStorage(STORAGE_KEYS.ORDERS, []).map((order: any) => ({
            ...order,
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt),
            servedAt: order.servedAt ? new Date(order.servedAt) : undefined
        })),
        currentTable: getFromStorage(STORAGE_KEYS.CURRENT_TABLE),
        currentCustomer: getFromStorage(STORAGE_KEYS.CURRENT_CUSTOMER),
        orderType: getFromStorage(STORAGE_KEYS.ORDER_TYPE, 'dine-in'),
        settings: {
            ...defaultState.settings,
            ...getFromStorage(STORAGE_KEYS.SETTINGS, {})
        }
    }
}

const initialState = getInitialState()

function posReducer(state: POSState, action: POSAction): POSState {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existingItemIndex = state.cart.findIndex(
                item => item.menuItem.id === action.payload.menuItem.id
            )

            let updatedCart
            if (existingItemIndex >= 0) {
                updatedCart = [...state.cart]
                updatedCart[existingItemIndex].quantity += action.payload.quantity || 1
            } else {
                const newCartItem: CartItem = {
                    id: `cart-${Date.now()}-${Math.random()}`,
                    menuItem: action.payload.menuItem,
                    quantity: action.payload.quantity || 1
                }
                updatedCart = [...state.cart, newCartItem]
            }
            
            saveToStorage(STORAGE_KEYS.CART, updatedCart)
            return { ...state, cart: updatedCart }
        }

        case 'REMOVE_FROM_CART': {
            const updatedCart = state.cart.filter(item => item.id !== action.payload.itemId)
            saveToStorage(STORAGE_KEYS.CART, updatedCart)
            return { ...state, cart: updatedCart }
        }

        case 'UPDATE_CART_ITEM': {
            const updatedCart = state.cart.map(item =>
                item.id === action.payload.itemId
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            ).filter(item => item.quantity > 0)

            saveToStorage(STORAGE_KEYS.CART, updatedCart)
            return { ...state, cart: updatedCart }
        }

        case 'CLEAR_CART':
            saveToStorage(STORAGE_KEYS.CART, [])
            return { ...state, cart: [] }

        case 'SET_CURRENT_TABLE':
            saveToStorage(STORAGE_KEYS.CURRENT_TABLE, action.payload)
            return { ...state, currentTable: action.payload }

        case 'SET_CURRENT_CUSTOMER':
            saveToStorage(STORAGE_KEYS.CURRENT_CUSTOMER, action.payload)
            return { ...state, currentCustomer: action.payload }

        case 'SET_ORDER_TYPE':
            saveToStorage(STORAGE_KEYS.ORDER_TYPE, action.payload)
            return { ...state, orderType: action.payload }

        case 'SET_SELECTED_CATEGORY':
            return { ...state, selectedCategory: action.payload }

        case 'CREATE_ORDER': {
            const updatedOrders = [...state.orders, action.payload]
            saveToStorage(STORAGE_KEYS.ORDERS, updatedOrders)
            saveToStorage(STORAGE_KEYS.CART, [])
            return {
                ...state,
                orders: updatedOrders,
                cart: []
            }
        }

        case 'UPDATE_ORDER': {
            const updatedOrders = state.orders.map(order =>
                order.id === action.payload.orderId
                    ? { ...order, ...action.payload.updates, updatedAt: new Date() }
                    : order
            )
            saveToStorage(STORAGE_KEYS.ORDERS, updatedOrders)
            return { ...state, orders: updatedOrders }
        }

        case 'SET_MENU_ITEMS':
            return { ...state, menuItems: action.payload }

        case 'UPDATE_SETTINGS': {
            const updatedSettings = { ...state.settings, ...action.payload }
            saveToStorage(STORAGE_KEYS.SETTINGS, updatedSettings)
            return {
                ...state,
                settings: updatedSettings
            }
        }

        default:
            return state
    }
}

const POSContext = createContext<{
    state: POSState
    dispatch: React.Dispatch<POSAction>
    addToCart: (menuItem: MenuItem, quantity?: number) => void
    removeFromCart: (itemId: string) => void
    updateCartItem: (itemId: string, quantity: number) => void
    clearCart: () => void
    getCartTotal: () => { subtotal: number; tax: number; total: number }
    createOrder: (paymentMethod?: any) => void
} | null>(null)

export function POSProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(posReducer, initialState)

    // Initialize menu items
    useEffect(() => {
        const sampleMenuItems: MenuItem[] = [
            {
                id: '1',
                name: 'Tasty Vegetable Salad Healthy Diet',
                description: 'Fresh mixed greens with seasonal vegetables and house dressing',
                price: 17.99,
                discount: 20,
                category: 'salads',
                image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg',
                type: 'Veg',
                available: true,
                preparationTime: 10,
                ingredients: ['Mixed greens', 'Tomatoes', 'Cucumbers', 'Carrots', 'House dressing']
            },
            {
                id: '2',
                name: 'Original Chess Meat Burger With Chips',
                description: 'Juicy beef patty with cheese, lettuce, tomato and crispy fries',
                price: 23.99,
                category: 'burgers',
                image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg',
                type: 'Non Veg',
                available: true,
                preparationTime: 15,
                ingredients: ['Beef patty', 'Cheese', 'Lettuce', 'Tomato', 'Fries']
            },
            {
                id: '3',
                name: 'Tacos Salsa With Chickens Grilled',
                description: 'Grilled chicken tacos with fresh salsa and guacamole',
                price: 14.99,
                category: 'mains',
                image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg',
                type: 'Non Veg',
                available: true,
                preparationTime: 12,
                ingredients: ['Grilled chicken', 'Corn tortillas', 'Salsa', 'Guacamole']
            },
            {
                id: '4',
                name: 'Fresh Orange Juice With Basil Seed',
                description: 'Freshly squeezed orange juice with basil seeds for extra nutrition',
                price: 12.99,
                category: 'beverages',
                image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg',
                type: 'Veg',
                available: true,
                preparationTime: 5,
                ingredients: ['Fresh oranges', 'Basil seeds', 'Ice']
            },
            {
                id: '5',
                name: 'Meat Sushi Maki With Tuna, Ship And Other',
                description: 'Fresh sushi rolls with tuna and assorted seafood',
                price: 9.99,
                category: 'appetizers',
                image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg',
                type: 'Non Veg',
                available: true,
                preparationTime: 8,
                ingredients: ['Sushi rice', 'Tuna', 'Nori', 'Wasabi', 'Soy sauce']
            },
            {
                id: '6',
                name: 'Original Chess Burger With French Fries',
                description: 'Classic vegetarian burger with crispy french fries',
                price: 10.59,
                discount: 20,
                category: 'burgers',
                image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg',
                type: 'Veg',
                available: true,
                preparationTime: 12,
                ingredients: ['Veggie patty', 'Cheese', 'Lettuce', 'Tomato', 'French fries']
            },
            {
                id: '7',
                name: 'Margherita Pizza',
                description: 'Classic pizza with tomato sauce, mozzarella and fresh basil',
                price: 18.99,
                category: 'pizzas',
                image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg',
                type: 'Veg',
                available: true,
                preparationTime: 18,
                ingredients: ['Pizza dough', 'Tomato sauce', 'Mozzarella', 'Fresh basil']
            },
            {
                id: '8',
                name: 'Chocolate Lava Cake',
                description: 'Warm chocolate cake with molten center served with vanilla ice cream',
                price: 8.99,
                category: 'desserts',
                image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg',
                type: 'Veg',
                available: true,
                preparationTime: 15,
                ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Flour', 'Vanilla ice cream']
            }
        ]

        dispatch({ type: 'SET_MENU_ITEMS', payload: sampleMenuItems })
    }, [])

    const addToCart = (menuItem: MenuItem, quantity = 1) => {
        dispatch({ type: 'ADD_TO_CART', payload: { menuItem, quantity } })
    }

    const removeFromCart = (itemId: string) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { itemId } })
    }

    const updateCartItem = (itemId: string, quantity: number) => {
        dispatch({ type: 'UPDATE_CART_ITEM', payload: { itemId, quantity } })
    }

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' })
    }

    const getCartTotal = () => {
        const subtotal = state.cart.reduce(
            (sum, item) => {
                const itemPrice = item.menuItem.discount
                    ? item.menuItem.price * (1 - item.menuItem.discount / 100)
                    : item.menuItem.price
                return sum + (itemPrice * item.quantity)
            },
            0
        )
        const tax = subtotal * state.settings.taxRate
        const total = subtotal + tax
        return { subtotal, tax, total }
    }

    const createOrder = (paymentMethod?: any) => {
        if (state.cart.length === 0) return

        const { subtotal, tax, total } = getCartTotal()

        const newOrder: Order = {
            id: `order-${Date.now()}`,
            tableId: state.currentTable?.id,
            customer: state.currentCustomer,
            items: [...state.cart],
            status: 'pending',
            type: state.orderType,
            subtotal,
            tax,
            discount: 0,
            total,
            paymentMethod,
            paymentStatus: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        dispatch({ type: 'CREATE_ORDER', payload: newOrder })
    }

    return (
        <POSContext.Provider
            value={{
                state,
                dispatch,
                addToCart,
                removeFromCart,
                updateCartItem,
                clearCart,
                getCartTotal,
                createOrder
            }}
        >
            {children}
        </POSContext.Provider>
    )
}

export function usePOS() {
    const context = useContext(POSContext)
    if (!context) {
        throw new Error('usePOS must be used within a POSProvider')
    }
    return context
}