import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function CTABanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Background pattern"
          fill
          className="object-cover"
        />
      </div>
      <div className="relative px-8 py-16 text-center md:py-20">
        <h2 className="mb-4 text-balance text-3xl font-bold md:text-5xl">
          Ready to Upgrade Your Style?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-balance text-lg text-primary-foreground/90 md:text-xl">
          Discover thousands of products from top brands. Shop now and enjoy
          exclusive deals.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/products">
            <Button
              size="lg"
              variant="secondary"
              className="group font-semibold"
            >
              Shop All Products
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/categories">
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-primary-foreground/10 font-semibold text-primary-foreground hover:bg-primary-foreground/20"
            >
              Browse Categories
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
