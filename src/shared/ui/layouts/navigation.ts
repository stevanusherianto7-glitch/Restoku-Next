import type { ElementType } from "react";
import {
  StoreIcon,
  PackageIcon,
  BoxesIcon,
  BriefcaseIcon,
  BarChartIcon,
  WalletIcon,
  SettingsIcon,
  SmartphoneIcon,
} from "@shared/ui/components/icons";

export type Role = "kasir" | "kitchen" | "waiter" | "manager" | "owner";

export type NavItem = {
  name: string;
  href: string;
  roles: Role[];
};

export type NavGroup = {
  title: string;
  Icon: ElementType;
  roles: Role[];
  items: NavItem[];
};

export const navigation: NavGroup[] = [
  {
    title: "Utama",
    Icon: StoreIcon,
    roles: ["kasir", "kitchen", "waiter", "manager", "owner"],
    items: [
      { name: "Dashboard", href: "/dashboard", roles: ["kasir", "waiter", "manager", "owner"] },
      { name: "Kasir (POS)", href: "/pos", roles: ["kasir", "manager", "owner"] },
      { name: "Monitor Pesanan (KDS)", href: "/orders", roles: ["kasir", "waiter", "manager", "owner"] },
      { name: "Dapur (KDS)", href: "/kitchen", roles: ["kitchen", "waiter", "manager", "owner"] },
      { name: "Waiter & Bar Display", href: "/waiter-bar", roles: ["waiter", "manager", "owner"] },
    ],
  },
  {
    title: "Manajemen",
    Icon: PackageIcon,
    roles: ["kasir", "waiter", "manager", "owner"],
    items: [
      { name: "Produk & Menu", href: "/menu", roles: ["manager", "owner"] },
      { name: "Katalog Menu", href: "/menu-catalog", roles: ["kasir", "waiter", "manager", "owner"] },
      { name: "Buku Menu Digital (Tamu)", href: "/menu-digital", roles: ["manager", "owner"] },
      { name: "Manajemen Meja", href: "/tables", roles: ["kasir", "waiter", "manager", "owner"] },
    ],
  },
  {
    title: "Inventaris",
    Icon: BoxesIcon,
    roles: ["manager", "owner"],
    items: [
      { name: "Stok (Bahan Baku)", href: "/inventory", roles: ["manager", "owner"] },
      { name: "Supplier", href: "/suppliers", roles: ["manager", "owner"] },
      { name: "Stock Opname", href: "/stock-opname", roles: ["manager", "owner"] },
      { name: "Dasbor Stok", href: "/dashboard-inventory", roles: ["manager", "owner"] },
    ],
  },
  {
    title: "Operasional",
    Icon: BriefcaseIcon,
    roles: ["kasir", "manager", "owner"],
    items: [
      { name: "Shift Kerja", href: "/shifts", roles: ["manager", "owner"] },
      { name: "Sesi Kasir", href: "/cashier-session", roles: ["kasir", "manager", "owner"] },
    ],
  },
  {
    title: "Laporan",
    Icon: BarChartIcon,
    roles: ["manager", "owner"],
    items: [
      { name: "Laporan Penjualan", href: "/reports", roles: ["manager", "owner"] },
      { name: "Perbandingan Outlet", href: "/outlet-comparison", roles: ["manager", "owner"] },
      { name: "Arus Kas", href: "/cash-flow", roles: ["manager", "owner"] },
      { name: "Laba & Rugi", href: "/profit-loss", roles: ["manager", "owner"] },
      { name: "Laporan Produk", href: "/reports/products", roles: ["manager", "owner"] },
      { name: "Laporan Shift", href: "/reports/shifts", roles: ["manager", "owner"] },
      { name: "Laporan Meja", href: "/reports/tables", roles: ["manager", "owner"] },
    ],
  },
  {
    title: "Keuangan",
    Icon: WalletIcon,
    roles: ["manager", "owner"],
    items: [
      { name: "Biaya Operasional", href: "/expenses", roles: ["manager", "owner"] },
    ],
  },
  {
    title: "Pengaturan",
    Icon: SettingsIcon,
    roles: ["manager", "owner"],
    items: [
      { name: "Pengaturan Outlet", href: "/settings/outlet", roles: ["manager", "owner"] },
      { name: "Diskon & Pajak", href: "/settings/discounts", roles: ["manager", "owner"] },
      { name: "QR Code Meja", href: "/settings/qr", roles: ["manager", "owner"] },
      { name: "Printer Config", href: "/settings/printer", roles: ["manager", "owner"] },
      { name: "Pengaturan TTS", href: "/settings/tts", roles: ["manager", "owner"] },
    ],
  },
  {
    title: "Owner View",
    Icon: SmartphoneIcon,
    roles: ["owner"],
    items: [
      { name: "Data Karyawan", href: "/owner/employees", roles: ["owner"] },
      { name: "Peringatan Stok", href: "/owner/inventory/alerts", roles: ["owner"] },
      { name: "Google Review", href: "/owner/reviews", roles: ["owner"] },
      { name: "Pengaturan Owner", href: "/owner/settings", roles: ["owner"] },
    ],
  },
];

export const ROLE_LABEL: Record<Role, string> = {
  kasir: "Kasir",
  kitchen: "Kitchen Staff",
  waiter: "Waiter / Bar",
  manager: "Manager",
  owner: "Owner",
};

export const ROLE_BADGE: Record<Role, string> = {
  kasir: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  kitchen: "bg-red-500/15 text-red-400 border border-red-500/20",
  waiter: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  manager: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  owner: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
};

export const ROLE_AVATAR: Record<Role, string> = {
  kasir: "bg-blue-600/30 text-blue-300 ring-1 ring-blue-500/40",
  kitchen: "bg-red-600/30 text-red-300 ring-1 ring-red-500/40",
  waiter: "bg-emerald-600/30 text-emerald-300 ring-1 ring-emerald-500/40",
  manager: "bg-amber-600/30 text-amber-300 ring-1 ring-amber-500/40",
  owner: "bg-purple-600/30 text-purple-300 ring-1 ring-purple-500/40",
};
