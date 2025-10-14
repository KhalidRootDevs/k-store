"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const categorySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Category name must be at least 2 characters" }),
  description: z.string().optional(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  parentId: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  featured: boolean;
  active: boolean;
  slug: string;
  parentId?: string | { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormProps {
  category?: Category | null;
  isEditing?: boolean;
  onSuccess?: () => void;
}

export function CategoryForm({
  category,
  isEditing = false,
  onSuccess,
}: CategoryFormProps) {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      featured: false,
      active: true,
      parentId: "none",
    },
  });

  const featured = watch("featured");
  const active = watch("active");
  const parentId = watch("parentId");

  const fetchParentCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories?limit=100", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const categories =
          isEditing && category
            ? data.categories.filter(
                (cat: Category) => cat._id !== category._id
              )
            : data.categories;
        setParentCategories(categories || []);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load parent categories.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchParentCategories();

    if (category && isEditing) {
      const parentIdValue = category.parentId
        ? typeof category.parentId === "string"
          ? category.parentId
          : category.parentId._id
        : "none";

      reset({
        name: category.name,
        description: category.description || "",
        featured: category.featured,
        active: category.active,
        parentId: parentIdValue,
      });
      setImage(category.image);
    }
  }, [category, isEditing, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 2MB.",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CategoryFormValues) => {
    if (!imageFile && !image) {
      toast({
        title: "Image required",
        description: "Please upload a category image.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("featured", data.featured.toString());
      formData.append("active", data.active.toString());
      formData.append("parentId", data.parentId || "none");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const url =
        isEditing && category
          ? `/api/admin/categories/${category._id}`
          : "/api/admin/categories";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();

        toast({
          title: isEditing ? "Category updated" : "Category created",
          description: `Category "${data.name}" has been ${
            isEditing ? "updated" : "created"
          } successfully.`,
        });

        if (!isEditing) {
          reset();
          setImage(null);
          setImageFile(null);
        }

        if (onSuccess) {
          onSuccess();
        }
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${isEditing ? "update" : "create"} category`
        );
      }
    } catch (error: any) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} category:`,
        error
      );
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${
            isEditing ? "update" : "create"
          } category. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = isEditing ? "Edit Category" : "Create Category";
  const pageDescription = isEditing
    ? "Update the category information."
    : "Add a new category to organize your products.";
  const submitButtonText = isEditing ? "Update Category" : "Create Category";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{pageTitle}</h2>
          <p className="text-muted-foreground">{pageDescription}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
              <CardDescription>
                Basic information about the category.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Category Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Electronics, Clothing, etc."
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentId">Parent Category</Label>
                <Select
                  value={parentId}
                  onValueChange={(value) => setValue("parentId", value)}
                  disabled={isLoadingCategories}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingCategories
                          ? "Loading categories..."
                          : "Select parent category (optional)"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top Level)</SelectItem>
                    {parentCategories
                      .filter((cat) => !cat.parentId)
                      .map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Select a parent category to create a sub-category. Leave as
                  "None" for a top-level category.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this category..."
                  rows={4}
                  {...register("description")}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="featured">Featured Category</Label>
                    <p className="text-sm text-muted-foreground">
                      Display this category prominently on the home page.
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={(checked) => setValue("featured", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="active">Active</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this category visible to customers.
                    </p>
                  </div>
                  <Switch
                    id="active"
                    checked={active}
                    onCheckedChange={(checked) => setValue("active", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Category Image</CardTitle>
              <CardDescription>
                Upload an image to represent this category.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="border rounded-md w-full aspect-square relative overflow-hidden bg-muted">
                  {image ? (
                    <Image
                      src={image || "/placeholder.svg"}
                      alt="Category preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Upload className="h-10 w-10 mb-2" />
                      <p>No image uploaded</p>
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <Label htmlFor="image" className="mb-2 block">
                    Upload Image{" "}
                    {!isEditing && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Recommended size: 800x800px. Max file size: 2MB.
                    {isEditing && " Leave empty to keep current image."}
                  </p>
                  {!imageFile && !image && !isEditing && (
                    <p className="text-sm text-red-500 mt-1">
                      Category image is required
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="outline" asChild>
              <Link href="/admin/categories">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {submitButtonText}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
