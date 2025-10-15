"use client";

import { CategoryForm } from "@/components/forms/category-form";
import { useRouter } from "next/navigation";

export default function NewCategoryPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin/categories");
  };

  return <CategoryForm onSuccess={handleSuccess} />;
}
