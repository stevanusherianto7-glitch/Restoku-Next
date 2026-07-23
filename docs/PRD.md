# PRD: Restoku - Sistem POS & Manajemen Restoran

**Version:** 1.0
**Date:** July 2026
**Status:** Draft

---

## Executive Summary

Restoku adalah platform SaaS POS (Point of Sale) dan manajemen restoran yang dirancang khusus untuk 2.000+ restoran dan warung lokal Indonesia. Platform ini menyediakan solusi all-in-one untuk mengelola pesanan, inventaris, staf, dan keuangan dengan antarmuka yang intuitif dan terjangkau.

Dengan fokus pada kemudahan penggunaan dan harga yang sesuai UMKM Indonesia, Restoku membantu pemilik usaha fokus pada kualitas makanan dan pelayanan, sementara aspek operasional digital ditangani oleh sistem yang andal.

---

## Problem Statement

### Masalah Utama

1. **Fragmentasi Sistem** — Restoran kecil menggunakan aplikasi terpisah untuk POS, inventaris, dan manajemen staf, menyebabkan inkonsistensi data dan ineffisiensi.

2. **Harga Mahal** — Solusi POS yang ada (Moka, Pawoon, iReap) memiliki biaya berlangganan yang terlalu tinggi untuk warung dan restoran kecil.

3. **Kompleksitas** — Banyak sistem POS yang terlalu rumit untuk staf dengan tingkat literasi digital rendah.

4. **Kurangnya Analitik** — Pemilik restoran kesulitan mendapatkan insight real-time tentang penjualan, inventaris, dan performa bisnis.

### Pain Points

| Persona | Pain Point | Impact |
|---------|------------|--------|
| Pemilik Warung | Tidak bisa melihat laporan penjualan real-time | Keputusan bisnis tidak data-driven |
| Kasir | Proses checkout lambat | Antrian panjang, pelanggan tidak puas |
| Koki | Tidak tahu bahan habis | Pesanan tertunda, pembatalan |
| Manajer | Kesulitan mengelola jadwal staf | Overstaffing/understaffing |

---

## Goals & Objectives

### Business Goals

1. **Akuisisi** — Mendapatkan 500 restoran aktif dalam 6 bulan pertama
2. **Retensi** — Mencapai churn rate < 5% per bulan
3. **Revenue** — Mencapai MRR Rp 500 juta dalam 12 bulan

### Product Objectives

1. **Kemudahan Penggunaan** — Staf dapat menggunakan sistem dalam < 1 jam pelatihan
2. **Kecepatan** — Proses checkout < 30 detik
3. **Reliabilitas** — Uptime 99.9% (support offline mode)
4. **Analitik** — Laporan penjualan real-time tersedia dalam < 5 detik

---

## User Personas

### Persona 1: Pak Budi (Pemilik Warung)

- **Usia:** 45 tahun
- **Usaha:** Warung Padang, 5 meja
- **Tech Savvy:** Rendah
- **Kebutuhan:** Laporan penjualan harian, manajemen stok sederhana
- **Frustrasi:** Aplikasi yang rumit, internet tidak stabil

### Persona 2: Sari (Kasir)

- **Usia:** 22 tahun
- **Pekerjaan:** Kasir di restoran keluarga
- **Tech Savvy:** Sedang
- **Kebutuhan:** Checkout cepat, cetak struk, proses pembayaran
- **Frustrasi:** Sistem lambat, error saat bayar

### Persona 3: Mas Rendi (Koki)

- **Usia:** 35 tahun
- **Pekerjaan:** Koki di restoran seafood
- **Tech Savvy:** Rendah
- **Kebutuhan:** Lihat daftar pesanan, update status masak
- **Frustrasi:** Komunikasi lambat dengan kasir

### Persona 4: Ibu Dewi (Manajer)

