# Satgas PPKPT UAJY - Dashboard & Portal

Proyek ini adalah sistem informasi berbasis web untuk **Satuan Tugas Pencegahan dan Penanganan Kekerasan di Lingkungan Perguruan Tinggi (Satgas PPKPT)** di **Universitas Atma Jaya Yogyakarta (UAJY)**. Sistem ini mencakup portal publik untuk informasi/edukasi dan dashboard admin (CMS) untuk mengelola pelaporan, data master, dan konten situs.

## Teknologi Utama

Proyek ini dibangun menggunakan *stack* teknologi modern:

- **Framework Utama:** [Next.js](https://nextjs.org/) (App Router)
- **Bahasa Pemrograman:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database Engine:** MySQL
- **Ikon UI:** [Lucide React](https://lucide.dev/)

## Struktur Direktori Utama

- `app/`: Berisi routing *Next.js App Router* untuk halaman publik dan `/dashboard`.
- `app/api/`: Berisi *endpoint* API (REST API) internal yang dihubungkan ke database.
- `components/`: Berisi komponen-komponen React yang dapat digunakan ulang (UI *components*, *layout*, dan *dashboard components*).
- `prisma/`: Berisi skema database (`schema.prisma`) dan skrip migrasi/seeding awal (`seed.js`).
- `public/`: Direktori untuk menyimpan aset publik seperti gambar, ikon, dan juga *folder* `uploads/` untuk file-file dokumen/arsip.

## Fitur Utama

### 1. Portal Publik
- **Beranda & Edukasi:** Menampilkan informasi Satgas, kontak *hotline*, daftar berita, dan info layanan.
- **Pelaporan:** Layanan pelaporan untuk mahasiswa, dosen, atau karyawan berkaitan dengan kasus kekerasan.
- **Alur & Panduan:** Menampilkan alur pelaporan dan panduan sistem.

### 2. Dashboard CMS (Admin Panel)
- **Manajemen Akun/Role:** Kelola tim satgas, ketua, sekretaris, dan admin.
- **Daftar Laporan:** Kelola status laporan masuk, mulai dari verifikasi, investigasi, hingga selesai.
- **Arsip Dokumen:** (Dulunya Arsip SK) Fitur untuk mengunggah dan mengarsipkan berbagai jenis dokumen/file publik tanpa format ketat, cukup menyertakan *Judul Arsip* dan lampiran.
- **Kelola Konten / CMS:** Menambah artikel/berita, memperbarui statistik beranda, struktur profil/nilai Satgas, dan slider halaman beranda.
- **Master Data:** Kelola data Fakultas, Program Studi, dan Tahun Akademik.

## Alur Pengembangan (Developer Selanjutnya)

Jika Anda developer baru yang akan melanjutkan pengerjaan proyek ini, bacalah **`SETUP.md`** untuk panduan instalasi lokal dan seeding database.

### Pembaruan Skema Database
Apabila melakukan penambahan tabel atau perubahan struktur di dalam file `prisma/schema.prisma`, perbarui database lokal Anda dengan perintah:
```bash
npx prisma db push
```
*(Hindari menggunakan `prisma migrate dev` selama tahap prototyping cepat, kecuali jika Anda ingin melacak *history* migrasi SQL ketat untuk *production*).*

### Skrip Seed (`prisma/seed.js`)
Skrip *seed* (`seed.js`) telah diperbarui untuk menyertakan pendaftaran entri *default* bagi tabel-tabel konfigurasi tanpa-upload. Data seperti struktur fakultas, tahun akademik, role, konfigurasi beranda, dan profil satgas akan terbentuk secara otomatis pada saat di-*seed*.
