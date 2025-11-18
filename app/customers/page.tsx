"use client"

import { useState, useEffect } from "react"
import { SidebarNav } from "../../components/sidebar-nav"
import { Header } from "../../components/header"
import { Footer } from "../../components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Users, 
  Search, 
  Plus, 
  Star, 
  Gift, 
  Phone, 
  Mail,
  Calendar,
  ShoppingBag,
  DollarSign,
  Edit,
  Trash2,
  Filter
} from "lucide-react"
import { Customer } from "@/types"
import { toast } from "sonner"

// Mock customer data
const initialCustomers: (Customer & {
  totalOrders: number
  totalSpent: number
  loyaltyPoints: number
  lastOrderAt: Date
  preferences: {
    favoriteCategory: string
    dietaryRestrictions: string[]
    spiceLevel: string
  }
})[] = [
  {
    id: 'cust_1',
    name: 'John Doe',
    phone: '555-0123',
    email: 'john.doe@email.com',
    loyaltyPoints: 150,
    totalOrders: 12,
    totalSpent: 485.50,
    lastOrderAt: new Date('2024-11-18'),
    preferences: {
      favoriteCategory: 'burgers',
      dietaryRestrictions: [],
      spiceLevel: 'medium'
    }
  },
  {
    id: 'cust_2',
    name: 'Jane Smith',
    phone: '555-0456',
    email: 'jane.smith@email.com',
    loyaltyPoints: 89,
    totalOrders: 7,
    totalSpent: 298.75,
    lastOrderAt: new Date('2024-11-17'),
    preferences: {
      favoriteCategory: 'salads',
      dietaryRestrictions: ['vegetarian'],
      spiceLevel: 'mild'
    }
  },
  {
    id: 'cust_3',
    name: 'Bob Wilson',
    phone: '555-0789',
    email: 'bob.wilson@email.com',
    loyaltyPoints: 234,
    totalOrders: 18,
    totalSpent: 723.25,
    lastOrderAt: new Date('2024-11-19'),
    preferences: {
      favoriteCategory: 'pizzas',
      dietaryRestrictions: [],
      spiceLevel: 'hot'
    }
  },
  {
    id: 'cust_4',
    name: 'Alice Johnson',
    phone: '555-0321',
    email: 'alice.johnson@email.com',
    loyaltyPoints: 67,
    totalOrders: 5,
    totalSpent: 187.50,
    lastOrderAt: new Date('2024-11-16'),
    preferences: {
      favoriteCategory: 'desserts',
      dietaryRestrictions: ['gluten-free'],
      spiceLevel: 'mild'
    }
  }
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<typeof initialCustomers[0] | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dietaryRestrictions: [] as string[],
    spiceLevel: 'medium'
  })

  const filteredCustomers = customers
    .filter(customer => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.phone.includes(query) ||
        customer.email.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => {
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

  const handleAddCustomer = () => {
    if (!formData.name) {
      toast.error("Customer name is required")
      return
    }

    // Check for existing customer
    const existingCustomer = customers.find(c => 
      c.phone === formData.phone || c.email === formData.email
    )

    if (existingCustomer) {
      toast.error("Customer with this phone or email already exists")
      return
    }

    const newCustomer = {
      id: `cust_${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      loyaltyPoints: 0,
      totalOrders: 0,
      totalSpent: 0,
      lastOrderAt: new Date(),
      preferences: {
        favoriteCategory: '',
        dietaryRestrictions: formData.dietaryRestrictions,
        spiceLevel: formData.spiceLevel
      }
    }

    setCustomers([...customers, newCustomer])
    setFormData({ name: '', phone: '', email: '', dietaryRestrictions: [], spiceLevel: 'medium' })
    setShowAddDialog(false)
    toast.success("Customer added successfully")
  }

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId))
    toast.success("Customer deleted successfully")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getLoyaltyTier = (points: number) => {
    if (points >= 200) return { name: 'Gold', color: 'bg-yellow-100 text-yellow-800' }
    if (points >= 100) return { name: 'Silver', color: 'bg-gray-100 text-gray-800' }
    return { name: 'Bronze', color: 'bg-orange-100 text-orange-800' }
  }

  const totalCustomers = customers.length
  const totalLoyaltyPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0)
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0) || 0

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Management</h1>
                <p className="text-gray-600">Manage customer profiles, loyalty points, and preferences</p>
              </div>
              
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Customer Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="spiceLevel">Spice Preference</Label>
                      <Select value={formData.spiceLevel} onValueChange={(value) => setFormData({ ...formData, spiceLevel: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hot">Hot</SelectItem>
                          <SelectItem value="extra-hot">Extra Hot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddCustomer} className="w-full">
                      Add Customer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Customers</p>
                      <p className="text-2xl font-bold text-blue-600">{totalCustomers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Star className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Loyalty Points</p>
                      <p className="text-2xl font-bold text-yellow-600">{totalLoyaltyPoints.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Avg Order Value</p>
                      <p className="text-2xl font-bold text-purple-600">{formatCurrency(avgOrderValue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Customers</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="search"
                        placeholder="Search by name, phone, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="sortBy">Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                        <SelectItem value="loyaltyPoints">Loyalty Points</SelectItem>
                        <SelectItem value="totalSpent">Total Spent</SelectItem>
                        <SelectItem value="lastOrder">Last Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customers Table */}
            <Card>
              <CardHeader>
                <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Loyalty Tier</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Last Order</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => {
                      const loyaltyTier = getLoyaltyTier(customer.loyaltyPoints)
                      return (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{customer.name}</p>
                                <p className="text-sm text-gray-500">
                                  {customer.loyaltyPoints} points
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {customer.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {customer.phone}
                                </div>
                              )}
                              {customer.email && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {customer.email}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={loyaltyTier.color}>
                              {loyaltyTier.name}
                            </Badge>
                          </TableCell>
                          <TableCell>{customer.totalOrders}</TableCell>
                          <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(customer.lastOrderAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedCustomer(customer)
                                  setShowDetailsDialog(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCustomer(customer.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Customer Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Customer Details</DialogTitle>
                </DialogHeader>
                {selectedCustomer && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg">
                          {getInitials(selectedCustomer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                        <Badge className={getLoyaltyTier(selectedCustomer.loyaltyPoints).color}>
                          {getLoyaltyTier(selectedCustomer.loyaltyPoints).name} Member
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Contact Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {selectedCustomer.phone || 'Not provided'}
                          </div>
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {selectedCustomer.email || 'Not provided'}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold">Order Statistics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Total Orders:</span>
                            <span className="font-medium">{selectedCustomer.totalOrders}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Total Spent:</span>
                            <span className="font-medium">{formatCurrency(selectedCustomer.totalSpent)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Loyalty Points:</span>
                            <span className="font-medium">{selectedCustomer.loyaltyPoints}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Avg Order Value:</span>
                            <span className="font-medium">
                              {formatCurrency(selectedCustomer.totalSpent / selectedCustomer.totalOrders || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Preferences</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Favorite Category</p>
                          <p className="font-medium capitalize">
                            {selectedCustomer.preferences.favoriteCategory || 'Not set'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Spice Level</p>
                          <p className="font-medium capitalize">{selectedCustomer.preferences.spiceLevel}</p>
                        </div>
                      </div>
                      {selectedCustomer.preferences.dietaryRestrictions.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Dietary Restrictions</p>
                          <div className="flex gap-2">
                            {selectedCustomer.preferences.dietaryRestrictions.map((restriction, index) => (
                              <Badge key={index} variant="outline">
                                {restriction}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  )
}