- **Usia:** 38 tahun
- **Pekerjaan:** Manajer operasional di cabang
- **Tech Savvy:** Sedang-Tinggi
- **Kebutuhan:** Laporan multi-cabang, manajemen staf, inventaris
- **Frustrasi:** Tidak ada dashboard terpadu

### Persona 5: Rina (Tamu/Pelanggan)

- **Usia:** 28 tahun
- **Pekerjaan:** Karyawan swasta
- **Tech Savvy:** Tinggi
- **Kebutuhan:** Lihat menu cepat, pesan tanpa antri
- **Frustrasi:** Menu fisik kotor/hilang, harus menunggu kasir

---

## User Stories & Requirements

### Epic 1: Autentikasi & Manajemen Pengguna

#### US-1.1: Login
Sebagai **kasir**, saya ingin **login ke sistem** sehingga **saya dapat mengakses POS**.

**Acceptance Criteria:**
- [ ] Login dengan email dan password
- [ ] Session berlaku selama 12 jam
- [ ] Error message jelas jika kredensial salah
- [ ] Redirect ke POS setelah login berhasil

#### US-1.2: Manajemen Role
Sebagai **pemilik**, saya ingin **mengatur hak akses staf** sehingga **mereka hanya bisa mengakses fitur yang sesuai**.

**Acceptance Criteria:**
- [ ] 5 role: Owner, Manager, Cashier, Kitchen, **Waiter** (sesuai `navigation.ts` & `Role` type di frontend)
- [ ] Owner bisa akses semua fitur
- [ ] Cashier hanya bisa akses POS dan laporan
- [ ] Kitchen hanya bisa akses daftar pesanan
- [ ] **Waiter** bisa akses pelayanan meja & bar display

---

### Epic 2: Point of Sale (POS)

#### US-2.1: Proses Pesanan
Sebagai **kasir**, saya ingin **membuat pesanan baru** sehingga **pelanggan dapat membayar**.

**Acceptance Criteria:**
- [ ] Pilih menu dari daftar/kategori
- [ ] Ubah jumlah item
- [ ] Tambah catatan khusus
- [ ] Hitung total otomatis
- [ ] Proses checkout < 30 detik

#### US-2.2: Pembayaran
Sebagai **kasir**, saya ingin **menerima berbagai metode pembayaran** sehingga **pelanggan memiliki fleksibilitas**.

**Acceptance Criteria:**
- [ ] Tunai (dengan kembalian otomatis)
- [ ] QRIS
- [ ] Kartu debit/kredit
- [ ] GoPay, OVO, Dana
- [ ] Struk otomatis

#### US-2.3: Pelacakan Pesanan
Sebagai **koki**, saya ingin **melihat daftar pesanan masuk** sehingga **saya bisa memprosesnya secara real-time**.

**Acceptance Criteria:**
- [ ] Notifikasi saat pesanan baru
- [ ] Tampilkan detail pesanan
- [ ] Update status (diterima → dimasak → selesai)
- [ ] Tampilan untuk layar kitchen

---

### Epic 3: Manajemen Menu

#### US-3.1: CRUD Menu
Sebagai **pemilik**, saya ingin **mengelola menu makanan** sehingga **daftar menu selalu up-to-date**.

**Acceptance Criteria:**
- [ ] Tambah/hapus/edit menu
- [ ] Upload foto makanan
- [ ] Atur harga per varian
- [ ] Kategorikan menu (makanan, minuman, tambahan)
- [ ] Atur status (tersedia/tidak tersedia)

#### US-3.2: Modifiers & Variants
Sebagai **pemilik**, saya ingin **menambahkan varian menu** sehingga **pelanggan bisa memilih opsi**.

**Acceptance Criteria:**
- [ ] Varian ukuran (S, M, L)
- [ ] Level kepedasan
- [ ] Topping tambahan
- [ ] Harga dinamis per varian

---

### Epic 4: Manajemen Inventaris

#### US-4.1: Tracking Stok
Sebagai **manajer**, saya ingin **memantau stok bahan** sehingga **kami tidak kehabisan saat masak**.

