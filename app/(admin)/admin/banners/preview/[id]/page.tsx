"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Container } from "@/components/ui/container"

// Mock banner data
const bannersData = {
  "1": {
    id: 1,
    title: "Summer Collection",
    description: "Discover our new summer collection with up to 50% off",
    image: "/placeholder.svg?height=600&width=1200",
    link: "/products?category=summer",
    buttonText: "Shop Now",
    active: true,
    order: 1,
    startDate: "2023-06-01",
    endDate: "2023-08-31",
  },
  "2": {
    id: 2,
    title: "New Arrivals",
    description: "Check out our latest products just for you",
    image: "/placeholder.svg?height=600&width=1200",
    link: "/products?tag=new",
    buttonText: "Explore",
    active: true,
    order: 2,
    startDate: "2023-05-15",
    endDate: "2023-12-31",
  },
  "3": {
    id: 3,
    title: "Limited Offers",
    description: "Special deals for a limited time only",
    image: "/placeholder.svg?height=600&width=1200",
    link: "/products?tag=limited",
    buttonText: "View Offers",
    active: false,
    order: 3,
    startDate: "2023-07-01",
    endDate: "2023-07-15",
  },
}

export default function BannerPreviewPage() {
  const params = useParams()
  const bannerId = params.id as string
  const banner = bannersData[bannerId]

  if (!banner) {
    return (
      <Container>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/banners">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Banner Not Found</h2>
            <p className="text-muted-foreground">The requested banner does not exist.</p>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/banners">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Banner Preview</h2>
              <p className="text-muted-foreground">Preview how your banner will appear on the site.</p>
            </div>
          </div>
          <Link href={`/admin/banners/${banner.id}`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Banner
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-md bg-muted/50">
            <h3 className="text-sm font-medium mb-2">Desktop View</h3>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image src={banner.image || "/placeholder.svg"} alt={banner.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center">
                <div className="container">
                  <div className="max-w-md ml-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{banner.title}</h2>
                    <p className="text-white/90 mb-6 text-lg">{banner.description}</p>
                    <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium">
                      {banner.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-md bg-muted/50">
            <h3 className="text-sm font-medium mb-2">Mobile View</h3>
            <div className="relative h-[500px] max-w-[375px] mx-auto rounded-lg overflow-hidden">
              <Image src={banner.image || "/placeholder.svg"} alt={banner.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center">
                <div className="container px-4">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-3">{banner.title}</h2>
                    <p className="text-white/90 mb-4 text-sm">{banner.description}</p>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
                      {banner.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-md bg-muted/50">
            <h3 className="text-sm font-medium mb-2">Banner Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Status:</p>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    banner.active ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {banner.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <p className="font-medium">Display Order:</p>
                <p>{banner.order}</p>
              </div>
              <div>
                <p className="font-medium">Start Date:</p>
                <p>{banner.startDate}</p>
              </div>
              <div>
                <p className="font-medium">End Date:</p>
                <p>{banner.endDate}</p>
              </div>
              <div>
                <p className="font-medium">Link URL:</p>
                <p className="truncate">{banner.link}</p>
              </div>
              <div>
                <p className="font-medium">Button Text:</p>
                <p>{banner.buttonText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
