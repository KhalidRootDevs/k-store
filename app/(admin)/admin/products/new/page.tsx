"use client";

import { ProductForm } from "@/components/forms/product-form";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to products list after successful creation
    router.push("/admin/products");
  };

  return <ProductForm onSuccess={handleSuccess} />;
}