**Acceptance Criteria:**
- [ ] Daftar bahan dengan stok saat ini
- [ ] Auto-deduct saat ada pesanan
- [ ] Notifikasi stok rendah
- [ ] Riwayat penggunaan

#### US-4.2: Restock
Sebagai **manajer**, saya ingin **mencatat restock** sehingga **stok selalu akurat**.

**Acceptance Criteria:**
- [ ] Input jumlah dan harga beli
- [ ] Hitung rata-rata harga beli
- [ ] Riwayat restock
- [ ] Laporan biaya bahan

---

### Epic 5: Laporan & Analitik

#### US-5.1: Laporan Penjualan
Sebagai **pemilik**, saya ingin **melihat laporan penjualan** sehingga **saya bisa mengevaluasi performa bisnis**.

**Acceptance Criteria:**
- [ ] Laporan harian/mingguan/bulanan
- [ ] Breakdown per kategori menu
- [ ] Grafik tren penjualan
- [ ] Export ke PDF/Excel

#### US-5.2: Dashboard Real-time
Sebagai **manajer**, saya ingin **melihat dashboard real-time** sehingga **saya bisa memantau operasional**.

**Acceptance Criteria:**
- [ ] Penjualan hari ini
- [ ] Pesanan aktif
- [ ] Status stok
- [ ] Performa staf

---

### Epic 6: Manajemen Staf

#### US-6.1: Jadwal Staf
Sebagai **manajer**, saya ingin **membuat jadwal kerja** sehingga **shift terorganisir dengan baik**.

**Acceptance Criteria:**
- [ ] Buat jadwal mingguan
- [ ] Assign staf ke shift
- [ ] Deteksi konflik jadwal
- [ ] Notifikasi jadwal ke staf

#### US-6.2: Absensi
Sebagai **manajer**, saya ingin **melacak kehadiran staf** sehingga **gaji dapat dihitung akurat**.

**Acceptance Criteria:**
- [ ] Clock in/out dengan GPS
- [ ] Verifikasi lokasi
- [ ] Laporan kehadiran
- [ ] Export untuk payroll

---

### Epic 7: Buku Menu Digital (Guest-Facing)

#### US-7.1: Akses Menu via QR Code
Sebagai **tamu**, saya ingin **scan QR code di meja** sehingga **saya bisa melihat menu tanpa permintaan physical menu**.

**Acceptance Criteria:**
- [ ] QR code unik per meja (contoh: `/menu/{restaurantId}?table=5`)
- [ ] Buka halaman menu langsung tanpa login
- [ ] Tampilkan nama restoran & logo
- [ ] Responsive mobile-first (320px - 768px)
- [ ] Load time < 2 detik

#### US-7.2: Browsing Menu
Sebagai **tamu**, saya ingin **menjelajahi menu** sehingga **saya bisa memilih makanan/minuman yang ingin dipesan**.

**Acceptance Criteria:**
- [ ] Tampilkan semua kategori menu
- [ ] Filter per kategori
- [ ] Search menu (nama)
- [ ] Tampilkan foto, nama, harga, deskripsi
- [ ] Tampilkan status (tersedia / habis)
- [ ] Tampilkan menu populer / rekomendasi

#### US-7.3: Detail Menu & Varian
Sebagai **tamu**, saya ingin **melihat detail menu** sehingga **saya tahu opsi yang tersedia**.

**Acceptance Criteria:**
- [ ] Tampilkan foto besar (lightbox)
- [ ] Tampilkan varian (ukuran, level kepedasan)
- [ ] Tampilkan harga per varian
- [ ] Tampilkan bahan/alergen (opsional)
- [ ] Tampilkan rating (jika ada)

#### US-7.4: QR Ordering (Optional)
Sebagai **tamu**, saya ingin **pesan langsung dari HP** sehingga **tidak perlu menunggu kasir**.

