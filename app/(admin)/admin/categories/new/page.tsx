"use client";

import { useRouter } from "next/navigation";
import { CategoryForm } from "../_components/category-form";

export default function NewCategoryPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to categories list after successful creation
    router.push("/admin/categories");
  };

  return <CategoryForm onSuccess={handleSuccess} />;
}
