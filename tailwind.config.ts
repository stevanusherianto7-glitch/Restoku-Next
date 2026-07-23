import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: [
        "'Plus Jakarta Sans'",
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "sans-serif",
      ],
      display: [
        "'Outfit'",
        "'Plus Jakarta Sans'",
        "sans-serif",
      ],
      mono: [
        "'JetBrains Mono'",
        "monospace",
      ],
    },
    fontSize: {
      // Level 1: Display — Judul Utama / Banner
      display: ["2.25rem", { lineHeight: "2.75rem", fontWeight: "800", letterSpacing: "-0.02em" }],
      // Level 2: Heading 1 — Judul Halaman
      h1: ["1.75rem", { lineHeight: "2.25rem", fontWeight: "700", letterSpacing: "-0.015em" }],
      // Level 3: Heading 2 — Judul Bagian / Card
      h2: ["1.375rem", { lineHeight: "1.875rem", fontWeight: "700", letterSpacing: "-0.01em" }],
      // Level 4: Subtitle — Teks Penjelas Utama
      subtitle: ["1rem", { lineHeight: "1.5rem", fontWeight: "600" }],
      // Level 5: Body — Teks Konten Utama
      body: ["0.875rem", { lineHeight: "1.375rem", fontWeight: "400" }],
      // Level 6a: Caption — Teks Keterangan
      caption: ["0.75rem", { lineHeight: "1.125rem", fontWeight: "500" }],
      // Level 6b: Button — Teks Tombol
      button: ["0.75rem", { lineHeight: "1rem", fontWeight: "700", letterSpacing: "0.01em" }],
      // Utility sizes for fine-grained control
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      "5xl": ["3rem", { lineHeight: "1.1" }],
      "6xl": ["3.75rem", { lineHeight: "1.05" }],
      "7xl": ["4.5rem", { lineHeight: "1.02" }],
    },
    extend: {
      colors: {
        cabe: {
          50: "#fff1f0",
          100: "#ffe0dd",
          200: "#ffc7c1",
          300: "#ffa196",
          400: "#ff6b56",
          500: "#ff5b35",
          600: "#e23b1f",
          700: "#c12f16",
          800: "#9f2915",
          900: "#842719",
          950: "#480f07",
        },
        emas: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#f59e0b",
          500: "#f4731c",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
      },
      spacing: {
        "0.5": "2px",
        "1": "4px",
        "1.5": "6px",
        "2": "8px",
        "2.5": "10px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
      },
      borderRadius: {
        none: "0",
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
} satisfies Config;
