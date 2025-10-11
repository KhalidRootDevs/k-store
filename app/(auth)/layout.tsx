import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-Commerce Platform",
  description: "A full-featured e-commerce platform with admin panel",
  generator: "v0.dev",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
