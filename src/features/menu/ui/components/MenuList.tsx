import type { MenuItem } from "@features/menu/domain/entities/MenuItem";
import { MenuItemCard } from "./MenuItemCard";

interface MenuListProps {
  menus: MenuItem[];
  isLoading: boolean;
  onEdit: (menu: MenuItem) => void;
  onDelete: (menu: MenuItem) => void;
}

export function MenuList({ menus, isLoading, onEdit, onDelete }: MenuListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border bg-white p-4">
            <div className="mb-3 aspect-square rounded-lg bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Belum ada menu</h3>
        <p className="mt-1 text-sm text-gray-500">Mulai tambahkan menu baru</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {menus.map((menu) => (
        <MenuItemCard
          key={menu.id}
          menu={menu}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
