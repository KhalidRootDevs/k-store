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
import { Checkbox } from "@/components/ui/checkbox";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const productSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Product name must be at least 2 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  cost: z.coerce.number().positive().optional().nullable(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  categoryId: z.string({ required_error: "Please select a category" }),
  tags: z.array(z.string()).optional(),
  stock: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Stock must be a non-negative integer" }),
  weight: z.coerce.number().positive().optional().nullable(),
  length: z.coerce.number().positive().optional().nullable(),
  width: z.coerce.number().positive().optional().nullable(),
  height: z.coerce.number().positive().optional().nullable(),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  variants: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Variant name is required" }),
        options: z.string().min(1, { message: "Options are required" }),
        price: z.coerce.number().positive().optional(),
        stock: z.coerce.number().int().nonnegative().optional(),
        sku: z.string().optional(),
      })
    )
    .optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.string().optional(),
    })
    .optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  categoryId: string | Category;
  tags: string[];
  stock: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  active: boolean;
  featured: boolean;
  variants: Array<{
    name: string;
    options: string;
    price?: number;
    stock?: number;
    sku?: string;
  }>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductFormProps {
  product?: Product | null;
  isEditing?: boolean;
  onSuccess?: () => void;
}

// Mock tags for the checkboxes
const tags = [
  { id: "featured", label: "Featured" },
  { id: "best-selling", label: "Best Selling" },
  { id: "new-arrival", label: "New Arrival" },
  { id: "top-rated", label: "Top Rated" },
  { id: "sale", label: "Sale" },
];

