"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Search,
  UserPlus,
  Loader2,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin" | "moderator" | "support";
  status: "active" | "inactive" | "suspended" | "pending";
  orders: Array<{
    orderId: string;
    orderNumber: string;
    date: string;
    total: number;
    status: string;
    items: number;
    paymentStatus: string;
  }>;
  notes: Array<{
    content: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  }>;
  lastLogin?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    role: "all",
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch users from API
  const fetchUsers = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.role !== "all" && { role: filters.role }),
      });

      const response = await fetch(`/api/admin/users?${params}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setPagination(
          data.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          }
        );
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchUsers(1);
  }, [searchTerm, filters.status, filters.role]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  const handleStatusUpdate = async (
    userId: string,
    currentStatus: string,
    userName: string
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: "Status updated",
          description: `User "${userName}" has been ${
            newStatus === "active" ? "activated" : "deactivated"
          }.`,
        });
        // Refresh the users list
        fetchUsers(pagination.page);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user status");
      }
    } catch (error: any) {
      console.error("Error updating user status:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      status: "all",
      role: "all",
    });
  };

  const hasActiveFilters =
    searchTerm || filters.status !== "all" || filters.role !== "all";

  // Calculate user statistics
  const calculateUserStats = (user: User) => {
    const totalOrders = user.orders?.length;
    const totalSpent = user.orders?.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const completedOrders = user.orders?.filter(
      (order) => order.status === "delivered"
    ).length;

    return {
      totalOrders,
      totalSpent,
      completedOrders,
    };
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      pagination.page - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "suspended":
        return "destructive";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "moderator":
        return "default";
      case "support":
        return "secondary";
      case "user":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Users</h2>
            <p className="text-muted-foreground">
              Manage your customer accounts and permissions.
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              View and manage all registered users in your store.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                  <div className="flex-1 max-w-sm">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        className="h-9 pl-9"
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit" size="sm" className="h-9">
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                  </Button>
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </form>
              </div>

              {/* Filter Options */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="status-filter" className="text-sm">
                    Status:
                  </label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px] h-9">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="role-filter" className="text-sm">
                    Role:
                  </label>
                  <Select
                    value={filters.role}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px] h-9">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results count */}
              <div className="text-sm text-muted-foreground">
                Showing {users.length} of {pagination.total} users
                {pagination.totalPages > 1 &&
                  ` (Page ${pagination.page} of ${pagination.totalPages})`}
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-md border">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {pagination.total === 0
                      ? "No users found."
                      : "No users match your filters."}
                  </p>
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => {
                        const stats = calculateUserStats(user);
                        const formattedDate = new Date(
                          user.createdAt
                        ).toLocaleDateString();

                        return (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                {user.avatar && (
                                  <div className="relative h-8 w-8 rounded-full overflow-hidden">
                                    <img
                                      src={user.avatar}
                                      alt={user.name}
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Joined {formattedDate}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{user.email}</span>
                                <div className="flex items-center gap-1 mt-1">
                                  {user.emailVerified && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Verified
                                    </Badge>
                                  )}
                                  {user.lastLogin && (
                                    <span className="text-xs text-muted-foreground">
                                      Last login:{" "}
                                      {new Date(
                                        user.lastLogin
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{user.phone || "N/A"}</span>
                                {user.phone && user.phoneVerified && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs mt-1"
                                  >
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getRoleVariant(user.role)}>
                                {user.role.charAt(0).toUpperCase() +
                                  user.role.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {stats.totalOrders}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {stats.completedOrders} completed
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                ${stats.totalSpent?.toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(
                                    user._id,
                                    user.status,
                                    user.name
                                  )
                                }
                                className={`h-6 px-2 text-xs capitalize ${
                                  user.status === "active"
                                    ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
                                    : user.status === "inactive"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900"
                                    : user.status === "suspended"
                                    ? "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
                                }`}
                              >
                                {user.status}
                              </Button>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/admin/users/${user._id}`}>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.totalPages}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(1)}
                          disabled={!pagination.hasPrev}
                        >
                          <ChevronsLeft className="h-4 w-4" />
                          <span className="sr-only">First page</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={!pagination.hasPrev}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Previous page</span>
                        </Button>

                        {/* Page numbers */}
                        {getPageNumbers().map((pageNum) => (
                          <Button
                            key={pageNum}
                            variant={
                              pageNum === pagination.page
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        ))}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={!pagination.hasNext}
                        >
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">Next page</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePageChange(pagination.totalPages)
                          }
                          disabled={!pagination.hasNext}
                        >
                          <ChevronsRight className="h-4 w-4" />
                          <span className="sr-only">Last page</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
