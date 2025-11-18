"use client"

import { SidebarNav } from "../../components/sidebar-nav"
import { Header } from "../../components/header"
import { Footer } from "../../components/footer"
import { usePOS } from "@/context/POSContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  Clock,
  Star,
  Target,
  Calendar
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"

// Sample data for charts
const salesData = [
  { hour: '9AM', sales: 120, orders: 8 },
  { hour: '10AM', sales: 250, orders: 15 },
  { hour: '11AM', sales: 380, orders: 22 },
  { hour: '12PM', sales: 650, orders: 45 },
  { hour: '1PM', sales: 820, orders: 58 },
  { hour: '2PM', sales: 540, orders: 35 },
  { hour: '3PM', sales: 320, orders: 20 },
  { hour: '4PM', sales: 280, orders: 18 },
  { hour: '5PM', sales: 450, orders: 28 },
  { hour: '6PM', sales: 750, orders: 52 },
  { hour: '7PM', sales: 890, orders: 68 },
  { hour: '8PM', sales: 720, orders: 48 },
]

const categoryData = [
  { name: 'Burgers', value: 35, color: '#10B981' },
  { name: 'Pizzas', value: 25, color: '#3B82F6' },
  { name: 'Beverages', value: 20, color: '#F59E0B' },
  { name: 'Salads', value: 12, color: '#EF4444' },
  { name: 'Desserts', value: 8, color: '#8B5CF6' },
]

const topItems = [
  { name: 'Classic Burger', orders: 45, revenue: 1035.55 },
  { name: 'Margherita Pizza', orders: 38, revenue: 721.62 },
  { name: 'Caesar Salad', orders: 32, revenue: 575.68 },
  { name: 'Fresh Orange Juice', orders: 28, revenue: 363.72 },
  { name: 'Chocolate Cake', orders: 24, revenue: 215.76 },
]

export default function AnalyticsPage() {
  const { state } = usePOS()

  const totalRevenue = state.orders.reduce((sum, order) => 
    order.paymentStatus === 'paid' ? sum + order.total : sum, 0
  )

  const totalOrders = state.orders.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const completedOrders = state.orders.filter(order => order.status === 'served').length
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
              <p className="text-gray-600">Track performance and insights for your restaurant</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-3xl font-bold text-green-600">
                        ${totalRevenue.toFixed(2)}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        <TrendingUp className="inline h-4 w-4 mr-1" />
                        +12.5% from yesterday
                      </p>
                    </div>
                    <DollarSign className="h-12 w-12 text-green-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {totalOrders}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        <TrendingUp className="inline h-4 w-4 mr-1" />
                        +8.2% from yesterday
                      </p>
                    </div>
                    <ShoppingCart className="h-12 w-12 text-blue-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                      <p className="text-3xl font-bold text-purple-600">
                        ${avgOrderValue.toFixed(2)}
                      </p>
                      <p className="text-sm text-purple-600 mt-1">
                        <TrendingUp className="inline h-4 w-4 mr-1" />
                        +5.1% from yesterday
                      </p>
                    </div>
                    <Target className="h-12 w-12 text-purple-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                      <p className="text-3xl font-bold text-orange-600">
                        {completionRate.toFixed(1)}%
                      </p>
                      <p className="text-sm text-orange-600 mt-1">
                        <TrendingUp className="inline h-4 w-4 mr-1" />
                        +2.3% from yesterday
                      </p>
                    </div>
                    <Star className="h-12 w-12 text-orange-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Sales by Hour */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Sales by Hour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'sales' ? `$${value}` : value,
                          name === 'sales' ? 'Sales' : 'Orders'
                        ]}
                      />
                      <Bar dataKey="sales" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Sales by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {categoryData.map((category, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm text-gray-600">
                          {category.name} ({category.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Items and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Selling Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Top Selling Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-semibold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.orders} orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            ${item.revenue.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average prep time</span>
                      <span className="font-semibold">12 min</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Peak hour</span>
                      <span className="font-semibold">7:00 PM</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Customer satisfaction</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.8</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tables served</span>
                      <span className="font-semibold">24</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Repeat customers</span>
                      <span className="font-semibold">68%</span>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Today's target</span>
                        <span className="font-semibold text-green-600">$2,500</span>
                      </div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((totalRevenue / 2500) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {((totalRevenue / 2500) * 100).toFixed(1)}% of daily target
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}