**Acceptance Criteria:**
- [ ] Tambahkan item ke keranjang
- [ ] Pilih varian sebelum tambah
- [ ] Tambah catatan khusus
- [ ] Kirim pesanan ke POS
- [ ] Notifikasi pesanan diterima
- [ ] Tidak perlu login (guest checkout)

#### US-7.5: Kelola QR Code (Admin)
Sebagai **pemilik**, saya ingin **mengelola QR code meja** sehingga **setiap meja memiliki link yang benar**.

**Acceptance Criteria:**
- [ ] Generate QR code per meja
- [ ] Custom nama meja (Meja 1, VIP, Teras)
- [ ] Download QR code sebagai gambar
- [ ] Print QR code (format A4)
- [ ] Disable/enable meja tertentu

#### US-7.6: Promo & Highlight di Menu Digital
Sebagai **pemilik**, saya ingin **menampilkan promo** sehingga **tamu tertarik memesan menu tertentu**.

**Acceptance Criteria:**
- [ ] Flag menu sebagai "Promo" / "Best Seller" / "Baru"
- [ ] Tampilkan banner promo di atas menu
- [ ] Highlight menu dengan warna/badge
- [ ] Atur urutan menu (manual/otomatis)

---

## Success Metrics

### AARRR Framework

| Stage | Metric | Target |
|-------|--------|--------|
| **Acquisition** | Restoran terdaftar | 500 dalam 6 bulan |
| **Activation** | Restoran aktif (≥1 transaksi/minggu) | 70% dari terdaftar |
| **Retention** | Churn rate | < 5% per bulan |
| **Revenue** | MRR | Rp 500 juta dalam 12 bulan |
| **Referral** | Referral rate | 20% dari restoran aktif |

### HEART Framework

| Dimension | Metric | Target |
|-----------|--------|--------|
| **Happiness** | NPS Score | ≥ 50 |
| **Engagement** | Transaksi per hari per restoran | ≥ 30 |
| **Adoption** | Restoran yang upgrade ke paid | ≥ 60% |
| **Retention** | Restoran aktif setelah 3 bulan | ≥ 80% |
| **Task Success** | Checkout selesai tanpa error | ≥ 99% |

### North Star Metric

**Transaksi sukses per bulan** — Mengukur value inti yang diberikan Restoku kepada restoran.

---

## Scope

### In Scope (MVP - Phase 1)

- [ ] Autentikasi & manajemen pengguna (4 role)
- [ ] POS (pesanan, pembayaran, struk)
- [ ] Manajemen menu (CRUD, kategori, varian)
- [ ] **Buku Menu Digital (QR menu untuk tamu)**
- [ ] Dashboard real-time
- [ ] Laporan penjualan dasar
- [ ] Multi-outlet (satu restoran, banyak cabang)
- [ ] Offline mode (sinkronisasi saat online)

### In Scope (Phase 2)

- [ ] Manajemen inventaris lengkap
- [ ] Manajemen staf & jadwal
- [ ] Laporan lanjutan & analitik
- [ ] Integrasi delivery (GoFood, GrabFood)
- [ ] Loyalty program

### Out of Scope

- [ ] Reservasi meja
- [ ] Sistem akuntansi lengkap
- [ ] Integrasi dengan sistem pihak ketiga (selain payment gateway)
- [ ] Mobile app (fokus web responsive)
- [ ] Multi-bahasa (fokus Bahasa Indonesia)

---

## Technical Considerations

### Architecture

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Laravel 13 (13.19) + PHP 8.2+ (Hexagonal Architecture)
- **Database:** PostgreSQL 15
- **Cache:** Redis
- **Queue:** Laravel Queue (Redis)
- **Real-time:** Laravel Reverb (WebSocket) — *belum di-wire ke frontend*
- **Frontend data mode:** MSW (Mock Service Worker) saat `VITE_USE_MOCKS=true` — SPA bisa jalan penuh tanpa backend
- **Deployment:** Docker + VPS (lihat DEPLOYMENT-STAGING.md)

### Performance Requirements

