// components/top-categories.tsx
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface Category {
  _id: string;
  name: string;
  image: string;
  description: string;
  slug: string;
  featured: boolean;
  active: boolean;
}

async function getTopCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/categories?topCategories=true&limit=6`,
      {
        next: {
          revalidate: 3600, // Revalidate every hour
          tags: ["categories"],
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("Error fetching top categories:", error);
    return [];
  }
}

export async function TopCategories() {
  const categories = await getTopCategories();

  // Fallback to default categories if API fails or returns empty
  const displayCategories =
    categories.length > 0
      ? categories
      : [
          {
            _id: "clothing",
            name: "Clothing",
            image: "/placeholder.svg?height=300&width=300",
            description: "Stylish apparel for every occasion",
            slug: "clothing",
            featured: true,
            active: true,
          },
          {
            _id: "electronics",
            name: "Electronics",
            image: "/placeholder.svg?height=300&width=300",
            description: "Latest gadgets and tech accessories",
            slug: "electronics",
            featured: true,
            active: true,
          },
          {
            _id: "home",
            name: "Home & Kitchen",
            image: "/placeholder.svg?height=300&width=300",
            description: "Everything for your living space",
            slug: "home-kitchen",
            featured: true,
            active: true,
          },
          {
            _id: "accessories",
            name: "Accessories",
            image: "/placeholder.svg?height=300&width=300",
            description: "Complete your look with our accessories",
            slug: "accessories",
            featured: true,
            active: true,
          },
          {
            _id: "footwear",
            name: "Footwear",
            image: "/placeholder.svg?height=300&width=300",
            description: "Comfortable and stylish shoes",
            slug: "footwear",
            featured: true,
            active: true,
          },
          {
            _id: "beauty",
            name: "Beauty",
            image: "/placeholder.svg?height=300&width=300",
            description: "Skincare, makeup and personal care",
            slug: "beauty",
            featured: true,
            active: true,
          },
        ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {displayCategories.map((category) => (
        <Link
          key={category._id}
          href={`/products?categories=${category.slug}`}
          className="block transition-transform hover:scale-105"
        >
          <Card className="overflow-hidden h-full border-none shadow-md">
            <div className="relative aspect-square">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="font-bold text-white text-lg">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm line-clamp-2 mt-1">
                  {category.description}
                </p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
