"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { Container } from "@/components/ui/container"
import { useState } from "react"

export default function AdminDashboard() {
  // Use client-side state instead of server functions
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Overview of your store's performance and recent activity.</p>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                    <span>+12.5% from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">128</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                    <span>+8 new this month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                    <span>-2.5% from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue for the current year</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    <Chart
                      type="bar"
                      data={[
                        { month: "Jan", revenue: 18000 },
                        { month: "Feb", revenue: 16000 },
                        { month: "Mar", revenue: 21000 },
                        { month: "Apr", revenue: 17000 },
                        { month: "May", revenue: 23000 },
                        { month: "Jun", revenue: 25000 },
                        { month: "Jul", revenue: 28000 },
                        { month: "Aug", revenue: 24000 },
                        { month: "Sep", revenue: 30000 },
                        { month: "Oct", revenue: 29000 },
                        { month: "Nov", revenue: 32000 },
                        { month: "Dec", revenue: 34000 },
                      ]}
                      options={{
                        xAxis: { dataKey: "month" },
                        datasets: [
                          {
                            dataKey: "revenue",
                            label: "Revenue",
                            backgroundColor: "hsl(var(--primary))",
                            borderRadius: 4,
                          },
                        ],
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Best selling products this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Chart
                      type="pie"
                      data={[
                        { name: "T-Shirts", value: 35 },
                        { name: "Headphones", value: 25 },
                        { name: "Sneakers", value: 15 },
                        { name: "Watches", value: 10 },
                        { name: "Other", value: 15 },
                      ]}
                      options={{
                        dataKey: "value",
                        datasets: [
                          {
                            backgroundColor: [
                              "hsl(var(--primary))",
                              "hsl(var(--primary) / 0.8)",
                              "hsl(var(--primary) / 0.6)",
                              "hsl(var(--primary) / 0.4)",
                              "hsl(var(--primary) / 0.2)",
                            ],
                          },
                        ],
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Detailed performance metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Advanced analytics content will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Generate and download custom reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Reports content will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  )
}

// Import the Chart component
import { Chart } from "@/components/ui/chart"
