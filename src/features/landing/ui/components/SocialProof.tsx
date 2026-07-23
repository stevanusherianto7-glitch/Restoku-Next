interface ClientBrand {
  name: string;
  logo: string;
}

const clients: ClientBrand[] = [
  {
    name: "Kopi Kenangan",
    logo: "/images/logos/kopi-kenangan.png",
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
  },
  {
    name: "D'Cost Seafood",
    logo: "/images/logos/dcost.png",
  },
];

export function SocialProof() {
  return (
    <section className="py-14 border-y border-slate-200/80 bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-10">
          Dipercaya oleh Brand Kuliner & Franchise Terkemuka Indonesia
        </p>

        {/* 100% Transparent Logos on Pristine Light Canvas (Zero Card Boxes) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10 items-center justify-center">
          {clients.map((client) => (
            <div
              key={client.name}
              className="group relative flex items-center justify-center p-3 h-20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-14 sm:max-h-16 w-auto object-contain filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
