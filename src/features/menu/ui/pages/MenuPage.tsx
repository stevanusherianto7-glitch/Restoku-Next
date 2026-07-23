import { useState } from "react";
import { useMenuViewModel } from "@features/menu/ui/viewmodels/useMenuViewModel";
import { MenuList } from "@features/menu/ui/components/MenuList";
import { Button } from "@shared/ui/atoms/Button";
import { Input } from "@shared/ui/atoms/Input";
import { AdminLayout } from "@shared/ui/templates/AdminLayout";
import type { MenuItem, CategoryId } from "@features/menu/domain/entities/MenuItem";

export function MenuPage() {
  const {
    menus,
    isLoading,
    filters,
    updateFilters,
    deleteMenu,
  } = useMenuViewModel();

  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search });
  };

  const handleEdit = (menu: MenuItem) => {
    setSelectedMenu(menu);
  };

  const handleDelete = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedMenu) {
      await deleteMenu(selectedMenu.id);
      setShowDeleteModal(false);
      setSelectedMenu(null);
    }
  };

  return (
    <AdminLayout title="Kelola Katalog Menu">
      {/* Top Banner Action */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm border border-slate-200/80">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Katalog Hidangan</h2>
          <p className="text-xs text-slate-500">Kelola daftar makanan, minuman, varian harga, dan ketersediaan stok.</p>
        </div>
        <Button variant="primary" size="md">
          + Tambah Menu Baru
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="w-full sm:w-80 flex gap-2">
          <Input
            placeholder="Cari hidangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
          <Button type="submit" variant="secondary" size="md">
            Cari
          </Button>
        </form>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          <button
            onClick={() => updateFilters({})}
            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              !filters.category
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
            }`}
          >
            Semua
          </button>
          {(["makanan", "minuman", "tambahan"] as CategoryId[]).map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilters({ category: cat })}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold capitalize transition-all ${
                filters.category === cat
                  ? "bg-cabe-600 text-white shadow-md shadow-cabe-600/30"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu List Grid */}
      <MenuList
        menus={menus}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900">Hapus Menu</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus hidangan <strong className="text-slate-900">{selectedMenu?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedMenu(null);
                }}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={confirmDelete}
              >
                Ya, Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
