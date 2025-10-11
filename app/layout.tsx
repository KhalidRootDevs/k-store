import type React from "react"
import { CartProvider } from "@/context/cart-context"
import { AuthProvider } from "@/context/auth-context"
import { ModalProvider } from "@/context/modal-context"
import { WishlistProvider } from "@/context/wishlist-context"
import { RecentlyViewedProvider } from "@/context/recently-viewed-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { LoginModal } from "@/components/auth/login-modal"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E-Commerce Platform",
  description: "A full-featured e-commerce platform with admin panel",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ModalProvider>
              <WishlistProvider>
                <RecentlyViewedProvider>
                  <CartProvider>
                    {children}
                    <LoginModal />
                    <Toaster />
                  </CartProvider>
                </RecentlyViewedProvider>
              </WishlistProvider>
            </ModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