export function ProductForm({
  product,
  isEditing = false,
  onSuccess,
}: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      compareAtPrice: undefined,
      cost: undefined,
      sku: "",
      barcode: "",
      categoryId: "",
      tags: [],
      stock: 0,
      weight: undefined,
      length: undefined,
      width: undefined,
      height: undefined,
      active: true,
      featured: false,
      variants: [],
      seo: {
        title: "",
        description: "",
        keywords: "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories?limit=100", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Initialize form with product data when editing
  useEffect(() => {
    fetchCategories();

    if (product && isEditing) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice || undefined,
        cost: product.cost || undefined,
        sku: product.sku,
        barcode: product.barcode || "",
        categoryId:
          typeof product.categoryId === "string"
            ? product.categoryId
            : product.categoryId._id,
        tags: product.tags || [],
        stock: product.stock,
        weight: product.weight || undefined,
        length: product.length || undefined,
        width: product.width || undefined,
        height: product.height || undefined,
        active: product.active,
        featured: product.featured,
        variants: product.variants || [],
        seo: product.seo || {
          title: "",
          description: "",
          keywords: "",
        },
      });

      // Set images
      if (product.images && product.images.length > 0) {
        setMainImage(product.images[0]);
        setAdditionalImages(product.images.slice(1));
      }
    }
  }, [product, isEditing, reset]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
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

      setImageFiles((prev) => [...prev, file]);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setMainImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      const newFiles: File[] = [];

      Array.from(files).forEach((file) => {
        // Validate file type and size
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: "Please upload image files only.",
            variant: "destructive",
          });
          return;
        }

        if (file.size > 2 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please upload images smaller than 2MB.",
            variant: "destructive",
          });
          return;
        }

        newFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === files.length) {
              setAdditionalImages((prev) => [...prev, ...newImages]);
              setImageFiles((prev) => [...prev, ...newFiles]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeMainImage = () => {
    setMainImage("");
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (!mainImage && !isEditing) {
      toast({
        title: "Image required",
        description: "Please upload at least one product image.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append all form data
      Object.entries(data).forEach(([key, value]) => {
        if (key === "variants" || key === "seo" || key === "tags") {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Append images
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formData.append("images", file);
        });
      } else if (isEditing && mainImage) {
        // For updates, indicate to keep existing images
        formData.append("keepExistingImages", "true");
      }

      const url =
        isEditing && product
          ? `/api/admin/products/${product._id}`
          : "/api/admin/products";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();

        toast({
          title: isEditing ? "Product updated" : "Product created",
          description: `Product "${data.name}" has been ${
            isEditing ? "updated" : "created"
          } successfully.`,
        });

        // Reset form if creating new
        if (!isEditing) {
          reset();
          setMainImage("");
          setAdditionalImages([]);
          setImageFiles([]);
        }

        // Call success callback
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${isEditing ? "update" : "create"} product`
        );
      }
    } catch (error: any) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} product:`,
        error
      );
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${
            isEditing ? "update" : "create"
          } product. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addVariant = () => {
    append({
      name: "",
      options: "",
      price: undefined,
      stock: undefined,
      sku: "",
    });
  };

  const pageTitle = isEditing ? "Edit Product" : "Create Product";
  const pageDescription = isEditing
    ? "Update the product information."
    : "Add a new product to your store.";
  const submitButtonText = isEditing ? "Update Product" : "Create Product";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
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
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details of your product.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Premium T-Shirt"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={watch("categoryId")}
                      onValueChange={(value) => setValue("categoryId", value)}
                      disabled={isLoadingCategories}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingCategories
                              ? "Loading categories..."
                              : "Select a category"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <p className="text-sm text-red-500">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product..."
                    rows={5}
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        className="pl-7"
                        placeholder="0.00"
                        {...register("price")}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-sm text-red-500">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compareAtPrice">Compare-at Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="compareAtPrice"
                        type="number"
                        step="0.01"
                        className="pl-7"
                        placeholder="0.00"
                        {...register("compareAtPrice")}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost per Item</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="cost"
                        type="number"
                        step="0.01"
                        className="pl-7"
                        placeholder="0.00"
                        {...register("cost")}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                    <Input
                      id="sku"
                      placeholder="e.g., TSHIRT-BLK-M"
                      {...register("sku")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">
                      Barcode (ISBN, UPC, GTIN, etc.)
                    </Label>
                    <Input
                      id="barcode"
                      placeholder="e.g., 123456789012"
                      {...register("barcode")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={watch("tags")?.includes(tag.id) || false}
                          onCheckedChange={(checked) => {
                            const currentTags = watch("tags") || [];
                            if (checked) {
                              setValue("tags", [...currentTags, tag.id]);
                            } else {
                              setValue(
                                "tags",
                                currentTags.filter((t) => t !== tag.id)
                              );
                            }
                          }}
                        />
                        <Label
                          htmlFor={`tag-${tag.id}`}
                          className="cursor-pointer"
                        >
                          {tag.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">
                    Inventory <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    {...register("stock")}
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-500">
                      {errors.stock.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="active">Active</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this product visible to customers.
                    </p>
                  </div>
                  <Switch
                    id="active"
                    checked={watch("active")}
                    onCheckedChange={(checked) => setValue("active", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="featured">Featured</Label>
                    <p className="text-sm text-muted-foreground">
                      Show this product as featured.
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={watch("featured")}
                    onCheckedChange={(checked) => setValue("featured", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping</CardTitle>
                <CardDescription>
                  Enter shipping information for this product.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("weight")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="length">Length (cm)</Label>
                    <Input
                      id="length"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      {...register("length")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (cm)</Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      {...register("width")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      {...register("height")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Main Product Image</CardTitle>
                <CardDescription>
                  Upload the primary image for your product. This will be the
                  featured image displayed in listings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mainImage ? (
                  <div className="relative border rounded-lg aspect-square max-w-md mx-auto overflow-hidden bg-muted">
                    <Image
                      src={mainImage || "/placeholder.svg"}
                      alt="Main product image"
                      fill
                      className="object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={removeMainImage}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove main image</span>
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg aspect-square max-w-md mx-auto flex flex-col items-center justify-center bg-muted/50 text-muted-foreground">
                    <Upload className="h-12 w-12 mb-3" />
                    <p className="text-sm font-medium">
                      No main image uploaded
                    </p>
                    <p className="text-xs mt-1">
                      Upload your primary product image
                    </p>
                  </div>
                )}
                <div className="max-w-md mx-auto">
                  <Label htmlFor="mainImage" className="mb-2 block">
                    {mainImage ? "Replace Main Image" : "Upload Main Image"}
                  </Label>
                  <Input
                    id="mainImage"
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Recommended size: 1000x1000px. Max file size: 2MB.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Product Images</CardTitle>
                <CardDescription>
                  Upload additional images to showcase your product from
                  different angles or show product details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center gap-4">
                  {additionalImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                      {additionalImages.map((image, index) => (
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
                      Recommended size: 800x800px. Max file size: 2MB per image.
                      You can select multiple images at once.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Variants</CardTitle>
                <CardDescription>
                  Add variants like size, color, material, etc.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-end gap-4 border-b pb-4"
                  >
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`variants.${index}.name`}>
                        Variant Name
                      </Label>
                      <select
                        id={`variants.${index}.name`}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register(`variants.${index}.name` as const)}
                      >
                        <option value="">Select a variant type</option>
                        <option value="Size">Size</option>
                        <option value="Color">Color</option>
                        <option value="Material">Material</option>
                        <option value="Style">Style</option>
                        <option value="Weight">Weight</option>
                        <option value="Capacity">Capacity</option>
                      </select>
                      {errors.variants?.[index]?.name && (
                        <p className="text-sm text-red-500">
                          {errors.variants[index]?.name?.message}
                        </p>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`variants.${index}.options`}>
                        Options (comma separated)
                      </Label>
                      <Input
                        id={`variants.${index}.options`}
                        placeholder="e.g., Small, Medium, Large"
                        {...register(`variants.${index}.options` as const)}
                      />
                      {errors.variants?.[index]?.options && (
                        <p className="text-sm text-red-500">
                          {errors.variants[index]?.options?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`variants.${index}.price`}>Price</Label>
                      <Input
                        id={`variants.${index}.price`}
                        placeholder="100"
                        {...register(`variants.${index}.price` as const)}
                      />
                      {errors.variants?.[index]?.price && (
                        <p className="text-sm text-red-500">
                          {errors.variants[index]?.price?.message}
                        </p>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`variants.${index}.stock`}>Stock</Label>
                      <Input
                        id={`variants.${index}.stock`}
                        placeholder="100"
                        {...register(`variants.${index}.stock` as const)}
                      />
                      {errors.variants?.[index]?.stock && (
                        <p className="text-sm text-red-500">
                          {errors.variants[index]?.stock?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`variants.${index}.sku`}>SKU</Label>
                      <Input
                        id={`variants.${index}.sku`}
                        placeholder="e.g., Size"
                        {...register(`variants.${index}.sku` as const)}
                      />
                      {errors.variants?.[index]?.sku && (
                        <p className="text-sm text-red-500">
                          {errors.variants[index]?.sku?.message}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove variant</span>
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addVariant}
                  className="w-full bg-transparent"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variant
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
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
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="outline" asChild>
              <Link href="/admin/products">Cancel</Link>
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
