import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';

export function PromotionalBanner() {
  return (
    <Container>
      <div className="relative overflow-hidden rounded-lg">
        <div className="relative h-[200px] bg-muted md:h-[250px]">
          <Image
            src="/placeholder.svg?height=250&width=1200"
            alt="Free Shipping"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center bg-black/30">
            <div className="container">
              <div className="ml-auto max-w-md">
                <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
                  Free Shipping
                </h2>
                <p className="mb-4 text-white/90">
                  On all orders over $50. Limited time offer.
                </p>
                <Link href="/products">
                  <Button>Shop Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
