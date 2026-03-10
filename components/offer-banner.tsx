import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';

export function OfferBanner() {
  return (
    <Container>
      <div className="relative overflow-hidden rounded-lg">
        <div className="relative h-[200px] bg-muted md:h-[250px]">
          <Image
            src="/placeholder.svg?height=250&width=1200"
            alt="Special Offer"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center bg-black/30">
            <div className="container">
              <div className="max-w-md px-2 lg:px-6">
                <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
                  Special Offer
                </h2>
                <p className="mb-4 text-white/90">
                  Get 30% off on all products with code SUMMER30
                </p>
                <Link href="/products?discount=true">
                  <Button>Shop Discounted Items</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
