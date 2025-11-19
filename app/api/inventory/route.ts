import { NextRequest, NextResponse } from 'next/server'

// Mock inventory database
let inventory = [
    {
        id: 'item_1',
        name: 'Fresh Beef Patties',
        category: 'meat',
        currentStock: 45,
        minStock: 20,
        maxStock: 100,
        unit: 'pieces',
        costPerUnit: 3.50,
        supplier: 'Local Meat Co.',
        lastRestocked: new Date('2024-11-15'),
        expiryDate: new Date('2024-11-25') as Date | null,
        status: 'in-stock'
    },
    {
        id: 'item_2',
        name: 'Burger Buns',
        category: 'bakery',
        currentStock: 12,
        minStock: 30,
        maxStock: 150,
        unit: 'pieces',
        costPerUnit: 0.75,
        supplier: 'Fresh Bakery Ltd.',
        lastRestocked: new Date('2024-11-18'),
        expiryDate: new Date('2024-11-22') as Date | null,
        status: 'low-stock'
    },
    {
        id: 'item_3',
        name: 'Lettuce',
        category: 'vegetables',
        currentStock: 8,
        minStock: 15,
        maxStock: 50,
        unit: 'heads',
        costPerUnit: 1.25,
        supplier: 'Green Valley Farms',
        lastRestocked: new Date('2024-11-17'),
        expiryDate: new Date('2024-11-24') as Date | null,
        status: 'low-stock'
    },
    {
        id: 'item_4',
        name: 'Cheddar Cheese',
        category: 'dairy',
        currentStock: 0,
        minStock: 10,
        maxStock: 40,
        unit: 'kg',
        costPerUnit: 8.50,
        supplier: 'Dairy Fresh Co.',
        lastRestocked: new Date('2024-11-10'),
        expiryDate: new Date('2024-11-20') as Date | null,
        status: 'out-of-stock'
    }
]

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')
        const category = searchParams.get('category')
        const status = searchParams.get('status')
        const sortBy = searchParams.get('sortBy') || 'name'
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        let filteredInventory = inventory

        // Search by name or supplier
        if (search) {
            const query = search.toLowerCase()
            filteredInventory = inventory.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.supplier.toLowerCase().includes(query)
            )
        }

        // Filter by category
        if (category && category !== 'all') {
            filteredInventory = filteredInventory.filter(item => item.category === category)
        }

        // Filter by status
        if (status && status !== 'all') {
            filteredInventory = filteredInventory.filter(item => item.status === status)
        }

        // Sort inventory
        filteredInventory.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'stock':
                    return b.currentStock - a.currentStock
                case 'expiry':
                    const aExpiry = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity
                    const bExpiry = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity
                    return aExpiry - bExpiry
                case 'cost':
                    return b.costPerUnit - a.costPerUnit
                default:
                    return 0
            }
        })

        // Apply pagination
        const paginatedInventory = filteredInventory.slice(offset, offset + limit)

        return NextResponse.json({
            success: true,
            data: paginatedInventory,
            total: filteredInventory.length,
            stats: {
                totalItems: inventory.length,
                lowStock: inventory.filter(item => item.status === 'low-stock').length,
                outOfStock: inventory.filter(item => item.status === 'out-of-stock').length,
                totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0)
            },
            pagination: {
                offset,
                limit,
                hasMore: offset + limit < filteredInventory.length
            }
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch inventory' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        // Validate required fields
        if (!data.name || !data.category || !data.unit || !data.costPerUnit) {
            return NextResponse.json(
                { success: false, error: 'Name, category, unit, and cost per unit are required' },
                { status: 400 }
            )
        }

        const newItem = {
            id: `item_${Date.now()}`,
            name: data.name,
            category: data.category,
            currentStock: data.currentStock || 0,
            minStock: data.minStock || 10,
            maxStock: data.maxStock || 100,
            unit: data.unit,
            costPerUnit: parseFloat(data.costPerUnit),
            supplier: data.supplier || '',
            lastRestocked: new Date(),
            expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
            status: data.currentStock <= 0 ? 'out-of-stock' : 
                   data.currentStock <= data.minStock ? 'low-stock' : 'in-stock'
        }

        inventory.push(newItem)

        return NextResponse.json({
            success: true,
            data: newItem,
            message: 'Inventory item created successfully'
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to create inventory item' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json()
        const { id, ...updates } = data

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Item ID is required' },
                { status: 400 }
            )
        }

        const itemIndex = inventory.findIndex(item => item.id === id)
        if (itemIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Inventory item not found' },
                { status: 404 }
            )
        }

        // Update item and recalculate status
        const updatedItem = {
            ...inventory[itemIndex],
            ...updates,
            updatedAt: new Date()
        }

        // Recalculate status based on stock levels
        if (updatedItem.currentStock <= 0) {
            updatedItem.status = 'out-of-stock'
        } else if (updatedItem.currentStock <= updatedItem.minStock) {
            updatedItem.status = 'low-stock'
        } else {
            updatedItem.status = 'in-stock'
        }

        inventory[itemIndex] = updatedItem

        return NextResponse.json({
            success: true,
            data: updatedItem,
            message: 'Inventory item updated successfully'
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to update inventory item' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Item ID is required' },
                { status: 400 }
            )
        }

        const itemIndex = inventory.findIndex(item => item.id === id)
        if (itemIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Inventory item not found' },
                { status: 404 }
            )
        }

        const deletedItem = inventory.splice(itemIndex, 1)[0]

        return NextResponse.json({
            success: true,
            data: deletedItem,
            message: 'Inventory item deleted successfully'
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to delete inventory item' },
            { status: 500 }
        )
    }
}