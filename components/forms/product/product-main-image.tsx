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
import { toast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

export default function ProductMainImage({
  mainImage,
  setMainImage,
  setAvailableImages,
  setImageFiles
}: {
  mainImage: string;
  setMainImage: (s: string) => void;
  setAvailableImages: any;
  setImageFiles: any;
}) {
  const removeMainImage = () => {
    setMainImage('');
    setAvailableImages((prev: any) => prev.slice(1));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file.',
          variant: 'destructive'
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 2MB.',
          variant: 'destructive'
        });
        return;
      }

      setImageFiles((prev: any) => [...prev, file]);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setMainImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Main Product Image</CardTitle>
        <CardDescription>
          Upload the primary image for your product. This will be the featured
          image displayed in listings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mainImage ? (
          <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-lg border bg-muted">
            <Image
              src={mainImage || '/placeholder.svg'}
              alt="Main product image"
              fill
              className="object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 rounded-full"
              onClick={removeMainImage}
              type="button"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove main image</span>
            </Button>
          </div>
        ) : (
          <div className="mx-auto flex aspect-square max-w-md flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-muted-foreground">
            <Upload className="mb-3 h-12 w-12" />
            <p className="text-sm font-medium">No main image uploaded</p>
            <p className="mt-1 text-xs">Upload your primary product image</p>
          </div>
        )}
        <div className="mx-auto max-w-md">
          <Label htmlFor="mainImage" className="mb-2 block">
            {mainImage ? 'Replace Main Image' : 'Upload Main Image'}
          </Label>
          <Input
            id="mainImage"
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Recommended size: 1000x1000px. Max file size: 2MB.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
