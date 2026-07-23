export type MenuId = string & { readonly __brand: unique symbol };
export type CategoryId = string & { readonly __brand: unique symbol };

export type MenuStatus = "active" | "inactive";
export type MenuCategory = "makanan" | "minuman" | "tambahan" | "paket";

export interface MenuItem {
  id: MenuId;
  name: string;
  description: string | null;
  price: number;
  category_id: CategoryId;
  category: MenuCategory;
  image_url: string | null;
  status: MenuStatus;
  is_popular: boolean;
  is_new: boolean;
  is_promo: boolean;
  created_at: string;
  updated_at: string;
}

export function createMenuId(id: string): MenuId {
  return id as MenuId;
}

export function createCategoryId(id: string): CategoryId {
  return id as CategoryId;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export function isAvailable(menu: MenuItem): boolean {
  return menu.status === "active";
}

export function getMenuBadges(menu: MenuItem): string[] {
  const badges: string[] = [];
  if (menu.is_popular) badges.push("Popular");
  if (menu.is_new) badges.push("Baru");
  if (menu.is_promo) badges.push("Promo");
  return badges;
}
