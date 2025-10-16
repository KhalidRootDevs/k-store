"use client";

import { ProductForm } from "@/components/forms/product/product-form";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin/products");
  };

  return <ProductForm onSuccess={handleSuccess} />;
}
