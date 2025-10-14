import type React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

interface Category {
  _id: string;
  name: string;
  image: string;
  description: string;
  slug: string;
  featured: boolean;
  active: boolean;
}

export const metadata: Metadata = {
  title: "E-Commerce Platform",
  description: "A full-featured e-commerce platform with admin panel",
  generator: "v0.dev",
};

async function getCategoriesTree(): Promise<Category[]> {
  try {
    const response = await fetch(`${process.env.APP_URL}/api/categories/tree`, {
      next: {
        revalidate: 3600, // Revalidate every hour
        tags: ["categories"],
      },
    });

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

export default async function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categoryTree = await getCategoriesTree();

  return (
    <div className="flex flex-col min-h-screen">
      <Header categoryTree={categoryTree} />
      <main className="flex-1 py-2">{children}</main>
      <Footer />
    </div>
  );
}
