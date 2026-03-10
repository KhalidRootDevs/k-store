import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

export default function ProductAdditionalImage({
  additionalImages,
  removeImage,
  handleAdditionalImagesChange
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
            <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {additionalImages.map((image: any, index: number) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-md border bg-muted"
                >
                  <Image
                    src={image || '/placeholder.svg'}
                    alt={`Additional product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8 rounded-full"
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
            <div className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-12 text-muted-foreground">
              <Upload className="mb-2 h-10 w-10" />
              <p className="text-sm font-medium">
                No additional images uploaded
              </p>
              <p className="mt-1 text-xs">
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
            <p className="mt-2 text-sm text-muted-foreground">
              Recommended size: 800x800px. Max file size: 2MB per image. You can
              select multiple images at once.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
