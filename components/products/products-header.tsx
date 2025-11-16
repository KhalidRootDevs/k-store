"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { CartButton } from "@/components/cart-button";
import { LoginButton } from "@/components/auth/login-button";
import { useAuth } from "@/context/auth-context";
import { Container } from "@/components/ui/container";

export function ProductsHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
          <ShoppingBag className="h-6 w-6" />
          <span>OneVendor</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm font-medium hover:underline"
          >
            Products
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium hover:underline"
          >
            Categories
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <CartButton />
          <LoginButton />
        </div>
      </Container>
    </header>
  );
}
