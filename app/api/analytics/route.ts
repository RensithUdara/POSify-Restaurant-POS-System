import { NextRequest, NextResponse } from 'next/server'

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'today' // today, week, month, year
    const metric = searchParams.get('metric') // sales, orders, customers, etc.

    // Mock analytics data - in a real app, this would come from your database
    const mockAnalytics = {
      today: {
        sales: {
          total: 2450.75,
          orders: 45,
          avgOrderValue: 54.46,
          growth: 12.5 // percentage
        },
        orders: {
          pending: 3,
          preparing: 7,
          ready: 2,
          served: 33,
          cancelled: 0
        },
        topItems: [
          { id: '1', name: 'Classic Burger', orders: 12, revenue: 191.88 },
          { id: '2', name: 'Margherita Pizza', orders: 8, revenue: 151.92 },
          { id: '3', name: 'Caesar Salad', orders: 6, revenue: 77.94 }
        ],
        hourlyBreakdown: [
          { hour: 9, sales: 120, orders: 3 },
          { hour: 10, sales: 250, orders: 5 },
          { hour: 11, sales: 380, orders: 8 },
          { hour: 12, sales: 650, orders: 15 },
          { hour: 13, sales: 820, orders: 18 },
          { hour: 14, sales: 230, orders: 4 }
        ]
      },
      week: {
        sales: {
          total: 17155.25,
          orders: 315,
          avgOrderValue: 54.46,
          growth: 8.3
        },
        dailyBreakdown: [
          { day: 'Mon', sales: 2100, orders: 42 },
          { day: 'Tue', sales: 2350, orders: 47 },
          { day: 'Wed', sales: 2800, orders: 56 },
          { day: 'Thu', sales: 2650, orders: 53 },
          { day: 'Fri', sales: 3100, orders: 62 },
          { day: 'Sat', sales: 2850, orders: 57 },
          { day: 'Sun', sales: 1305, orders: 26 }
        ]
      },
      month: {
        sales: {
          total: 68621.00,
          orders: 1260,
          avgOrderValue: 54.46,
          growth: 15.7
        },
        categoryBreakdown: [
          { category: 'Burgers', sales: 24617.35, percentage: 35.9 },
          { category: 'Pizzas', sales: 17355.25, percentage: 25.3 },
          { category: 'Beverages', sales: 13724.20, percentage: 20.0 },
          { category: 'Salads', sales: 8234.52, percentage: 12.0 },
          { category: 'Desserts', sales: 4689.68, percentage: 6.8 }
        ]
      }
    }

    const data = mockAnalytics[period as keyof typeof mockAnalytics] || mockAnalytics.today

    // If specific metric requested, return only that
    if (metric && data[metric as keyof typeof data]) {
      return NextResponse.json({
        success: true,
        data: data[metric as keyof typeof data],
        period,
        metric
      })
    }

    return NextResponse.json({
      success: true,
      data,
      period
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

// POST /api/analytics/track - Track custom events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { event, data, timestamp = new Date().toISOString() } = body

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event name is required' },
        { status: 400 }
      )
    }

    // In a real app, you would store this in your analytics database
    const trackingData = {
      event,
      data,
      timestamp,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    }

    console.log('Tracking event:', trackingData)

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    })
  } catch (error) {
    console.error('Error tracking event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    )
  }
}