import { z } from "zod";

export const categorySchema = z.object({
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