| Metric | Target |
|--------|--------|
| API Response Time | < 200ms (p95) |
| Page Load Time | < 2s (First Contentful Paint) |
| Time to Interactive | < 3s |
| Uptime | 99.9% |

### Security Requirements

- [ ] HTTPS everywhere
- [ ] JWT authentication with refresh token
- [ ] Rate limiting (100 req/min per user)
- [ ] Input validation & sanitization
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection

---

## Design & UX Requirements

### Brand Identity

- **Primary Color:** Cabe `#e23b1f` / `#FF5B35`
- **Secondary Color:** Emas `#f4731c` / `#F59E0B`
- **Font:** Inter (sans-serif)
- **Border Radius:** Rounded-lg (8px)

### Design Principles

1. **Simplicity** — Antarmuka harus intuitif, bisa dipahami tanpa pelatihan
2. **Speed** — Setiap interaksi harus cepat (< 100ms response)
3. **Clarity** — Informasi harus jelas, hindari clutter
4. **Consistency** — Pola yang sama di seluruh aplikasi

### Responsive Breakpoints

- **Mobile:** 320px - 768px (POS utama)
- **Tablet:** 768px - 1024px (Dashboard)
- **Desktop:** 1024px+ (Manajemen, Laporan)

---

## Timeline & Milestones

### Phase 1: MVP (4 bulan)

| Week | Milestone |
|------|-----------|
| 1-2 | Setup project, autentikasi |
| 3-4 | POS core (pesanan, pembayaran) |
| 5-6 | Manajemen menu |
| 7-8 | Dashboard & laporan dasar |
| 9-10 | Multi-outlet, offline mode |
| 11-12 | Testing, bug fixing |
| 13-16 | Beta testing, iteration |
| 17 | **Launch MVP** |

### Phase 2: Enhancement (3 bulan)

| Week | Milestone |
|------|-----------|
| 18-20 | Manajemen inventaris |
| 21-23 | Manajemen staf & jadwal |
| 24-26 | Integrasi delivery |
| 27 | **Launch Phase 2** |

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Internet tidak stabil di warung | High | High | Offline mode dengan sinkronisasi |
| User tidak tech-savvy | High | High | UI sederhana, onboarding yang baik |
| Kompetitor (Moka, Pawoon) | Medium | High | Fokus pada harga terjangkau & fitur lokal |
| Perubahan regulasi QRIS | Low | Medium | Abstraksi payment gateway |
| Skalabilitas | Medium | Low | Architecture yang scalable sejak awal |

---

## Dependencies & Assumptions

### Dependencies

1. Payment gateway (Midtrans/Xendit) untuk QRIS & e-wallet
2. Hosting provider dengan SLA 99.9%
3. Tim development 2-3 orang
4. Desainer UI/UX

### Assumptions

1. Target user memiliki akses internet minimal 3G
2. Perangkat yang digunakan minimal Android 7+ / iOS 12+
3. Restoran memiliki minimal 1 perangkat (HP/tablet)
4. Transaksi per hari per restoran < 500

---

## Open Questions

1. Apakah perlu support multi-language di MVP?
2. Bagaimana strategi pricing yang tepat untuk warung?
3. Apakah integrasi dengan printer struk Bluetooth diperlukan?
4. Bagaimana cara handling offline mode untuk pembayaran QRIS?

---

## Appendix

### Glossary

| Term | Definition |
|------|------------|
| POS | Point of Sale — sistem kasir digital |
| QRIS | Quick Response Indonesian Standard — kode QR pembayaran |
| MRR | Monthly Recurring Revenue |
| Churn Rate | Persentase customer yang berhenti berlangganan |
| NPS | Net Promoter Score |

### References

1. [Moka POS](https://mokapos.com/)
2. [Pawoon](https://pawoon.com/)
3. [iReap](https://ireappos.com/)
4. [Midtrans](https://midtrans.com/)
5. [Xendit](https://xendit.com/)
