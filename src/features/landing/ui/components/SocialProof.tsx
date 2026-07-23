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
    logo: "/images/logos/es-teler-77.jpg",
  },
  {
    name: "Mixue Ice Cream",
    logo: "/images/logos/mixue.jpg",
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
    <section className="py-14 border-y border-slate-800/80 bg-slate-950/90 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-slate-400 mb-8">
          Dipercaya oleh Brand Kuliner & Franchise Terkemuka Indonesia
        </p>

        {/* Brand Logos Only (No text labels below) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 items-center justify-center">
          {clients.map((client) => (
            <div
              key={client.name}
              className="group relative flex items-center justify-center p-4 sm:p-5 rounded-2xl border border-slate-800/80 bg-white/95 hover:bg-white hover:border-cabe-500/60 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer h-24"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
