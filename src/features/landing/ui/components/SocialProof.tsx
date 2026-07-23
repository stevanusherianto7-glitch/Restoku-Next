interface ClientBrand {
  name: string;
  logo: string;
  bgColor?: string;
}

const clients: ClientBrand[] = [
  {
    name: "Kopi Kenangan",
    logo: "/images/logos/kopi-kenangan.png",
    bgColor: "bg-white/90",
  },
  {
    name: "Es Teler 77",
    logo: "/images/logos/es-teler-77.png",
  },
  {
    name: "Mixue Ice Cream",
    logo: "/images/logos/mixue.png",
  },
  {
    name: "Bakmi GM",
    logo: "/images/logos/bakmi-gm.png",
  },
  {
    name: "Imperial Kitchen",
    logo: "/images/logos/imperial-kitchen.png",
    bgColor: "bg-white/90",
  },
  {
    name: "D'Cost Seafood",
    logo: "/images/logos/dcost.png",
  },
];

export function SocialProof() {
  return (
    <section className="py-16 border-y border-slate-800/80 bg-slate-950/90 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-slate-400 mb-10">
          Dipercaya oleh Brand Kuliner & Franchise Terkemuka Indonesia
        </p>

        {/* High Contrast & Proportionally Enlarged Brand Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 items-center justify-center">
          {clients.map((client) => (
            <div
              key={client.name}
              className={`group relative flex items-center justify-center p-4 sm:p-5 rounded-2xl border border-slate-800/80 ${
                client.bgColor || "bg-slate-900/80"
              } hover:border-cabe-500/60 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 cursor-pointer h-24 sm:h-28`}
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-14 sm:max-h-16 w-auto object-contain transition-transform duration-300 filter drop-shadow-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
