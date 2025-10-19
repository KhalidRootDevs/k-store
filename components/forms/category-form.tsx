"use client";

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
import { routes } from "@/lib/routes";
import objectToFormData from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import DropzoneSingle from "../custom/img-dropzone-single";

const categorySchema = z.object({
  name: z
    .string()
    .refine((val) => val.trim().length > 0, {
      message: "Required!",
    })
    .refine((val) => val.trim().length >= 2, {
      message: "Category name must be at least 2 characters!",
    }),
  image: z
    .union([
      z
        .instanceof(File, { message: "Required!" })
        .refine((file) => file.size > 0, {
          message: "Image file cannot be empty!",
        })
        .refine(
          (file) =>
            ["image/jpeg", "image/png", "image/webp"].includes(file.type),
          { message: "Only JPEG, PNG, or WEBP images are allowed!" }
        ),
      z.string(),
    ])
    .refine((val) => val !== null && val !== undefined && val !== "", {
      message: "Required!",
    }),
  description: z.string().optional(),
  featured: z.boolean().default(false).optional(),
  active: z.boolean().default(true).optional(),
  parentId: z.string().default("none").optional(),
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
}

export function CategoryForm({
  category,
  isEditing = false,
}: CategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const methods = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: undefined,
      description: "",
      featured: false,
      active: true,
      parentId: "none",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = methods;

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
        image: category.image,
        parentId: parentIdValue,
      });
    }
  }, [category, isEditing, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);

    try {
      let formData;

      if (data.image instanceof File) {
        formData = objectToFormData(data);
      } else {
        formData = objectToFormData(data, ["image"]);
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

        toast.success(
          `Category has been ${isEditing ? "updated" : "created"} successfully!`
        );

        reset();
        router.push(routes.privateRoutes.admin.category.home);
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

      toast.error(error.message);
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
        <Link href={routes.privateRoutes.admin.category.home}>
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

      <FormProvider {...methods}>
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
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
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
                      onCheckedChange={(checked) =>
                        setValue("featured", checked)
                      }
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
                <DropzoneSingle name="image" />
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
      </FormProvider>
    </div>
  );
}
