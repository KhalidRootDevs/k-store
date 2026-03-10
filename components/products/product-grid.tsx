import { ProductCard } from '@/components/product-card';
import { Product } from '@/types';

interface Category {
  id: string;
  name: string;
}

interface ProductGridProps {
  products: Product[];
  categories: Category[];
}

export function ProductGrid({ products, categories }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <div key={product.id} className="group">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
