import { useState } from "react";
import { Button } from "@shared/ui/atoms/Button";
import { Link } from "react-router-dom";

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      badge: "Warung & UMKM",
      priceMonthly: 129000,
      priceAnnual: 99000,
      description: "Cocok untuk kedai kopi, warung, dan usaha kuliner pemula.",
      features: [
        "1 Outlet Restoran",
        "POS Kasir Cepat (Offline-First)",
        "Struk Cetak Thermal Bluetooth",
        "Menu Digital (QR Meja Dasar)",
        "Laporan Penjualan Harian",
        "1 Akses Staf Kasir",
      ],
      cta: "Mulai Free Trial 14 Hari",
      popular: false,
    },
    {
      name: "Professional",
      badge: "Paling Populer",
      priceMonthly: 349000,
      priceAnnual: 279000,
      description: "Solusi lengkap untuk restoran berkembang dengan traffic tinggi.",
      features: [
        "Hingga 3 Outlet Cabang",
        "Semua fitur paket Starter",
        "KDS Layar Dapur Real-time",
        "Manajemen Stok & Opname Resep",
        "Laporan Laba Rugi & Arus Kas",
        "Hingga 10 Akses Staf & PIN Manager",
        "Integrasi QRIS All Bank & E-Wallet",
        "Dukungan WhatsApp Bot Notification",
      ],
      cta: "Mulai Free Trial 14 Hari",
      popular: true,
    },
    {
      name: "Enterprise",
      badge: "Jaringan Restoran",
      priceMonthly: 899000,
      priceAnnual: 719000,
      description: "Untuk jaringan franchise & grup restoran berskala besar.",
      features: [
        "Unlimited Outlet Cabang",
        "Semua fitur paket Professional",
        "Akses API Integrasi ERP / Accounting",
        "Custom Branding Struk & QR",
        "Unlimited Akses User Staf",
        "SLA Server Uptime 99.99%",
        "Dedicated Account Manager 24/7",
      ],
      cta: "Hubungi Tim Sales",
      popular: false,
    },
  ];

  return (
    <section id="harga" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
            Pilihan Paket Terjangkau
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Harga Transparan, Tanpa Biaya Tersembunyi
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Coba gratis 14 hari penuh. Upgrade atau downgrade kapan saja tanpa komitmen.
          </p>

          {/* Interactive Billing Toggle (Monthly / Annual with 20% OFF) */}
          <div className="mt-8 inline-flex items-center gap-3 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                !isAnnual
                  ? "bg-slate-800 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Tagihan Bulanan
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isAnnual
                  ? "bg-cabe-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Tagihan Tahunan</span>
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                Hemat 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-cabe-500 shadow-2xl shadow-cabe-950/50 scale-105"
                    : "bg-slate-950/80 border border-slate-800/80 hover:border-slate-700"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cabe-600 to-cabe-500 text-white px-4 py-1 rounded-full text-xs font-extrabold shadow-md tracking-wider uppercase">
                    🔥 {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                    {!plan.popular && (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-6">{plan.description}</p>

                  <div className="mb-6 pb-6 border-b border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-slate-400">Rp</span>
                      <span className="text-4xl font-black text-white tracking-tight">
                        {price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">/bulan</span>
                    </div>
                    {isAnnual && (
                      <p className="text-[11px] font-bold text-emerald-400 mt-1">
                        Ditagih tahunan (Hemat Rp {((plan.priceMonthly - plan.priceAnnual) * 12).toLocaleString("id-ID")}/thn)
                      </p>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-xs text-slate-300 font-medium">
                        <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to="/register" className="w-full">
                  <Button
                    variant={plan.popular ? "primary" : "secondary"}
                    className={`w-full py-3.5 rounded-xl font-extrabold text-xs transition-all ${
                      plan.popular
                        ? "bg-cabe-600 hover:bg-cabe-500 text-white shadow-lg shadow-cabe-600/30"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Guarantees Note */}
        <p className="text-center text-xs text-slate-500 mt-10">
          * Semua paket gratis trial 14 hari penuh. Tanpa kartu kredit. Bebas batalkan kapan saja.
        </p>
      </div>
    </section>
  );
}
