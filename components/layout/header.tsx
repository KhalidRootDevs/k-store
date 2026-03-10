"use client";

import type React from "react";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CartButton } from "@/components/cart-button";
import { LoginButton } from "@/components/auth/login-button";
import { WishlistDrawer } from "@/components/wishlist-drawer";
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  Loader2,
  Laptop,
  ShirtIcon,
  Home,
  Briefcase,
  Footprints,
  Sparkles,
  Dumbbell,
  BookOpen,
  Gamepad2,
  Heart,
  Car,
  Dog,
  Gem,
  FileText,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { allProducts } from "@/lib/product-data";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useOnClickOutside } from "@/hooks/use-click-outside";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

// Debounce function to limit how often a function can be called
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  Electronics: <Laptop className="h-4 w-4 mr-2" />,
  Clothing: <ShirtIcon className="h-4 w-4 mr-2" />,
  "Home & Kitchen": <Home className="h-4 w-4 mr-2" />,
  "Beauty & Personal Care": <Sparkles className="h-4 w-4 mr-2" />,
  "Sports & Outdoors": <Dumbbell className="h-4 w-4 mr-2" />,
  Books: <BookOpen className="h-4 w-4 mr-2" />,
  "Toys & Games": <Gamepad2 className="h-4 w-4 mr-2" />,
  "Health & Wellness": <Heart className="h-4 w-4 mr-2" />,
  Automotive: <Car className="h-4 w-4 mr-2" />,
  "Pet Supplies": <Dog className="h-4 w-4 mr-2" />,
  Jewelry: <Gem className="h-4 w-4 mr-2" />,
  "Office Supplies": <FileText className="h-4 w-4 mr-2" />,
  Accessories: <Briefcase className="h-4 w-4 mr-2" />,
  Footwear: <Footprints className="h-4 w-4 mr-2" />,
};

// Mock category data for the mega menu
const categoryGroups = [
  {
    title: "Shop by Category",
    items: [
      { name: "Electronics", href: "/products?category=Electronics" },
      { name: "Clothing", href: "/products?category=Clothing" },
      { name: "Home & Kitchen", href: "/products?category=Home & Kitchen" },
      {
        name: "Beauty & Personal Care",
        href: "/products?category=Beauty & Personal Care",
      },
      {
        name: "Sports & Outdoors",
        href: "/products?category=Sports & Outdoors",
      },
      { name: "Books", href: "/products?category=Books" },
    ],
  },
  {
    title: "More Categories",
    items: [
      { name: "Toys & Games", href: "/products?category=Toys & Games" },
      {
        name: "Health & Wellness",
        href: "/products?category=Health & Wellness",
      },
      { name: "Automotive", href: "/products?category=Automotive" },
      { name: "Pet Supplies", href: "/products?category=Pet Supplies" },
      { name: "Jewelry", href: "/products?category=Jewelry" },
      { name: "Office Supplies", href: "/products?category=Office Supplies" },
    ],
  },
  {
    title: "Featured Collections",
    items: [
      { name: "New Arrivals", href: "/products?sort=newest" },
      { name: "Best Sellers", href: "/products?sort=best-selling" },
      { name: "Top Rated", href: "/products?sort=rating" },
      { name: "Sale Items", href: "/products?discount=true" },
      { name: "Clearance", href: "/products?clearance=true" },
      { name: "Gift Ideas", href: "/products?gift=true" },
    ],
  },
];

