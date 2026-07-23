const clients = [
  { name: "Kopi Kenangan", category: "Coffee Chain" },
  { name: "Es Teler 77", category: "Indonesian Cuisine" },
  { name: "Mixue Ice Cream", category: "Beverage Franchise" },
  { name: "Bakmi GM", category: "Noodle House" },
  { name: "D'Cost Seafood", category: "Seafood Restaurant" },
  { name: "Imperial Kitchen", category: "Asian Dining" },
];

export function SocialProof() {
  return (
    <section className="py-12 border-y border-slate-800 bg-slate-950/90 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-slate-500 mb-8">
          Dipercaya oleh Brand Kuliner & Franchise Terkemuka Indonesia
        </p>

        {/* Grayscale Client Logo Cloud */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center">
          {clients.map((client) => (
            <div
              key={client.name}
              className="group flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800/60 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 transition-all duration-300 cursor-pointer"
            >
              <span className="text-sm font-extrabold text-slate-400 group-hover:text-cabe-400 grayscale group-hover:grayscale-0 transition-all duration-300">
                {client.name}
              </span>
              <span className="text-[10px] text-slate-600 group-hover:text-slate-400 mt-0.5">
                {client.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
