"use client";

import type React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

import {
  BarChart3,
  Box,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Users,
  FileText,
  MessageSquare,
  DollarSign,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";

// 🧭 Sidebar configuration (single source of truth)
const sidebarConfig = [
  {
    label: "Dashboard",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "Store Management",
    items: [
      {
        title: "Products",
        href: "/admin/products",
        icon: Package,
      },
      {
        title: "Categories",
        href: "/admin/categories",
        icon: Box,
      },
      {
        title: "Users",
        href: "/admin/users",
        icon: Users,
      },
    ],
  },

  {
    label: "Order Management",
    items: [
      {
        title: "Orders",
        href: "/admin/orders",
        icon: ShoppingBag,
      },
      {
        title: "Payments",
        href: "/admin/payments",
        icon: DollarSign,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        title: "Contact Submissions",
        href: "/admin/contact-submissions",
        icon: MessageSquare,
      },
      {
        title: "Banners",
        href: "/admin/banners",
        icon: LayoutDashboard,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  // Check if user has admin role
  const isAdmin =
    user?.role === "admin" ||
    user?.role === "moderator" ||
    user?.role === "support";

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto" />
          <p className="text-slate-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect logic
  useEffect(() => {
    if (!isLoading) {
      // If no user is logged in, redirect to home
      if (!user) {
        router.push("/");
        return;
      }

      // If user is logged in but doesn't have admin role, redirect to home
      if (user && !isAdmin) {
        router.push("/");
        return;
      }
    }
  }, [user, isLoading, isAdmin, router]);

  console.log("user", user);

  // Don't render anything if no user or not admin
  if (!user || !isAdmin) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <ShoppingBag className="h-6 w-6" />
              <span className="font-bold text-xl">Single Vendor</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            {sidebarConfig.map((group) => (
              <SidebarGroup key={group.label}>
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");

                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild isActive={isActive}>
                            <Link href={item.href}>
                              <Icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter>
            <div className="px-3 py-2">
              <div className="flex items-center gap-3 rounded-md border px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Users className="h-4 w-4" />
                </div>
                <div className="flex-1 truncate">
                  <div className="text-sm font-medium">Admin User</div>
                  <div className="text-xs text-muted-foreground truncate">
                    admin@example.com
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Log out</span>
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <div className="flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 sm:px-6 lg:px-8">
            <SidebarTrigger />
            <Container className="flex-1 flex items-center justify-between">
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
              <div className="flex items-center gap-4">
                <Link href="/" target="_blank">
                  <Button variant="outline" size="sm">
                    <Home className="h-4 w-4 mr-2" />
                    View Store
                  </Button>
                </Link>
              </div>
            </Container>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
