import type { MenuItem } from "@features/menu/domain/entities/MenuItem";
import { formatPrice, getMenuBadges, isAvailable } from "@features/menu/domain/entities/MenuItem";
import { getCloudinaryUrl, MENU_IMAGE_FALLBACK } from "@shared/infrastructure/media/cloudinary";

interface MenuItemCardProps {
  menu: MenuItem;
  onEdit: (menu: MenuItem) => void;
  onDelete: (menu: MenuItem) => void;
}

export function MenuItemCard({ menu, onEdit, onDelete }: MenuItemCardProps) {
  const badges = getMenuBadges(menu);
  const available = isAvailable(menu);

  return (
    <div className={`relative rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${!available ? "opacity-60" : ""}`}>
      {/* Badges */}
      {badges.length > 0 && (
        <div className="absolute -top-2 left-4 flex gap-1">
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-cabe-100 px-2 py-0.5 text-xs font-medium text-cabe-700"
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* Image */}
      <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-gray-100">
        {menu.image_url ? (
          <img
            src={getCloudinaryUrl(menu.image_url, { width: 400, height: 400, crop: "fill" })}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = MENU_IMAGE_FALLBACK;
            }}
            alt={menu.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900">{menu.name}</h3>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {menu.category}
          </span>
        </div>

        {menu.description && (
          <p className="line-clamp-2 text-sm text-gray-500">{menu.description}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-cabe-600">
            {formatPrice(menu.price)}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              available
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {available ? "Tersedia" : "Habis"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onEdit(menu)}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(menu)}
          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
