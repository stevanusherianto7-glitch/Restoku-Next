import { useState } from "react";

interface ClientBrand {
  name: string;
  category: string;
  logo: string;
  accent: string;
}

const clients: ClientBrand[] = [
  {
    name: "Kopi Kenangan",
    category: "Coffee Chain",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Kopi_Kenangan_logo.svg/512px-Kopi_Kenangan_logo.svg.png",
    accent: "#8B4513",
  },
  {
    name: "Es Teler 77",
    category: "Indonesian Cuisine",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Es_Teler_77_logo.svg/512px-Es_Teler_77_logo.svg.png",
    accent: "#10B981",
  },
  {
    name: "Mixue Ice Cream",
    category: "Beverage Franchise",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Mixue_Ice_Cream_%26_Tea_logo.svg/512px-Mixue_Ice_Cream_%26_Tea_logo.svg.png",
    accent: "#EF4444",
  },
  {
    name: "Bakmi GM",
    category: "Noodle House",
    logo: "https://upload.wikimedia.org/wikipedia/id/thumb/7/77/Bakmi_GM_Logo.svg/512px-Bakmi_GM_Logo.svg.png",
    accent: "#F59E0B",
  },
  {
    name: "D'Cost Seafood",
    category: "Seafood Restaurant",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/D%27Cost_Logo.svg/512px-D%27Cost_Logo.svg.png",
    accent: "#3B82F6",
  },
  {
    name: "Imperial Kitchen",
    category: "Asian Dining",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Imperial_Group_logo.svg/512px-Imperial_Group_logo.svg.png",
    accent: "#EC4899",
  },
];

export function SocialProof() {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (name: string) => {
    setImgErrors((prev) => ({ ...prev, [name]: true }));
  };

  return (
    <section className="py-14 border-y border-slate-800/80 bg-slate-950/90 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-slate-400 mb-8">
          Dipercaya oleh Brand Kuliner & Franchise Terkemuka Indonesia
        </p>

        {/* Authentic Grayscale Logo Cloud */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center">
          {clients.map((client) => {
            const hasError = imgErrors[client.name];
            return (
              <div
                key={client.name}
                className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700/80 transition-all duration-300 cursor-pointer min-h-[110px]"
              >
                {!hasError ? (
                  <div className="h-10 sm:h-12 w-full flex items-center justify-center p-1">
                    <img
                      src={client.logo}
                      alt={client.name}
                      onError={() => handleImageError(client.name)}
                      className="max-h-full max-w-full object-contain filter grayscale invert contrast-200 opacity-70 group-hover:grayscale-0 group-hover:invert-0 group-hover:contrast-100 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-sm font-extrabold text-slate-300 group-hover:text-cabe-400 transition-colors">
                      {client.name}
                    </span>
                  </div>
                )}
                <span className="text-[10px] font-semibold text-slate-500 group-hover:text-slate-300 mt-2 transition-colors">
                  {client.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
