import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | Single Vendor",
  description: "Browse all product categories at single vendor",
};

// Mock category data
const categories = [
  {
    id: 1,
    name: "Electronics",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 42,
  },
  {
    id: 2,
    name: "Clothing",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 36,
  },
  {
    id: 3,
    name: "Home & Kitchen",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 29,
  },
  {
    id: 4,
    name: "Beauty & Personal Care",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 24,
  },
  {
    id: 5,
    name: "Sports & Outdoors",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 18,
  },
  {
    id: 6,
    name: "Books",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 31,
  },
  {
    id: 7,
    name: "Toys & Games",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 22,
  },
  {
    id: 8,
    name: "Health & Wellness",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 15,
  },
  {
    id: 9,
    name: "Automotive",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 12,
  },
  {
    id: 10,
    name: "Pet Supplies",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 19,
  },
  {
    id: 11,
    name: "Jewelry",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 14,
  },
  {
    id: 12,
    name: "Office Supplies",
    image: "/placeholder.svg?height=300&width=300",
    productCount: 17,
  },
];

export default function CategoriesPage() {
  return (
    <>
      <Container>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">All Categories</h1>
          <p className="text-muted-foreground">
            Browse our wide selection of product categories to find exactly what
            you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.name}`}
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover p-4"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.productCount} products
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
