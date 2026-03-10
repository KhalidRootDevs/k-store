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
import { routes } from "@/lib/routes";
import objectToFormData from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import InputField from "../custom/input";

import { Category } from "@/types";
import { CategoryFormValues, categorySchema } from "@/lib/validations/index";

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

  const { handleSubmit, reset } = methods;

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
                (cat: Category) => cat._id !== category._id,
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
          `Category has been ${isEditing ? "updated" : "created"} successfully!`,
        );

        reset();
        router.push(routes.privateRoutes.admin.category.home);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${isEditing ? "update" : "create"} category`,
        );
      }
    } catch (error: any) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} category:`,
        error,
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

  // Prepare options for parent category select
  const parentCategoryOptions = [
    { value: "none", label: "None (Top Level)" },
    ...parentCategories
      .filter((cat) => !cat.parentId)
      .map((cat) => ({
        value: cat._id,
        label: cat.name,
      })),
  ];

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
                {/* Name Field */}
                <InputField
                  name="name"
                  type="text"
                  label="Category Name"
                  placeholder="e.g., Electronics, Clothing, etc."
                  required
                />

                {/* Parent Category Field */}
                <InputField
                  name="parentId"
                  type="select"
                  label="Parent Category"
                  placeholder={
                    isLoadingCategories
                      ? "Loading categories..."
                      : "Select parent category (optional)"
                  }
                  options={parentCategoryOptions}
                  disabled={isLoadingCategories}
                />
                <p className="text-sm text-muted-foreground -mt-2">
                  Select a parent category to create a sub-category. Leave as
                  "None" for a top-level category.
                </p>

                {/* Description Field */}
                <InputField
                  name="description"
                  type="textarea"
                  label="Description"
                  placeholder="Describe this category..."
                  rowCount={4}
                />

                {/* Featured Switch */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label htmlFor="featured" className="text-sm font-medium">
                      Featured Category
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Display this category prominently on the home page.
                    </p>
                  </div>
                  <InputField name="featured" type="switch" />
                </div>

                {/* Active Switch */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label htmlFor="active" className="text-sm font-medium">
                      Active
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Make this category visible to customers.
                    </p>
                  </div>
                  <InputField name="active" type="switch" />
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
                <InputField name="image" type="image" />
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardFooter className="flex justify-between p-6">
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
