import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/ui/container"

export function OfferBanner() {
  return (
    <Container>
      <div className="relative overflow-hidden rounded-lg">
        <div className="bg-muted h-[200px] md:h-[250px] relative">
          <Image src="/placeholder.svg?height=250&width=1200" alt="Special Offer" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/30 flex items-center">
            <div className="container">
              <div className="max-w-md px-2 lg:px-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Special Offer</h2>
                <p className="text-white/90 mb-4">Get 30% off on all products with code SUMMER30</p>
                <Link href="/products?discount=true">
                  <Button>Shop Discounted Items</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
