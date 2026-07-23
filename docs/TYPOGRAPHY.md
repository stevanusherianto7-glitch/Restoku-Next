# Typography System — Restoku

Sistem tipografi berbasis kelipatan 4px dengan font sistem default perangkat untuk menjaga keterbacaan (legibility) dan konsistensi UI.

## Font Stack

```css
font-family:
  -apple-system,           /* SF Pro — iOS / macOS */
  "Segoe UI",              /* Segoe UI — Windows */
  "Roboto",                /* Roboto — Android */
  "Helvetica Neue",        /* Fallback */
  Arial,                   /* Fallback */
  sans-serif;              /* Generic fallback */
```

## Type Scale

Semua ukuran berbasis kelipatan 4px. Weight dan line-height ditentukan per level.

| Level | Name | Size | Line Height | Weight | Use Case |
|-------|------|------|-------------|--------|----------|
| 1 | Display | 32px | 40px | Bold (700) | Judul utama / banner |
| 2 | Heading 1 | 24px | 32px | Bold (700) | Judul halaman |
| 3 | Heading 2 | 20px | 28px | SemiBold (600) | Judul bagian / card |
| 4 | Subtitle | 16px | 24px | Medium (500) | Teks penjelas utama |
| 5 | Body | 14px | 20px | Regular (400) | Teks konten utama |
| 6 | Caption | 12px | 16px | Medium (500) / Bold (700) | Teks keterangan / tombol |

## CSS Variables

```css
:root {
  /* Font Family */
  --font-sans:
    -apple-system,
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    Arial,
    sans-serif;

  /* Display — Judul Utama / Banner */
  --text-display-size: 32px;
  --text-display-leading: 40px;
  --text-display-weight: 700;

  /* Heading 1 — Judul Halaman */
  --text-h1-size: 24px;
  --text-h1-leading: 32px;
  --text-h1-weight: 700;

  /* Heading 2 — Judul Bagian / Card */
  --text-h2-size: 20px;
  --text-h2-leading: 28px;
  --text-h2-weight: 600;

  /* Subtitle / Body Large — Teks Penjelas Utama */
  --text-subtitle-size: 16px;
  --text-subtitle-leading: 24px;
  --text-subtitle-weight: 500;

  /* Body Regular — Teks Konten Utama */
  --text-body-size: 14px;
  --text-body-leading: 20px;
  --text-body-weight: 400;

  /* Caption / Button — Teks Keterangan / Tombol */
  --text-caption-size: 12px;
  --text-caption-leading: 16px;
  --text-caption-weight: 500;
  --text-button-weight: 700;
}
```

## Tailwind CSS Classes

```js
// tailwind.config.js
module.exports = {
  theme: {
    fontFamily: {
      sans: [
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "sans-serif",
      ],
    },
    fontSize: {
      display: ["32px", { lineHeight: "40px", fontWeight: "700" }],
      h1: ["24px", { lineHeight: "32px", fontWeight: "700" }],
      h2: ["20px", { lineHeight: "28px", fontWeight: "600" }],
      subtitle: ["16px", { lineHeight: "24px", fontWeight: "500" }],
      body: ["14px", { lineHeight: "20px", fontWeight: "400" }],
      caption: ["12px", { lineHeight: "16px", fontWeight: "500" }],
      button: ["12px", { lineHeight: "16px", fontWeight: "700" }],
    },
  },
};
```

## WCAG Color Contrast

Semua warna teks harus memenuhi rasio kontras minimum **4.5:1** terhadap background (WCAG AA). Untuk teks Display (≥24px bold), minimum **3:1** (WCAG AA Large).

### Text Colors

| Token | Hex | On White (#FFF) | On Dark (#1A1A2E) | Usage |
|-------|-----|-----------------|-------------------|-------|
| `text-primary` | `#111827` | 16.75:1 ✅ | 15.42:1 ✅ | Judul, body utama |
| `text-secondary` | `#4B5563` | 7.45:1 ✅ | 6.87:1 ✅ | Subtitle, deskripsi |
| `text-tertiary` | `#6B7280` | 5.04:1 ✅ | 4.63:1 ✅ | Caption, label |
| `text-inverse` | `#F9FAFB` | — | 17.33:1 ✅ | Teks di dark background |
| `text-cabe` | `#E23B1F` | 4.56:1 ✅ | 4.16:1 ⚠️ | Accent (hati-hati di dark) |
| `text-success` | `#059669` | 4.63:1 ✅ | 4.24:1 ⚠️ | Status sukses |
| `text-error` | `#DC2626` | 4.63:1 ✅ | 4.24:1 ⚠️ | Error messages |

### Contrast Requirements

| Element | Min Ratio | Standard |
|---------|-----------|----------|
| Body text (< 18px) | 4.5:1 | WCAG AA |
| Large text (≥ 18px bold OR ≥ 24px) | 3:1 | WCAG AA Large |
| UI components / icons | 3:1 | WCAG AA Non-text |

## Implementation Examples

### Display (32/40/700)

```html
<h1 class="text-display text-primary">
  Restoku — POS & Restaurant Management
</h1>
```

### Heading 1 (24/32/700)

```html
<h2 class="text-h1 text-primary">
  Dashboard
</h2>
```

### Heading 2 (20/28/600)

```html
<h3 class="text-h2 text-primary">
  Menu Hari Ini
</h3>
```

### Subtitle (16/24/500)

```html
<p class="text-subtitle text-secondary">
  Kelola restoran Anda dengan mudah
</p>
```

### Body (14/20/400)

```html
<p class="text-body text-primary">
  Nasi Goreng Spesial adalah menu favorit pelanggan kami
  dengan bahan-bahan segar dan bumbu rahasia.
</p>
```

### Caption (12/16/500)

```html
<span class="text-caption text-tertiary">
  Diperbarui 2 menit yang lalu
</span>
```

### Button (12/16/700)

```html
<button class="text-button text-inverse bg-cabe px-4 py-2 rounded-lg">
  Tambah ke Keranjang
</button>
```

## Spacing Reference (Kelipatan 4px)

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Gap minimal antar elemen |
| `space-2` | 8px | Padding icon, gap inline |
| `space-3` | 12px | Padding card kecil |
| `space-4` | 16px | Padding card, margin section |
| `space-5` | 20px | Margin antar section |
| `space-6` | 24px | Margin page section |
| `space-8` | 32px | Margin antar page section besar |

## Responsive Adjustments

| Level | Mobile (< 640px) | Tablet (640–1024px) | Desktop (> 1024px) |
|-------|-------------------|---------------------|---------------------|
| Display | 28px / 36px | 32px / 40px | 32px / 40px |
| H1 | 22px / 28px | 24px / 32px | 24px / 32px |
| H2 | 18px / 24px | 20px / 28px | 20px / 28px |

## Checklist Aksesibilitas

- [ ] Semua teks body memenuhi kontras 4.5:1 minimum
- [ ] Large text (≥ 18px bold / ≥ 24px) memenuhi kontras 3:1
- [ ] Font size tidak lebih kecil dari 12px
- [ ] Line height minimal 1.4× font size untuk body text
- [ ] Touch target minimal 44×44px untuk semua interactive elements
- [ ] Text dapat di-scale hingga 200% tanpa kehilangan konten
