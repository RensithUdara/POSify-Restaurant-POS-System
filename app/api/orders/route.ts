import { NextRequest, NextResponse } from 'next/server'
import { generateOrderId } from '@/lib/pos-utils'

// GET /api/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // In a real app, fetch from database
    // This is mock data for demonstration
    const mockOrders = [
      {
        id: generateOrderId(),
        tableId: 'table_4',
        customer: { name: 'John Doe', phone: '+1234567890' },
        items: [
          {
            id: 'cart_item_1',
            menuItem: {
              id: '1',
              name: 'Classic Burger',
              price: 15.99,
              type: 'Non Veg'
            },
            quantity: 2
          }
        ],
        status: 'pending',
        type: 'dine-in',
        subtotal: 31.98,
        tax: 2.56,
        total: 34.54,
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    let orders = mockOrders

    // Filter by status
    if (status && status !== 'all') {
      orders = orders.filter(order => order.status === status)
    }

    // Apply pagination
    const paginatedOrders = orders.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedOrders,
      total: orders.length,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < orders.length
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

    if (!body.type || !['dine-in', 'takeaway', 'delivery'].includes(body.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order type' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = body.items.reduce((sum: number, item: any) => {
      return sum + (item.menuItem.price * item.quantity)
    }, 0)

    const taxRate = 0.08 // 8% tax
    const tax = subtotal * taxRate
    const total = subtotal + tax

    // Create order
    const newOrder = {
      id: generateOrderId(),
      ...body,
      subtotal,
      tax,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In a real app, save to database
    // await db.orders.create(newOrder)

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: 'Order created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}