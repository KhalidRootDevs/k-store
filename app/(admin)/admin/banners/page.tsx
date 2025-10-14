"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Edit, Plus, Trash2, ArrowUp, ArrowDown, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock banner data
const initialBanners = [
  {
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
  {
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
  {
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
  {
    id: 4,
    title: "Clearance Sale",
    description: "Up to 70% off on selected items",
    image: "/placeholder.svg?height=600&width=1200",
    link: "/products?tag=clearance",
    buttonText: "Shop Sale",
    active: false,
    order: 4,
    startDate: "2023-08-15",
    endDate: "2023-09-15",
  },
]

export default function BannersPage() {
  const [banners, setBanners] = useState(initialBanners)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState<number | null>(null)

  const handleToggleActive = (id: number) => {
    setBanners(banners.map((banner) => (banner.id === id ? { ...banner, active: !banner.active } : banner)))

    toast({
      title: "Banner updated",
      description: "Banner visibility has been updated.",
    })
  }

  const handleMoveUp = (id: number) => {
    const index = banners.findIndex((banner) => banner.id === id)
    if (index <= 0) return

    const newBanners = [...banners]
    const temp = newBanners[index].order
    newBanners[index].order = newBanners[index - 1].order
    newBanners[index - 1].order = temp

    setBanners([...newBanners].sort((a, b) => a.order - b.order))

    toast({
      title: "Banner order updated",
      description: "Banner has been moved up in the display order.",
    })
  }

  const handleMoveDown = (id: number) => {
    const index = banners.findIndex((banner) => banner.id === id)
    if (index >= banners.length - 1) return

    const newBanners = [...banners]
    const temp = newBanners[index].order
    newBanners[index].order = newBanners[index + 1].order
    newBanners[index + 1].order = temp

    setBanners([...newBanners].sort((a, b) => a.order - b.order))

    toast({
      title: "Banner order updated",
      description: "Banner has been moved down in the display order.",
    })
  }

  const handleDeleteClick = (id: number) => {
    setBannerToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (bannerToDelete) {
      setBanners(banners.filter((banner) => banner.id !== bannerToDelete))

      toast({
        title: "Banner deleted",
        description: "The banner has been permanently deleted.",
      })

      setDeleteDialogOpen(false)
      setBannerToDelete(null)
    }
  }

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Banners</h2>
            <p className="text-muted-foreground">Manage promotional banners displayed on your store.</p>
          </div>
          <Link href="/admin/banners/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Banner Management</CardTitle>
            <CardDescription>
              Control which banners are displayed on your store and their order. Drag to reorder.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="hidden md:table-cell">Link</TableHead>
                    <TableHead className="hidden md:table-cell">Dates</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="relative h-16 w-28 rounded-md overflow-hidden">
                          <Image
                            src={banner.image || "/placeholder.svg"}
                            alt={banner.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{banner.title}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                        {banner.description}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">{banner.link}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm">
                          <div>{banner.startDate}</div>
                          <div>to</div>
                          <div>{banner.endDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch checked={banner.active} onCheckedChange={() => handleToggleActive(banner.id)} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleMoveUp(banner.id)}
                            disabled={banner.order === 1}
                          >
                            <ArrowUp className="h-4 w-4" />
                            <span className="sr-only">Move up</span>
                          </Button>
                          <span className="w-4 text-center">{banner.order}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleMoveDown(banner.id)}
                            disabled={banner.order === banners.length}
                          >
                            <ArrowDown className="h-4 w-4" />
                            <span className="sr-only">Move down</span>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/banners/${banner.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <Link href={`/admin/banners/preview/${banner.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Preview</span>
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeleteClick(banner.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the banner. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  )
}
