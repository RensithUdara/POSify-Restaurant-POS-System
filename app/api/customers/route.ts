import { NextRequest, NextResponse } from 'next/server'

// Mock customer database
let customers = [
    {
        id: 'cust_1',
        name: 'John Doe',
        phone: '555-0123',
        email: 'john.doe@email.com',
        loyaltyPoints: 150,
        totalOrders: 12,
        totalSpent: 485.50,
        preferences: {
            favoriteCategory: 'burgers',
            dietaryRestrictions: [],
            spiceLevel: 'medium'
        },
        createdAt: new Date('2024-01-15'),
        lastOrderAt: new Date('2024-11-18')
    },
    {
        id: 'cust_2',
        name: 'Jane Smith',
        phone: '555-0456',
        email: 'jane.smith@email.com',
        loyaltyPoints: 89,
        totalOrders: 7,
        totalSpent: 298.75,
        preferences: {
            favoriteCategory: 'salads',
            dietaryRestrictions: ['vegetarian'],
            spiceLevel: 'mild'
        },
        createdAt: new Date('2024-02-10'),
        lastOrderAt: new Date('2024-11-17')
    }
]

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')
        const sortBy = searchParams.get('sortBy') || 'name'
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        let filteredCustomers = customers

        // Search by name, phone, or email
        if (search) {
            const query = search.toLowerCase()
            filteredCustomers = customers.filter(customer =>
                customer.name.toLowerCase().includes(query) ||
                customer.phone.includes(query) ||
                customer.email.toLowerCase().includes(query)
            )
        }

        // Sort customers
        filteredCustomers.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'loyaltyPoints':
                    return b.loyaltyPoints - a.loyaltyPoints
                case 'totalSpent':
                    return b.totalSpent - a.totalSpent
                case 'lastOrder':
                    return new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime()
                default:
                    return 0
            }
        })

        // Apply pagination
        const paginatedCustomers = filteredCustomers.slice(offset, offset + limit)

        return NextResponse.json({
            success: true,
            data: paginatedCustomers,
            total: filteredCustomers.length,
            pagination: {
                offset,
                limit,
                hasMore: offset + limit < filteredCustomers.length
            }
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch customers' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        // Validate required fields
        if (!data.name) {
            return NextResponse.json(
                { success: false, error: 'Customer name is required' },
                { status: 400 }
            )
        }

        // Check if customer already exists by phone or email
        const existingCustomer = customers.find(c =>
            (data.phone && c.phone === data.phone) ||
            (data.email && c.email === data.email)
        )

        if (existingCustomer) {
            return NextResponse.json(
                { success: false, error: 'Customer with this phone or email already exists' },
                { status: 409 }
            )
        }

        const newCustomer = {
            id: `cust_${Date.now()}`,
            name: data.name,
            phone: data.phone || '',
            email: data.email || '',
            loyaltyPoints: 0,
            totalOrders: 0,
            totalSpent: 0,
            preferences: {
                favoriteCategory: '',
                dietaryRestrictions: data.dietaryRestrictions || [],
                spiceLevel: data.spiceLevel || 'medium'
            },
            createdAt: new Date(),
            lastOrderAt: null as Date | null
        }

        customers.push(newCustomer)

        return NextResponse.json({
            success: true,
            data: newCustomer,
            message: 'Customer created successfully'
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to create customer' },
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
                { success: false, error: 'Customer ID is required' },
                { status: 400 }
            )
        }

        const customerIndex = customers.findIndex(c => c.id === id)
        if (customerIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Customer not found' },
                { status: 404 }
            )
        }

        // Update customer
        customers[customerIndex] = {
            ...customers[customerIndex],
            ...updates,
            updatedAt: new Date()
        }

        return NextResponse.json({
            success: true,
            data: customers[customerIndex],
            message: 'Customer updated successfully'
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to update customer' },
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
                { success: false, error: 'Customer ID is required' },
                { status: 400 }
            )
        }

        const customerIndex = customers.findIndex(c => c.id === id)
        if (customerIndex === -1) {
            return NextResponse.json(
                { success: false, error: 'Customer not found' },
                { status: 404 }
            )
        }

        const deletedCustomer = customers.splice(customerIndex, 1)[0]

        return NextResponse.json({
            success: true,
            data: deletedCustomer,
            message: 'Customer deleted successfully'
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to delete customer' },
            { status: 500 }
        )
    }
}