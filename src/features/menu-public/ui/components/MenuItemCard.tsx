import type { MenuItem } from "@features/menu/domain/entities/MenuItem";
import { formatPrice, getMenuBadges, isAvailable } from "@features/menu/domain/entities/MenuItem";
import { getCloudinaryUrl, MENU_IMAGE_FALLBACK } from "@shared/infrastructure/media/cloudinary";

interface MenuItemCardProps {
  menu: MenuItem;
  onAddToCart: (menu: MenuItem) => void;
}

export function MenuItemCard({ menu, onAddToCart }: MenuItemCardProps) {
  const badges = getMenuBadges(menu);
  const available = isAvailable(menu);

  // Pick badge label priority: Favorit, Best Seller, Spesial
  const primaryBadge = menu.is_popular
    ? "Favorit"
    : menu.is_promo
    ? "Best Seller"
    : menu.is_new
    ? "Spesial"
    : badges[0];

  return (
    <div
      onClick={() => available && onAddToCart(menu)}
      className={`relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-3.5 shadow-sm border border-amber-100/90 transition-all hover:shadow-md cursor-pointer ${
        !available ? "opacity-60" : ""
      }`}
    >
      <div>
        {/* Image & Badge Overlay */}
        <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-amber-50">
          {primaryBadge && (
            <div className="absolute top-2 left-2 z-10">
              <span className="rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-black text-white shadow-xs">
                {primaryBadge}
              </span>
            </div>
          )}

          {menu.image_url ? (
            <img
              src={getCloudinaryUrl(menu.image_url, { width: 500, height: 400, crop: "fill" })}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = MENU_IMAGE_FALLBACK;
              }}
              alt={menu.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-amber-300">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-xs font-black text-slate-900 line-clamp-1">{menu.name}</h3>

          {menu.description && (
            <p className="line-clamp-2 text-[11px] text-slate-500 font-medium leading-tight">
              {menu.description}
            </p>
          )}
        </div>
      </div>

      {/* Price, Status & Add Button */}
      <div className="mt-3 pt-2 border-t border-amber-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-black text-amber-800">
            {formatPrice(menu.price)}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
              available
                ? "bg-emerald-100 text-emerald-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            {available ? "Tersedia" : "Habis"}
          </span>
        </div>

        {available && (
          <button
            type="button"
            onClick={() => onAddToCart(menu)}
            className="w-full rounded-2xl bg-amber-600 py-2 text-xs font-black text-white shadow-sm hover:bg-amber-700 transition-all"
          >
            + Tambah
          </button>
        )}
      </div>
    </div>
  );
}
