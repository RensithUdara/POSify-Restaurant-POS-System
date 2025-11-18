"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Utensils,
  UserPlus,
  Edit,
  Trash2
} from "lucide-react"
import { Table, Customer } from "@/types"
import { usePOS } from "@/context/POSContext"
import { toast } from "sonner"

interface TableManagementProps {
  onTableSelect?: (table: Table) => void
}

export function TableManagement({ onTableSelect }: TableManagementProps) {
  const { state, dispatch } = usePOS()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
  const [newTableNumber, setNewTableNumber] = useState("")
  const [newTableCapacity, setNewTableCapacity] = useState("4")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")

  // Sample tables - in a real app this would come from your backend
  const [tables, setTables] = useState<Table[]>([
    { id: "table-1", number: 1, capacity: 2, status: "available" },
    { id: "table-2", number: 2, capacity: 4, status: "occupied", customer: { id: "c1", name: "John Doe", phone: "123-456-7890" } },
    { id: "table-3", number: 3, capacity: 6, status: "reserved", customer: { id: "c2", name: "Jane Smith", phone: "098-765-4321" } },
    { id: "table-4", number: 4, capacity: 4, status: "available" },
    { id: "table-5", number: 5, capacity: 2, status: "cleaning" },
    { id: "table-6", number: 6, capacity: 8, status: "available" },
    { id: "table-7", number: 7, capacity: 4, status: "occupied", customer: { id: "c3", name: "Bob Wilson" } },
    { id: "table-8", number: 8, capacity: 2, status: "available" },
  ])

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200'
      case 'occupied': return 'bg-red-100 text-red-800 border-red-200'
      case 'reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cleaning': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: Table['status']) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />
      case 'occupied': return <Users className="h-4 w-4" />
      case 'reserved': return <Clock className="h-4 w-4" />
      case 'cleaning': return <Utensils className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const handleTableSelect = (table: Table) => {
    if (table.status === 'available') {
      dispatch({ type: 'SET_CURRENT_TABLE', payload: table })
      onTableSelect?.(table)
      toast.success(`Selected Table ${table.number}`)
    } else {
      toast.error(`Table ${table.number} is currently ${table.status}`)
    }
  }

  const handleStatusChange = (tableId: string, newStatus: Table['status']) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, status: newStatus, customer: newStatus === 'available' ? undefined : table.customer }
        : table
    ))
    toast.success("Table status updated")
  }

  const handleCreateTable = () => {
    if (!newTableNumber || !newTableCapacity) {
      toast.error("Please fill all fields")
      return
    }

    const tableNumber = parseInt(newTableNumber)
    if (tables.some(t => t.number === tableNumber)) {
      toast.error("Table number already exists")
      return
    }

    const newTable: Table = {
      id: `table-${Date.now()}`,
      number: tableNumber,
      capacity: parseInt(newTableCapacity),
      status: 'available'
    }

    setTables(prev => [...prev, newTable])
    setNewTableNumber("")
    setNewTableCapacity("4")
    setShowCreateDialog(false)
    toast.success(`Table ${tableNumber} created`)
  }

  const handleAssignCustomer = () => {
    if (!selectedTableId || !customerName) {
      toast.error("Please fill required fields")
      return
    }

    const customer: Customer = {
      id: `customer-${Date.now()}`,
      name: customerName,
      phone: customerPhone || undefined,
      email: customerEmail || undefined
    }

    setTables(prev => prev.map(table => 
      table.id === selectedTableId 
        ? { ...table, customer, status: 'occupied' }
        : table
    ))

    setCustomerName("")
    setCustomerPhone("")
    setCustomerEmail("")
    setSelectedTableId(null)
    setShowCustomerDialog(false)
    toast.success("Customer assigned to table")
  }

  const handleDeleteTable = (tableId: string) => {
    const table = tables.find(t => t.id === tableId)
    if (table?.status !== 'available') {
      toast.error("Cannot delete occupied table")
      return
    }

    setTables(prev => prev.filter(t => t.id !== tableId))
    toast.success("Table deleted")
  }

  const availableTables = tables.filter(t => t.status === 'available').length
  const occupiedTables = tables.filter(t => t.status === 'occupied').length
  const reservedTables = tables.filter(t => t.status === 'reserved').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Table Management</h2>
          <p className="text-gray-600">Manage restaurant tables and reservations</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>Add New Table</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Table</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="table-number">Table Number</Label>
                <Input
                  id="table-number"
                  type="number"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  placeholder="Enter table number"
                />
              </div>
              <div>
                <Label htmlFor="table-capacity">Capacity</Label>
                <Select value={newTableCapacity} onValueChange={setNewTableCapacity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 People</SelectItem>
                    <SelectItem value="4">4 People</SelectItem>
                    <SelectItem value="6">6 People</SelectItem>
                    <SelectItem value="8">8 People</SelectItem>
                    <SelectItem value="10">10 People</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateTable} className="w-full">
                Create Table
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{availableTables}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-red-600">{occupiedTables}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Reserved</p>
                <p className="text-2xl font-bold text-yellow-600">{reservedTables}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Utensils className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Tables</p>
                <p className="text-2xl font-bold text-blue-600">{tables.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map(table => (
          <Card 
            key={table.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              state.currentTable?.id === table.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleTableSelect(table)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Table {table.number}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTableId(table.id)
                      setShowCustomerDialog(true)
                    }}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteTable(table.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Capacity:</span>
                  <span className="font-medium">{table.capacity} people</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge className={`${getStatusColor(table.status)} flex items-center gap-1`}>
                    {getStatusIcon(table.status)}
                    {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                  </Badge>
                  
                  <Select 
                    value={table.status} 
                    onValueChange={(value: Table['status']) => handleStatusChange(table.id, value)}
                  >
                    <SelectTrigger 
                      className="w-24 h-6 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {table.customer && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                    <p className="font-medium">{table.customer.name}</p>
                    {table.customer.phone && (
                      <p className="text-gray-600">{table.customer.phone}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customer Assignment Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Customer to Table</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customer-name">Customer Name *</Label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="customer-phone">Phone Number</Label>
              <Input
                id="customer-phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="customer-email">Email</Label>
              <Input
                id="customer-email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <Button onClick={handleAssignCustomer} className="w-full">
              Assign Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}