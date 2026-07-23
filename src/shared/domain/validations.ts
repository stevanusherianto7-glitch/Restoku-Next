import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(6, "Password minimal 6 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const menuSchema = z.object({
  name: z
    .string()
    .min(1, "Nama menu wajib diisi")
    .max(100, "Nama menu maksimal 100 karakter"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
  price: z
    .number()
    .min(0, "Harga tidak boleh negatif")
    .max(100000000, "Harga terlalu besar"),
  category_id: z.string().min(1, "Kategori wajib dipilih"),
  is_available: z.boolean().default(true),
  is_popular: z.boolean().default(false),
  prep_time: z
    .number()
    .min(0, "Waktu persiapan tidak boleh negatif")
    .max(480, "Waktu persiapan maksimal 8 jam")
    .optional(),
});

export type MenuInput = z.infer<typeof menuSchema>;

export const orderItemSchema = z.object({
  menu_id: z.string().min(1),
  quantity: z.number().int().min(1, "Jumlah minimal 1"),
  variant: z.string().optional(),
  notes: z.string().max(200, "Catatan maksimal 200 karakter").optional(),
});

export const orderSchema = z.object({
  table_number: z.number().int().min(1, "Nomor meja wajib diisi"),
  items: z.array(orderItemSchema).min(1, "Minimal 1 item"),
  notes: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;

export const tableSchema = z.object({
  name: z
    .string()
    .min(1, "Nama meja wajib diisi")
    .max(50, "Nama meja maksimal 50 karakter"),
  number: z.number().int().min(1, "Nomor meja minimal 1"),
});

export type TableInput = z.infer<typeof tableSchema>;
