interface GalleryItem {
  id: string;
  category: "WEDDING" | "CORPORATE" | "BIRTHDAY" | "FAMILY";
  title: string;
  date: string;
  description: string;
  imageUrl: string;
}

const GALLERY_DATA: GalleryItem[] = [
  {
    id: "g-1",
    category: "WEDDING",
    title: "Jamuan Pernikahan Premium",
    date: "12 Mei 2026",
    description: "Merayakan hari bahagia bersama keluarga tercinta dengan konsep prasmanan premium dan dekorasi adat Jawa modern yang anggun.",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "g-2",
    category: "CORPORATE",
    title: "Corporate Annual Dinner & Gathering",
    date: "28 April 2026",
    description: "Acara santap malam dan apresiasi tahunan perusahaan dalam suasana hangat khas Restoku Kedai Elvera 57.",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "g-3",
    category: "BIRTHDAY",
    title: "Perayaan Ulang Tahun Warm Family",
    date: "15 April 2026",
    description: "Pesta ulang tahun ke-30 meriah dengan hidangan prasmanan khas Semarang dan dekorasi bernuansa hangat.",
    imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "g-4",
    category: "FAMILY",
    title: "Reuni & Halal Bihalal Keluarga Besar",
    date: "02 April 2026",
    description: "Momen silaturahmi kehangatan keluarga dalam nuansa outdoor dan pilihan menu otentik rempah Jawa.",
    imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
  },
];

export function GalleryTab() {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="text-left">
        <h2 className="text-sm font-black tracking-wider text-amber-900 uppercase flex items-center gap-2">
          <span>✨</span> MOMEN SPESIAL KAMI
        </h2>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
          Dokumentasi berbagai kegiatan dan perayaan berharga yang pernah diselenggarakan di Kedai Elvera 57.
        </p>
      </div>

      {/* Gallery Cards */}
      <div className="space-y-5">
        {GALLERY_DATA.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl bg-white shadow-sm border border-amber-100/80 transition-all hover:shadow-md"
          >
            {/* Image Banner */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="rounded-lg bg-slate-900/85 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase backdrop-blur-xs">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
                <span className="shrink-0 text-[11px] font-semibold text-slate-400">{item.date}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
