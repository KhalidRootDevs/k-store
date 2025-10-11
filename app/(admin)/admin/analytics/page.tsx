"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Container } from "@/components/ui/container"
import { Chart } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Eye, MousePointer, Download } from "lucide-react"
import { useState } from "react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [activeTab, setActiveTab] = useState("overview")

  // Sample analytics data
  const revenueData = [
    { month: "Jan", revenue: 45000, orders: 320, customers: 180 },
    { month: "Feb", revenue: 52000, orders: 380, customers: 220 },
    { month: "Mar", revenue: 48000, orders: 350, customers: 195 },
    { month: "Apr", revenue: 61000, orders: 420, customers: 280 },
    { month: "May", revenue: 55000, orders: 390, customers: 250 },
    { month: "Jun", revenue: 67000, orders: 480, customers: 320 },
    { month: "Jul", revenue: 72000, orders: 520, customers: 350 },
    { month: "Aug", revenue: 69000, orders: 495, customers: 330 },
    { month: "Sep", revenue: 78000, orders: 580, customers: 390 },
    { month: "Oct", revenue: 82000, orders: 620, customers: 420 },
    { month: "Nov", revenue: 89000, orders: 680, customers: 460 },
    { month: "Dec", revenue: 95000, orders: 750, customers: 520 },
  ]

  const trafficData = [
    { source: "Organic Search", visitors: 12500, percentage: 45 },
    { source: "Direct", visitors: 8200, percentage: 30 },
    { source: "Social Media", visitors: 4100, percentage: 15 },
    { source: "Email", visitors: 1900, percentage: 7 },
    { source: "Paid Ads", visitors: 800, percentage: 3 },
  ]

  const conversionData = [
    { day: "Mon", visitors: 1200, conversions: 48, rate: 4.0 },
    { day: "Tue", visitors: 1350, conversions: 54, rate: 4.0 },
    { day: "Wed", visitors: 1180, conversions: 59, rate: 5.0 },
    { day: "Thu", visitors: 1420, conversions: 71, rate: 5.0 },
    { day: "Fri", visitors: 1680, conversions: 84, rate: 5.0 },
    { day: "Sat", visitors: 1950, conversions: 117, rate: 6.0 },
    { day: "Sun", visitors: 1580, conversions: 95, rate: 6.0 },
  ]

  const topProducts = [
    { name: "Wireless Headphones", sales: 1250, revenue: 156250, growth: 12.5 },
    { name: "Smart Watch", sales: 980, revenue: 245000, growth: 8.3 },
    { name: "Laptop Stand", sales: 750, revenue: 56250, growth: -2.1 },
    { name: "USB-C Cable", sales: 2100, revenue: 52500, growth: 15.7 },
    { name: "Phone Case", sales: 1680, revenue: 50400, growth: 5.2 },
  ]

  const customerSegments = [
    { segment: "New Customers", count: 1250, percentage: 35, value: 125000 },
    { segment: "Returning Customers", count: 1800, percentage: 50, value: 280000 },
    { segment: "VIP Customers", count: 350, percentage: 10, value: 175000 },
    { segment: "Inactive Customers", count: 200, percentage: 5, value: 15000 },
  ]

  const hourlyTraffic = [
    { hour: "00", visitors: 120 },
    { hour: "01", visitors: 80 },
    { hour: "02", visitors: 60 },
    { hour: "03", visitors: 45 },
    { hour: "04", visitors: 35 },
    { hour: "05", visitors: 50 },
    { hour: "06", visitors: 85 },
    { hour: "07", visitors: 150 },
    { hour: "08", visitors: 220 },
    { hour: "09", visitors: 280 },
    { hour: "10", visitors: 320 },
    { hour: "11", visitors: 380 },
    { hour: "12", visitors: 420 },
    { hour: "13", visitors: 450 },
    { hour: "14", visitors: 480 },
    { hour: "15", visitors: 520 },
    { hour: "16", visitors: 580 },
    { hour: "17", visitors: 620 },
    { hour: "18", visitors: 680 },
    { hour: "19", visitors: 720 },
    { hour: "20", visitors: 650 },
    { hour: "21", visitors: 580 },
    { hour: "22", visitors: 420 },
    { hour: "23", visitors: 280 },
  ]

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">
              Comprehensive insights into your store's performance and customer behavior.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$89,231</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    <span className="text-green-500">+12.5%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    <span className="text-green-500">+8.2%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Visitors</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24,580</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    <span className="text-green-500">+15.3%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5.1%</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                    <span className="text-red-500">-0.3%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue and Orders Chart */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over the past year</CardDescription>
                </CardHeader>
                <CardContent>
                  <Chart
                    type="line"
                    data={revenueData}
                    options={{
                      xAxis: { dataKey: "month" },
                      datasets: [
                        {
                          dataKey: "revenue",
                          label: "Revenue",
                          borderColor: "hsl(var(--primary))",
                        },
                      ],
                    }}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Daily Traffic Pattern</CardTitle>
                  <CardDescription>Hourly visitor distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <Chart
                    type="bar"
                    data={hourlyTraffic}
                    options={{
                      xAxis: { dataKey: "hour" },
                      datasets: [
                        {
                          dataKey: "visitors",
                          label: "Visitors",
                          backgroundColor: "hsl(var(--primary))",
                          borderRadius: 4,
                        },
                      ],
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Revenue, orders, and customers over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <Chart
                    type="line"
                    data={revenueData}
                    options={{
                      xAxis: { dataKey: "month" },
                      datasets: [
                        {
                          dataKey: "revenue",
                          label: "Revenue",
                          borderColor: "hsl(var(--primary))",
                        },
                        {
                          dataKey: "orders",
                          label: "Orders",
                          borderColor: "hsl(var(--chart-2))",
                        },
                      ],
                    }}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Best performing products this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.sales} sales • ${product.revenue.toLocaleString()}
                          </div>
                        </div>
                        <Badge variant={product.growth > 0 ? "default" : "destructive"}>
                          {product.growth > 0 ? "+" : ""}
                          {product.growth}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Where your visitors are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  <Chart
                    type="pie"
                    data={trafficData.map((item) => ({ name: item.source, value: item.percentage }))}
                    options={{
                      dataKey: "value",
                      datasets: [
                        {
                          backgroundColor: [
                            "hsl(var(--primary))",
                            "hsl(var(--chart-2))",
                            "hsl(var(--chart-3))",
                            "hsl(var(--chart-4))",
                            "hsl(var(--chart-5))",
                          ],
                        },
                      ],
                    }}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                  <CardDescription>Daily conversion rates and visitor patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <Chart
                    type="bar"
                    data={conversionData}
                    options={{
                      xAxis: { dataKey: "day" },
                      datasets: [
                        {
                          dataKey: "visitors",
                          label: "Visitors",
                          backgroundColor: "hsl(var(--primary) / 0.6)",
                          borderRadius: 4,
                        },
                        {
                          dataKey: "conversions",
                          label: "Conversions",
                          backgroundColor: "hsl(var(--primary))",
                          borderRadius: 4,
                        },
                      ],
                    }}
                  />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Traffic Details</CardTitle>
                <CardDescription>Detailed breakdown of traffic sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficData.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{source.source}</div>
                        <div className="text-sm text-muted-foreground">{source.visitors.toLocaleString()} visitors</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{source.percentage}%</div>
                        <div className="w-20 bg-muted rounded-full h-2 mt-1">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${source.percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Segments</CardTitle>
                  <CardDescription>Customer distribution by engagement level</CardDescription>
                </CardHeader>
                <CardContent>
                  <Chart
                    type="pie"
                    data={customerSegments.map((item) => ({ name: item.segment, value: item.percentage }))}
                    options={{
                      dataKey: "value",
                      datasets: [
                        {
                          backgroundColor: [
                            "hsl(var(--primary))",
                            "hsl(var(--chart-2))",
                            "hsl(var(--chart-3))",
                            "hsl(var(--chart-4))",
                          ],
                        },
                      ],
                    }}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Customer Growth</CardTitle>
                  <CardDescription>New vs returning customers over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <Chart
                    type="bar"
                    data={revenueData}
                    options={{
                      xAxis: { dataKey: "month" },
                      datasets: [
                        {
                          dataKey: "customers",
                          label: "New Customers",
                          backgroundColor: "hsl(var(--primary))",
                          borderRadius: 4,
                        },
                      ],
                    }}
                  />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Customer Value Analysis</CardTitle>
                <CardDescription>Revenue contribution by customer segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerSegments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{segment.segment}</div>
                        <div className="text-sm text-muted-foreground">
                          {segment.count.toLocaleString()} customers • {segment.percentage}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${segment.value.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          ${Math.round(segment.value / segment.count).toLocaleString()} avg
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}
