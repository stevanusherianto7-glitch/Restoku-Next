import { Button } from "@shared/ui/atoms/Button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "99",
    period: "/bulan",
    description: "Cocok untuk warung & usaha kecil",
    features: [
      "1 outlet",
      "POS & kasir",
      "Menu digital (QR)",
      "Laporan dasar",
      "1 user",
    ],
    cta: "Mulai Gratis",
    variant: "secondary" as const,
    popular: false,
  },
  {
    name: "Professional",
    price: "299",
    period: "/bulan",
    description: "Cocok untuk restoran berkembang",
    features: [
      "3 outlet",
      "Semua fitur Starter",
      "Manajemen stok",
      "Laporan lengkap",
      "5 user",
      "Multi-pembayaran",
      "Integrasi delivery",
    ],
    cta: "Mulai Gratis",
    variant: "primary" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "799",
    period: "/bulan",
    description: "Cocok untuk jaringan restoran",
    features: [
      "Unlimited outlet",
      "Semua fitur Professional",
      "API access",
      "Custom branding",
      "Unlimited user",
      "Dedicated support",
      "SLA 99.9%",
    ],
    cta: "Hubungi Sales",
    variant: "secondary" as const,
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="harga" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Harga Sesuai Kebutuhan
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Mulai gratis, upgrade saat bisnis berkembang. Tanpa biaya tersembunyi.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.popular
                  ? "ring-2 ring-cabe-600 shadow-xl scale-105"
                  : "border border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cabe-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Paling Populer
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">Rp {plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/register">
                <Button variant={plan.variant} className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Semua paket termasuk free trial 14 hari. Tanpa kartu kredit.
        </p>
      </div>
    </section>
  );
}
