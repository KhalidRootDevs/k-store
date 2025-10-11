import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/ui/container"

export function PromotionalBanner() {
  return (
    <Container>
      <div className="relative overflow-hidden rounded-lg">
        <div className="bg-muted h-[200px] md:h-[250px] relative">
          <Image src="/placeholder.svg?height=250&width=1200" alt="Free Shipping" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/30 flex items-center">
            <div className="container">
              <div className="max-w-md ml-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Free Shipping</h2>
                <p className="text-white/90 mb-4">On all orders over $50. Limited time offer.</p>
                <Link href="/products">
                  <Button>Shop Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
