# Panduan Setup Project & Instalasi

Berikut adalah langkah-langkah untuk menjalankan proyek Satgas PPKPT di komputer lokal Anda (*development environment*).

## Prasyarat Lingkungan

Sebelum memulai, pastikan perangkat komputer Anda sudah terinstal:

1. **Node.js** (Disarankan versi LTS terbaru, e.g. v18.x atau v20.x)
2. **MySQL Server** (Anda dapat menggunakan XAMPP/MAMP atau _native service_ MySQL)
3. **Database Kosong**: Buat sebuah database baru dengan nama `ppkpt_uajy` di klien MySQL Anda (contoh: melalui phpMyAdmin atau MySQL Workbench).

---

## Langkah Instalasi

### 1. Install Dependencies

Buka terminal/command prompt di dalam folder utama proyek (sejajar dengan file `package.json`) lalu jalankan:

```bash
npm install
```

### 2. Konfigurasi Environment Variable (`.env`)

Buat sebuah file baru bernama `.env` di _root_ proyek. Anda tidak boleh men-commit file ini ke public repository. Isi file `.env` dengan *connection string* ke database lokal Anda:

```env
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL="mysql://root:@localhost:3306/ppkpt_uajy"
```

> **Catatan:**
> - Jika menggunakan **XAMPP default** di Windows, biasanya _password_ dikosongkan (`root:@localhost`).
> - Jika MySQL Anda memiliki _password_, ubahlah strukturnya menjadi contoh berikut: `mysql://root:password123@localhost:3306/ppkpt_uajy`.

### 3. Setup Database (Prisma Push)

Proyek ini menggunakan struktur ORM dari **Prisma**. Untuk membuat tabel-tabel di MySQL agar sinkron dengan definisi yang ada di `prisma/schema.prisma`, jalankan perintah:

```bash
npx prisma db push
```

> **Catatan:** Perintah `push` sangat berguna untuk menyamakan skema lokal dengan Prisma tanpa perlu melacak *history* migrasi (*migration history*).

### 4. Skrip Pengisian Data Awal (Seeding)

Aplikasi membutuhkan beberapa data bawaan seperti akun Super Admin, Role, Tahun Akademik, Fakultas, konfigurasi UI Beranda, dan sebagainya.

Jalankan perintah ini untuk memasukkan data-data tersebut ke dalam database:

```bash
npx prisma db seed
```

Apabila proses ini sukses, akan muncul pesan di terminal bahwa *seeding* telah berhasil (_"🌱 Mulai seeding database... ✅ Seed berhasil! Database telah terisi."_).

**Akun Admin Default:**
- **Email**: `admin@uajy.ac.id`
- **Password**: `admin123`

### 5. Menjalankan Server Development

Setelah dependencies terinstal dan database siap, jalankan server proyek dengan:

```bash
npm run dev
```

Buka URL **`http://localhost:3000`** melalui peramban (browser) Anda. Untuk masuk ke _dashboard_ admin, silakan kunjungi **`http://localhost:3000/login`** dan gunakan akun bawaan hasil *seeding*.

---

## Masalah Umum (Troubleshooting)

- **_"Unable to acquire lock" / Port 3000 In Use:_**
  Pastikan tidak ada instance terminal lain yang juga sedang menjalankan `npm run dev`. Anda bisa mematikan proses dengan perintah <kbd>Ctrl</kbd> + <kbd>C</kbd>. Menghapus folder `.next` kadang membantu mereset *cache* proyek.

- **_Database Connection Error / Invalid URL:_**
  Pastikan MySQL Service telah berjalan. Jika muncul pesan *Access Denied*, periksa kembali `DATABASE_URL` di file `.env` apakah sudah sesuai dengan pengaturan otentikasi MySQL Anda.

- **_Upload File Tidak Muncul / Error "ENOENT":_**
  Sistem akan otomatis mengabsen (membuat) folder `public/uploads/arsip` saat file pertama berhasil di-_upload_. Jika menjumpai kendala _read/write_, pastikan tidak ada perlindungan direktori yang menahan proses _write_ dari Node.js.
