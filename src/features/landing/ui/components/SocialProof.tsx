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
    <section className="py-14 border-y border-slate-200/80 bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-900 relative overflow-hidden">
      {/* Left and Right Gradient Fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-slate-100 to-transparent z-10"></div>
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-slate-100 to-transparent z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-8">
          Dipercaya oleh Brand Kuliner & Franchise Terkemuka Indonesia
        </p>

        {/* Infinite Running Marquee Container */}
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
                  className={`w-auto object-contain filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 ${client.sizeClass}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