// Featured categories with images for the mega menu
const featuredCategories = [
  {
    name: "Electronics",
    description: "Latest gadgets and tech",
    href: "/products?category=Electronics",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Fashion",
    description: "Trendy styles for everyone",
    href: "/products?category=Clothing",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Home",
    description: "Make your space beautiful",
    href: "/products?category=Home & Kitchen",
    image: "/placeholder.svg?height=100&width=100",
  },
];

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof allProducts>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useOnClickOutside(searchRef, () => setShowResults(false));

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter products based on search query
  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsSearching(true);
      // Simulate API call with setTimeout
      const timeoutId = setTimeout(() => {
        const filtered = allProducts.filter((product) =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()),
        );
        setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
        setIsSearching(false);
        setShowResults(true);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [debouncedSearchQuery]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setShowResults(false);
    }
  };

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <Container>
        <div className="flex h-16 items-center justify-between relative">
          {/* Logo section - always visible */}
          <div className="flex items-center z-20">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex items-center mb-6">
                  <ShoppingBag className="h-6 w-6 mr-2" />
                  <span className="font-bold text-xl">Single Vendor</span>
                </div>

                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-lg font-medium transition-colors hover:text-primary ${
                        isActive(item.href)
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className="py-2">
                    <p className="text-lg font-medium mb-2">Categories</p>
                    <div className="grid grid-cols-1 gap-2 pl-2">
                      {categoryGroups
                        .flatMap((group) => group.items)
                        .slice(0, 8)
                        .map((category) => (
                          <Link
                            key={category.name}
                            href={category.href}
                            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                          >
                            {categoryIcons[category.name] || (
                              <ShirtIcon className="h-4 w-4 mr-2" />
                            )}
                            {category.name}
                          </Link>
                        ))}
                      <Link
                        href="/categories"
                        className="text-sm font-medium text-primary hover:underline mt-2"
                      >
                        View all categories
                      </Link>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center">
              <ShoppingBag className="h-6 w-6 mr-2" />
              <span className="font-bold text-xl hidden sm:inline-block">
                Single Vendor
              </span>
            </Link>
          </div>

          {/* Navigation Menu - hidden when search is open */}
          <div
            className={cn(
              "absolute left-0 right-0 mx-auto flex justify-center transition-opacity duration-200",
              isSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100",
            )}
          >
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive("/")
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={
                      isActive("/categories")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="overflow-hidden">
                    {/* Responsive mega menu - adjust columns based on screen size */}
                    <div className="w-[calc(100vw-2rem)] max-w-screen-lg mx-auto">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 max-h-[80vh] overflow-y-auto">
                        <div className="col-span-1">
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Shop by Category
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {categoryGroups[0].items.map((category) => (
                              <Link
                                key={category.name}
                                href={category.href}
                                className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors py-1 px-2 rounded-md hover:bg-muted"
                              >
                                {categoryIcons[category.name] || (
                                  <ShirtIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                                )}
                                <span className="truncate">
                                  {category.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div className="col-span-1">
                          <div className="mb-2 mt-4 text-lg font-medium">
                            More Categories
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {categoryGroups[1].items.map((category) => (
                              <Link
                                key={category.name}
                                href={category.href}
                                className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors py-1 px-2 rounded-md hover:bg-muted"
                              >
                                {categoryIcons[category.name] || (
                                  <ShirtIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                                )}
                                <span className="truncate">
                                  {category.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div className="col-span-1">
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Featured Collections
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {categoryGroups[2].items.map((category) => (
                              <Link
                                key={category.name}
                                href={category.href}
                                className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors py-1 px-2 rounded-md hover:bg-muted"
                              >
                                <span className="truncate">
                                  {category.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Featured section - hide on smaller screens */}
                        <div className="col-span-1 bg-muted rounded-lg p-4 hidden lg:block">
                          <div className="mb-2 text-lg font-medium">
                            Featured
                          </div>
                          <div className="space-y-3">
                            {featuredCategories.map((category) => (
                              <Link
                                key={category.name}
                                href={category.href}
                                className="block group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                      src={category.image || "/placeholder.svg"}
                                      alt={category.name}
                                      fill
                                      className="object-cover transition-transform group-hover:scale-105"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium group-hover:text-primary transition-colors truncate">
                                      {category.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                      {category.description}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                            <Link
                              href="/categories"
                              className="text-sm font-medium text-primary hover:underline block mt-4"
                            >
                              View all categories →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/products" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive("/products")
                          ? "text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      Products
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={
                      isActive("/deals")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    Deals
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {/* Responsive deals dropdown */}
                    <div className="w-[calc(100vw-2rem)] max-w-md mx-auto">
                      <div className="grid gap-3 p-6">
                        <div className="grid grid-cols-1 gap-2">
                          <Link
                            href="/products?discount=true"
                            className="flex items-center gap-2 p-2 hover:bg-muted rounded-md transition-colors"
                          >
                            <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                              <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium">Sale Items</div>
                              <div className="text-xs text-muted-foreground">
                                Products with special discounts
                              </div>
                            </div>
                          </Link>
                          <Link
                            href="/products?sort=best-selling"
                            className="flex items-center gap-2 p-2 hover:bg-muted rounded-md transition-colors"
                          >
                            <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                              <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium">Best Sellers</div>
                              <div className="text-xs text-muted-foreground">
                                Our most popular products
                              </div>
                            </div>
                          </Link>
                          <Link
                            href="/products?clearance=true"
                            className="flex items-center gap-2 p-2 hover:bg-muted rounded-md transition-colors"
                          >
                            <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                              <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium">Clearance</div>
                              <div className="text-xs text-muted-foreground">
                                Last chance to buy
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search bar - centered and full width when open */}
          <div
            className={cn(
              "absolute left-0 right-0 mx-auto flex justify-center transition-opacity duration-200 z-10",
              isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <div
              ref={searchRef}
              className="w-full max-w-3xl px-4 mx-auto"
              style={{ width: "calc(100% - 320px)" }}
            >
              <form
                className="relative flex items-center max-w-xl"
                onSubmit={handleSearchSubmit}
              >
                <Input
                  type="search"
                  name="search"
                  placeholder="Search products..."
                  className="w-full"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      setShowResults(false);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                    setShowResults(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </form>

              {/* Search Results Dropdown */}
              {showResults && (searchResults.length > 0 || isSearching) && (
                <Card className="absolute top-full left-0 right-0 mt-1 p-2 max-h-[400px] overflow-auto z-50">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <>
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                          onClick={() => handleProductClick(product.id)}
                        >
                          <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {product.category}
                            </p>
                          </div>
                          <div className="text-sm font-medium">
                            $
                            {product.discount
                              ? (
                                  product.price *
                                  (1 - product.discount / 100)
                                ).toFixed(2)
                              : product.price.toFixed(2)}
                          </div>
                        </div>
                      ))}
                      <div className="mt-2 pt-2 border-t text-center">
                        <Button
                          variant="link"
                          className="text-xs"
                          onClick={() => {
                            router.push(
                              `/products?q=${encodeURIComponent(
                                searchQuery.trim(),
                              )}`,
                            );
                            setIsSearchOpen(false);
                            setSearchQuery("");
                            setShowResults(false);
                          }}
                        >
                          View all results
                        </Button>
                      </div>
                    </>
                  )}
                </Card>
              )}
            </div>
          </div>

          {/* Action buttons - always visible */}

          <div className="flex items-center gap-2 z-20">
            {isSearchOpen ? null : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                {isSearchOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {isSearchOpen ? "Close search" : "Search"}
                </span>
              </Button>
            )}
            <WishlistDrawer />
            <CartButton />
            <LoginButton />
          </div>
        </div>
      </Container>
    </header>
  );
}
