import { z } from "zod";

// Product validation schema
export const productSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Product name is required")
    .max(200, "Product name must be less than 200 characters"),
  description: z.string()
    .trim()
    .max(2000, "Description must be less than 2000 characters"),
  category: z.string()
    .trim()
    .min(1, "Category is required")
    .max(100, "Category must be less than 100 characters"),
  price: z.number()
    .min(0, "Price must be a positive number")
    .max(1000000, "Price must be less than 1,000,000"),
  image_url: z.string()
    .trim()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .optional(),
  availability: z.enum(["available", "out_of_stock", "discontinued"], {
    errorMap: () => ({ message: "Invalid availability status" })
  }),
});

// FAQ validation schema
export const faqSchema = z.object({
  question: z.string()
    .trim()
    .min(1, "Question is required")
    .max(500, "Question must be less than 500 characters"),
  answer: z.string()
    .trim()
    .min(1, "Answer is required")
    .max(5000, "Answer must be less than 5000 characters"),
  category: z.string()
    .trim()
    .max(100, "Category must be less than 100 characters")
    .optional(),
  is_published: z.boolean(),
});

// Category validation schema
export const categorySchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name must be less than 100 characters"),
  slug: z.string()
    .trim()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  icon: z.string()
    .trim()
    .max(50, "Icon name must be less than 50 characters")
    .optional(),
});

// Company details validation schema
export const companyDetailsSchema = z.object({
  company_name: z.string()
    .trim()
    .min(1, "Company name is required")
    .max(200, "Company name must be less than 200 characters"),
  tagline: z.string()
    .trim()
    .max(200, "Tagline must be less than 200 characters")
    .optional(),
  description: z.string()
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  email: z.string()
    .trim()
    .email("Must be a valid email")
    .max(255, "Email must be less than 255 characters")
    .optional(),
  phone: z.string()
    .trim()
    .max(50, "Phone must be less than 50 characters")
    .optional(),
  whatsapp: z.string()
    .trim()
    .max(50, "WhatsApp must be less than 50 characters")
    .optional(),
  address: z.string()
    .trim()
    .max(500, "Address must be less than 500 characters")
    .optional(),
  website_url: z.string()
    .trim()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .optional(),
  facebook_url: z.string()
    .trim()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .optional(),
  instagram_url: z.string()
    .trim()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .optional(),
  google_map_url: z.string()
    .trim()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .optional(),
  logo_url: z.string()
    .trim()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type FAQInput = z.infer<typeof faqSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CompanyDetailsInput = z.infer<typeof companyDetailsSchema>;
