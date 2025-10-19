import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

export default function ProductSeo() {
  const { register } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Information</CardTitle>
        <CardDescription>
          Optimize your product for search engines.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="seo.title">Page Title</Label>
          <Input
            id="seo.title"
            placeholder="e.g., Premium T-Shirt - 100% Cotton"
            {...register("seo.title")}
          />
          <p className="text-sm text-muted-foreground">
            Leave blank to use product name.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="seo.description">Meta Description</Label>
          <Textarea
            id="seo.description"
            placeholder="Brief description for search results..."
            rows={3}
            {...register("seo.description")}
          />
          <p className="text-sm text-muted-foreground">
            Recommended length: 120-160 characters.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="seo.keywords">Meta Keywords</Label>
          <Input
            id="seo.keywords"
            placeholder="e.g., t-shirt, cotton, premium"
            {...register("seo.keywords")}
          />
          <p className="text-sm text-muted-foreground">
            Comma-separated keywords.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
