import { NextRequest, NextResponse } from 'next/server'
import { sampleMenuItems } from '@/lib/sample-data'

// GET /api/menu - Get all menu items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const type = searchParams.get('type') // 'veg' | 'non-veg'

    let items = sampleMenuItems

    // Filter by category
    if (category && category !== 'all') {
      items = items.filter(item => item.category === category)
    }

    // Filter by dietary preference
    if (type) {
      const targetType = type === 'veg' ? 'Veg' : 'Non Veg'
      items = items.filter(item => item.type === targetType)
    }

    // Filter by search query
    if (search) {
      const query = search.toLowerCase()
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.ingredients?.some(ingredient => 
          ingredient.toLowerCase().includes(query)
        )
      )
    }

    // Only return available items
    items = items.filter(item => item.available)

    return NextResponse.json({
      success: true,
      data: items,
      total: items.length
    })
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

// POST /api/menu - Create new menu item (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'price', 'category', 'type']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // In a real app, you would save to database
    const newItem = {
      id: `item_${Date.now()}`,
      ...body,
      available: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'Menu item created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}