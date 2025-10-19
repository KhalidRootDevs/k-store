import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import Image from "next/image";

export default function ProductAdditionalImage({
  additionalImages,
  removeImage,
  handleAdditionalImagesChange,
}: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Product Images</CardTitle>
        <CardDescription>
          Upload additional images to showcase your product from different
          angles or show product details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center gap-4">
          {additionalImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {additionalImages.map((image: any, index: number) => (
                <div
                  key={index}
                  className="relative border rounded-md aspect-square overflow-hidden bg-muted"
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Additional product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={() => removeImage(index)}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
          {additionalImages.length === 0 && (
            <div className="border-2 border-dashed rounded-lg p-12 w-full flex flex-col items-center justify-center bg-muted/50 text-muted-foreground">
              <Upload className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">
                No additional images uploaded
              </p>
              <p className="text-xs mt-1">
                Upload multiple images to showcase your product
              </p>
            </div>
          )}
          <div className="w-full">
            <Label htmlFor="images" className="mb-2 block">
              Upload Additional Images
            </Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleAdditionalImagesChange}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Recommended size: 800x800px. Max file size: 2MB per image. You can
              select multiple images at once.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
