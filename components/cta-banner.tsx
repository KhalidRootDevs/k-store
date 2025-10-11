import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
      <div className="relative px-8 py-16 md:py-20 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
          Ready to Upgrade Your Style?
        </h2>
        <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto text-balance">
          Discover thousands of products from top brands. Shop now and enjoy
          exclusive deals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button
              size="lg"
              variant="secondary"
              className="font-semibold group"
            >
              Shop All Products
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/categories">
            <Button
              size="lg"
              variant="outline"
              className="font-semibold bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
            >
              Browse Categories
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
