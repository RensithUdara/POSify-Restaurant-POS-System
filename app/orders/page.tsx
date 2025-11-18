"use client"

import { useState } from "react"
import { SidebarNav } from "../../components/sidebar-nav"
import { Header } from "../../components/header"
import { Footer } from "../../components/footer"
import { usePOS } from "@/context/POSContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Clock,
    CheckCircle,
    XCircle,
    ChefHat,
    Truck,
    Home,
    ShoppingBag,
    Eye,
    MoreVertical,
    Filter
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Order } from "@/types"

const statusIcons = {
    pending: Clock,
    preparing: ChefHat,
    ready: CheckCircle,
    served: CheckCircle,
    cancelled: XCircle,
}

const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    preparing: "bg-blue-100 text-blue-800",
    ready: "bg-green-100 text-green-800",
    served: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
}

const orderTypeIcons = {
    "dine-in": Home,
    "takeaway": ShoppingBag,
    "delivery": Truck,
}

export default function OrdersPage() {
    const { state, dispatch } = usePOS()
    const [selectedStatus, setSelectedStatus] = useState<string>("all")
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

    const filteredOrders = selectedStatus === "all"
        ? state.orders
        : state.orders.filter(order => order.status === selectedStatus)

    const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
        dispatch({
            type: 'UPDATE_ORDER',
            payload: {
                orderId,
                updates: { status: newStatus }
            }
        })
    }

    const getOrderTypeIcon = (type: Order['type']) => {
        const Icon = orderTypeIcons[type]
        return <Icon className="h-4 w-4" />
    }

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date))
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <SidebarNav />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders Management</h1>
                            <p className="text-gray-600">Monitor and manage all restaurant orders</p>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-4 mb-6">
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-48">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Orders</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="preparing">Preparing</SelectItem>
                                    <SelectItem value="ready">Ready</SelectItem>
                                    <SelectItem value="served">Served</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Orders Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Pending</p>
                                            <p className="text-2xl font-bold text-yellow-600">
                                                {state.orders.filter(o => o.status === 'pending').length}
                                            </p>
                                        </div>
                                        <Clock className="h-8 w-8 text-yellow-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Preparing</p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {state.orders.filter(o => o.status === 'preparing').length}
                                            </p>
                                        </div>
                                        <ChefHat className="h-8 w-8 text-blue-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Ready</p>
                                            <p className="text-2xl font-bold text-green-600">
                                                {state.orders.filter(o => o.status === 'ready').length}
                                            </p>
                                        </div>
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Total Today</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {state.orders.length}
                                            </p>
                                        </div>
                                        <div className="text-sm text-green-600">
                                            ${state.orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Orders List */}
                        <div className="space-y-4">
                            {filteredOrders.length === 0 ? (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <div className="text-gray-400 mb-4">
                                            <Clock className="h-16 w-16 mx-auto" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                                        <p className="text-gray-500">
                                            {selectedStatus === "all"
                                                ? "No orders have been placed yet."
                                                : `No ${selectedStatus} orders found.`
                                            }
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                filteredOrders.map((order) => {
                                    const StatusIcon = statusIcons[order.status]

                                    return (
                                        <Card key={order.id} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="font-semibold text-lg">Order #{order.id.slice(-6)}</h3>
                                                            <Badge className={statusColors[order.status]}>
                                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </Badge>
                                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                                {getOrderTypeIcon(order.type)}
                                                                <span>{order.type}</span>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                                            <div>
                                                                <p className="text-gray-600">Customer</p>
                                                                <p className="font-medium">
                                                                    {order.customer?.name || "Walk-in"}
                                                                </p>
                                                                {order.tableId && (
                                                                    <p className="text-gray-500">Table {order.tableId.split('-')[1]}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <p className="text-gray-600">Items</p>
                                                                <p className="font-medium">{order.items.length} items</p>
                                                                <p className="text-gray-500">
                                                                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} qty
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-gray-600">Total</p>
                                                                <p className="font-medium text-green-600">${order.total.toFixed(2)}</p>
                                                                <p className="text-gray-500">{order.paymentStatus}</p>
                                                            </div>

                                                            <div>
                                                                <p className="text-gray-600">Time</p>
                                                                <p className="font-medium">{formatTime(order.createdAt)}</p>
                                                                <p className="text-gray-500">
                                                                    {Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)} min ago
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={() => setSelectedOrder(order)}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-2xl">
                                                                <DialogHeader>
                                                                    <DialogTitle>Order Details #{order.id.slice(-6)}</DialogTitle>
                                                                </DialogHeader>
                                                                {selectedOrder && (
                                                                    <div className="space-y-4">
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div>
                                                                                <h4 className="font-medium mb-2">Customer Information</h4>
                                                                                <p>{selectedOrder.customer?.name || "Walk-in Customer"}</p>
                                                                                {selectedOrder.tableId && (
                                                                                    <p className="text-gray-600">
                                                                                        Table {selectedOrder.tableId.split('-')[1]}
                                                                                    </p>
                                                                                )}
                                                                                <p className="text-gray-600">{selectedOrder.type}</p>
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="font-medium mb-2">Order Status</h4>
                                                                                <Badge className={statusColors[selectedOrder.status]}>
                                                                                    {selectedOrder.status}
                                                                                </Badge>
                                                                                <p className="text-gray-600 mt-1">
                                                                                    Placed at {formatTime(selectedOrder.createdAt)}
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        <div>
                                                                            <h4 className="font-medium mb-2">Order Items</h4>
                                                                            <div className="space-y-2">
                                                                                {selectedOrder.items.map((item, index) => (
                                                                                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                                                        <div>
                                                                                            <p className="font-medium">{item.menuItem.name}</p>
                                                                                            <p className="text-sm text-gray-600">
                                                                                                ${item.menuItem.price.toFixed(2)} x {item.quantity}
                                                                                            </p>
                                                                                        </div>
                                                                                        <p className="font-medium">
                                                                                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                                                                                        </p>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>

                                                                        <div className="border-t pt-4">
                                                                            <div className="flex justify-between text-lg font-bold">
                                                                                <span>Total</span>
                                                                                <span>${selectedOrder.total.toFixed(2)}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </DialogContent>
                                                        </Dialog>

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="outline" size="icon">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                {order.status === 'pending' && (
                                                                    <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'preparing')}>
                                                                        Start Preparing
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {order.status === 'preparing' && (
                                                                    <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'ready')}>
                                                                        Mark as Ready
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {order.status === 'ready' && (
                                                                    <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'served')}>
                                                                        Mark as Served
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuItem
                                                                    className="text-red-600"
                                                                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                                >
                                                                    Cancel Order
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    )
}