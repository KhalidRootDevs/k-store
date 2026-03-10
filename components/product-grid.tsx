import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

async function getProducts(
  type: 'featured' | 'best-selling' | 'top-rated' | 'new-arrivals'
): Promise<Product[]> {
  try {
    const response = await fetch(
      `${process.env.APP_URL}/api/products?type=${type}&limit=8`,
      {
        next: {
          revalidate: 3600, // Revalidate every hour
          tags: ['products']
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error(`Error fetching ${type} products:`, error);
    return [];
  }
}

// Fallback mock data in case API fails
const fallbackProducts = {
  featured: [
    {
      _id: '1',
      name: 'Premium T-Shirt',
      description: 'High-quality cotton t-shirt',
      price: 29.99,
      compareAtPrice: 39.99,
      images: ['/placeholder.svg?height=400&width=400'],
      categoryId: { _id: '1', name: 'Clothing', slug: 'clothing' },
      featured: true,
      rating: 4.5,
      reviewCount: 24,
      salesCount: 150,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Wireless Headphones',
      description: 'Noise-cancelling wireless headphones',
      price: 129.99,
      compareAtPrice: 159.99,
      images: ['/placeholder.svg?height=400&width=400'],
      categoryId: { _id: '2', name: 'Electronics', slug: 'electronics' },
      featured: true,
      rating: 4.8,
      reviewCount: 89,
      salesCount: 320,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '3',
      name: 'Leather Wallet',
      description: 'Genuine leather wallet',
      price: 49.99,
      compareAtPrice: 69.99,
      images: ['/placeholder.svg?height=400&width=400'],
      categoryId: { _id: '3', name: 'Accessories', slug: 'accessories' },
      featured: true,
      rating: 4.3,
      reviewCount: 42,
      salesCount: 180,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '4',
      name: 'Smart Watch',
      description: 'Advanced smartwatch with health tracking',
      price: 199.99,
      compareAtPrice: 249.99,
      images: ['/placeholder.svg?height=400&width=400'],
      categoryId: { _id: '2', name: 'Electronics', slug: 'electronics' },
      featured: true,
      rating: 4.7,
      reviewCount: 156,
      salesCount: 420,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  'best-selling': [
    {
      _id: '5',
      name: 'Running Shoes',
      description: 'Lightweight running shoes',
      price: 89.99,
      compareAtPrice: 119.99,
      images: ['/placeholder.svg?height=400&width=400'],
      categoryId: { _id: '4', name: 'Footwear', slug: 'footwear' },
      featured: true,
      rating: 4.6,
      reviewCount: 203,
      salesCount: 890,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '6',
      name: 'Bluetooth Speaker',
      description: 'Portable Bluetooth speaker',
      price: 79.99,
      compareAtPrice: 99.99,
      images: ['/placeholder.svg?height=400&width=400'],
      categoryId: { _id: '2', name: 'Electronics', slug: 'electronics' },
      featured: true,
      rating: 4.4,
      reviewCount: 167,
      salesCount: 540,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '7',
      name: 'Backpack',
      description: 'Durable travel backpack',
      price: 59.99,
      compareAtPrice: 79.99,
      images: ['/placeholder.svg?height=400&width=400'],
      categoryId: { _id: '3', name: 'Accessories', slug: 'accessories' },
      featured: true,
      rating: 4.5,
      reviewCount: 98,
      salesCount: 320,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '8',
      name: 'Sunglasses',
      description: 'UV protection sunglasses',
      price: 39.99,
      compareAtPrice: 59.99,
      images: ['/placeholder.svg?height=400&width=400'],
      categoryId: { _id: '3', name: 'Accessories', slug: 'accessories' },
      featured: true,
      rating: 4.2,
      reviewCount: 76,
      salesCount: 210,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  'top-rated': [
    {
      _id: '9',
      name: 'Coffee Maker',
      description: 'Programmable coffee maker',
      price: 149.99,
      compareAtPrice: 199.99,
      images: ['/placeholder.svg?height=400&width=400'],
      categoryId: { _id: '5', name: 'Home', slug: 'home' },
      featured: true,
      rating: 4.9,
      reviewCount: 234,
      salesCount: 670,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '10',
      name: 'Yoga Mat',
      description: 'Non-slip yoga mat',
      price: 29.99,
      compareAtPrice: 39.99,
      images: ['/placeholder.svg?height=400&width=400'],
      categoryId: { _id: '6', name: 'Fitness', slug: 'fitness' },
      featured: true,
      rating: 4.8,
      reviewCount: 189,
      salesCount: 450,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '11',
      name: 'Water Bottle',
      description: 'Insulated water bottle',
      price: 19.99,
      compareAtPrice: 29.99,
      images: ['/placeholder.svg?height=400&width=400'],
      categoryId: { _id: '6', name: 'Fitness', slug: 'fitness' },
      featured: true,
      rating: 4.7,
      reviewCount: 156,
      salesCount: 780,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '12',
      name: 'Desk Lamp',
      description: 'LED desk lamp',
      price: 49.99,
      compareAtPrice: 69.99,
      images: ['/placeholder.svg?height=400&width=400'],
      categoryId: { _id: '5', name: 'Home', slug: 'home' },
      featured: true,
      rating: 4.6,
      reviewCount: 134,
      salesCount: 290,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

export async function ProductGrid({
  type
}: {
  type: 'featured' | 'best-selling' | 'top-rated' | 'new-arrivals';
}) {
  const products = await getProducts(type);
  const displayProducts =
    products.length > 0 ? products : fallbackProducts[type] || [];

  const calculateDiscount = (price: number, compareAtPrice?: number) => {
    if (!compareAtPrice || compareAtPrice <= price) return 0;
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  };

  const isNewProduct = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return createdDate > thirtyDaysAgo;
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {displayProducts.map((product) => {
        const discount = calculateDiscount(
          product.price,
          product.compareAtPrice
        );
        const isNew = isNewProduct(product.createdAt);

        return (
          <Link key={product._id} href={`/products/${product._id}`}>
            <Card className="group h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={product.images[0] || '/placeholder.svg'}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute right-2 top-2 flex flex-col gap-1">
                  {discount > 0 && (
                    <Badge className="bg-red-500 hover:bg-red-600">
                      {discount}% OFF
                    </Badge>
                  )}
                  {isNew && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      New
                    </Badge>
                  )}
                </div>
                {product.rating >= 4.5 && (
                  <Badge className="absolute left-2 top-2 bg-amber-500 hover:bg-amber-600">
                    ⭐ {product.rating}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="mb-1 line-clamp-1 text-lg font-semibold">
                  {product.name}
                </h3>
                <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{product.categoryId?.name}</span>
                  <span>•</span>
                  <span>⭐ {product.rating}</span>
                  <span>•</span>
                  <span>({product.reviewCount})</span>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4 pt-0">
                <div className="flex items-center gap-2">
                  {discount > 0 ? (
                    <>
                      <span className="text-lg font-bold text-green-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.compareAtPrice?.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                {product.salesCount > 100 && (
                  <Badge variant="outline" className="text-xs">
                    🔥 Popular
                  </Badge>
                )}
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
