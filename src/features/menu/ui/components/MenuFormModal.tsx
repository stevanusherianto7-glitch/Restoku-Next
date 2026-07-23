import { useState, useEffect } from "react";
import { Button } from "@shared/ui/atoms/Button";
import { Input } from "@shared/ui/atoms/Input";
import type { MenuItem, CategoryId } from "@features/menu/domain/entities/MenuItem";
import { createCategoryId } from "@features/menu/domain/entities/MenuItem";
import { getCloudinaryUrl, MENU_IMAGE_FALLBACK } from "@shared/infrastructure/media/cloudinary";

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<MenuItem, "id" | "created_at" | "updated_at">) => Promise<void>;
  initialData?: MenuItem | null;
  isSubmitting?: boolean;
}

const CLOUDINARY_PRESETS = [
  { label: "Nasi Goreng Jawa", id: "Nasi_Goreng_Jawa_mqtalj" },
  { label: "Bakmi Godog Jawa", id: "Bakmi_Godog_Jawa_pq3ktp" },
  { label: "Ayam Penyet Semarang", id: "Ayam_Goreng_Penyet_Semarang_qsbpul" },
  { label: "Rawon Semarang", id: "Rawon_Semarang_vaxfch" },
  { label: "Soto Ayam Semarang", id: "Soto_Ayam_Semarang_m4xtel" },
  { label: "Tahu Gimbal", id: "Tahu_Gimbal_Semarang_tjtpa0" },
  { label: "Es Teler Spesial", id: "Es_Teler_vyc2aq" },
  { label: "Es Soda Gembira", id: "Es_Soda_Gembira_vurlli" },
  { label: "Nipis Madu Segar", id: "Nipis_Madu_saf8bz" },
  { label: "Roti Bakar Keju", id: "Roti_Bakar_Keju_Karamel_ivy0yr" },
  { label: "Pisang Goreng Keju", id: "Pisang_Goreng_Keju_Karamel_lqjxrw" },
];

export function MenuFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: MenuFormModalProps) {
  const isEdit = !!initialData;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">(30000);
  const [category, setCategory] = useState<CategoryId>("makanan");
  const [imageUrl, setImageUrl] = useState("Nasi_Goreng_Jawa_mqtalj");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [isPopular, setIsPopular] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isPromo, setIsPromo] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      setPrice(initialData.price);
      setCategory(initialData.category || "makanan");
      setImageUrl(initialData.image_url || "Nasi_Goreng_Jawa_mqtalj");
      setStatus(initialData.status || "active");
      setIsPopular(!!initialData.is_popular);
      setIsNew(!!initialData.is_new);
      setIsPromo(!!initialData.is_promo);
    } else {
      setName("");
      setDescription("");
      setPrice(30000);
      setCategory("makanan");
      setImageUrl("Nasi_Goreng_Jawa_mqtalj");
      setStatus("active");
      setIsPopular(false);
      setIsNew(false);
      setIsPromo(false);
    }
    setErrorMsg("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Nama menu hidangan wajib diisi.");
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMsg("Harga menu harus lebih dari Rp 0.");
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category_id: createCategoryId(`cat-${category}`),
        category,
        image_url: imageUrl.trim(),
        status,
        is_popular: isPopular,
        is_new: isNew,
        is_promo: isPromo,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyimpan menu.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {isEdit ? "Edit Menu Hidangan" : "Tambah Menu Hidangan Baru"}
            </h3>
            <p className="text-xs text-slate-500">
              {isEdit ? "Perbarui informasi dan harga menu" : "Isi rincian menu hidangan untuk dimasukkan ke katalog"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-600 border border-rose-200">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama & Harga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Menu <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="Contoh: Nasi Goreng Spesial"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Harga (Rp) <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="35000"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                required
              />
            </div>
          </div>

          {/* Kategori & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-cabe-500 focus:outline-none"
              >
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
                <option value="tambahan">Tambahan / Snack</option>
                <option value="paket">Paket Hemat</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status Ketersediaan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-cabe-500 focus:outline-none"
              >
                <option value="active">🟢 Aktif / Tersedia</option>
                <option value="inactive">🔴 Non-Aktif / Habis</option>
              </select>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Menu</label>
            <textarea
              rows={2}
              placeholder="Jelaskan bahan, rasa, atau racikan hidangan ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-800 focus:border-cabe-500 focus:outline-none"
            />
          </div>

          {/* Cloudinary Asset ID / Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Foto Menu (Cloudinary public_id / Image URL)
            </label>
            <div className="flex gap-3 items-center">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                <img
                  src={getCloudinaryUrl(imageUrl, { width: 120, height: 120, crop: "fill" })}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = MENU_IMAGE_FALLBACK; }}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <Input
                placeholder="Contoh: Nasi_Goreng_Jawa_mqtalj atau URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1"
              />
            </div>

            {/* Quick Preset Selector */}
            <div className="mt-2.5">
              <span className="text-[11px] font-semibold text-slate-500 mb-1.5 block">Pilih dari Cloudinary Presets:</span>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200/80">
                {CLOUDINARY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setImageUrl(preset.id)}
                    className={`rounded-lg px-2 py-1 text-[10px] font-bold transition-all ${
                      imageUrl === preset.id
                        ? "bg-cabe-600 text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Badges / Flags */}
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80">
            <span className="text-xs font-bold text-slate-700 mb-2 block">Label & Status Promo</span>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-cabe-600 focus:ring-cabe-500"
                />
                ★ Terlaris (Popular)
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-cabe-600 focus:ring-cabe-500"
                />
                ✨ Menu Baru (New)
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPromo}
                  onChange={(e) => setIsPromo(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-cabe-600 focus:ring-cabe-500"
                />
                🏷️ Promo (Discount)
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "+ Tambah Menu"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
