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
    <section className="py-14 border-y border-slate-800/80 bg-slate-950/90 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-slate-400 mb-10">
          Dipercaya oleh Brand Kuliner & Franchise Terkemuka Indonesia
        </p>

        {/* Seamless Transparent Brand Logos (No White Background Box) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-center">
          {clients.map((client) => (
            <div
              key={client.name}
              className="group relative flex items-center justify-center p-3 h-20 transition-all duration-300 cursor-pointer"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-full max-w-[140px] object-contain filter brightness-0 invert opacity-60 group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
