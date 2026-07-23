interface ClientBrand {
  name: string;
  logo: string;
  sizeClass: string;
}

const clients: ClientBrand[] = [
  {
    name: "Kopi Kenangan",
    logo: "/images/logos/kopi-kenangan.png",
    sizeClass: "max-h-16 sm:max-h-20 scale-125",
  },
  {
    name: "Es Teler 77",
    logo: "/images/logos/es-teler-77.png",
    sizeClass: "max-h-14 sm:max-h-16",
  },
  {
    name: "Mixue Ice Cream",
    logo: "/images/logos/mixue.png",
    sizeClass: "max-h-16 sm:max-h-18",
  },
  {
    name: "Bakmi GM",
    logo: "/images/logos/bakmi-gm.png",
    sizeClass: "max-h-16 sm:max-h-20 scale-125",
  },
  {
    name: "Imperial Kitchen",
    logo: "/images/logos/imperial-kitchen.png",
    sizeClass: "max-h-14 sm:max-h-16",
  },
  {
    name: "D'Cost Seafood",
    logo: "/images/logos/dcost.png",
    sizeClass: "max-h-14 sm:max-h-16 scale-[1.4]",
  },
];

export function SocialProof() {
  // Triple the list to create a seamless infinite scrolling loop
  const marqueeClients = [...clients, ...clients, ...clients];

  return (
    <section className="py-14 border-y border-slate-800/80 bg-slate-950 text-white relative overflow-hidden">
      {/* Left and Right Gradient Fades to Dark Slate */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-slate-950 to-transparent z-10"></div>
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-slate-950 to-transparent z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Plain Text Title (No Pill Wrapper) */}
        <p className="text-center text-xs font-mono uppercase tracking-widest text-slate-400 mb-8">
          Dipercaya oleh Brand Kuliner & Franchise Terkemuka Indonesia
        </p>

        {/* 100% Transparent Logos on Dark Canvas with White Glow Halo */}
        <div className="flex overflow-hidden relative w-full">
          <div className="animate-marquee flex items-center gap-12 sm:gap-20 py-2">
            {marqueeClients.map((client, index) => (
              <div
                key={`${client.name}-${index}`}
                className="group relative flex items-center justify-center p-2 min-w-[140px] sm:min-w-[180px] h-20 transition-all duration-300 cursor-pointer shrink-0"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className={`w-auto object-contain transition-all duration-300 group-hover:scale-110 [filter:drop-shadow(0_0_8px_rgba(255,255,255,0.95))_drop-shadow(0_0_2px_rgba(255,255,255,1))] ${client.sizeClass}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
