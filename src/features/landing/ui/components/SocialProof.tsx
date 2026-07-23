interface ClientBrand {
  name: string;
  logo: string;
  sizeClass: string;
}

const clients: ClientBrand[] = [
  {
    name: "Kopi Kenangan",
    logo: "/images/logos/kopi-kenangan.png",
    sizeClass: "max-h-12 sm:max-h-14 scale-110",
  },
  {
    name: "Es Teler 77",
    logo: "/images/logos/es-teler-77.png",
    sizeClass: "max-h-12 sm:max-h-14",
  },
  {
    name: "Mixue Ice Cream",
    logo: "/images/logos/mixue.png",
    sizeClass: "max-h-12 sm:max-h-14",
  },
  {
    name: "Bakmi GM",
    logo: "/images/logos/bakmi-gm.png",
    sizeClass: "max-h-12 sm:max-h-14 scale-110",
  },
  {
    name: "Imperial Kitchen",
    logo: "/images/logos/imperial-kitchen.png",
    sizeClass: "max-h-12 sm:max-h-14",
  },
  {
    name: "D'Cost Seafood",
    logo: "/images/logos/dcost.png",
    sizeClass: "max-h-12 sm:max-h-14 scale-125",
  },
];

export function SocialProof() {
  // Triple the list to create a seamless infinite scrolling loop
  const marqueeClients = [...clients, ...clients, ...clients];

  return (
    <section className="py-16 border-y border-slate-800/80 bg-slate-950 text-white relative overflow-hidden">
      {/* Left and Right Gradient Fades to Dark Slate */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-slate-950 to-transparent z-10"></div>
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-slate-950 to-transparent z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Adjusted Font Style for High Contrast & Premium Theme */}
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20 inline-block shadow-sm">
            Dipercaya oleh Brand Kuliner & Franchise Terkemuka Indonesia
          </span>
        </div>

        {/* Infinite Running Marquee with Floating White Translucent Glass Cards */}
        <div className="flex overflow-hidden relative w-full">
          <div className="animate-marquee flex items-center gap-6 sm:gap-8 py-2">
            {marqueeClients.map((client, index) => (
              <div
                key={`${client.name}-${index}`}
                className="group relative flex items-center justify-center px-6 py-3 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-lg shadow-black/40 hover:border-cabe-500 hover:shadow-cabe-500/30 hover:scale-105 transition-all duration-300 cursor-pointer shrink-0 min-w-[170px] sm:min-w-[200px] h-20"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className={`w-auto object-contain transition-transform duration-300 drop-shadow-xs ${client.sizeClass}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
