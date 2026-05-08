# 🦀 Panduan Konfigurasi RustFS untuk Mathflix

Dokumen ini menjelaskan cara menggunakan **RustFS** sebagai pengganti MinIO untuk penyimpanan objek (S3-compatible) di ekosistem Mathflix.

## 🚀 Apa itu RustFS?

**RustFS** adalah sistem penyimpanan objek terdistribusi yang ditulis dalam bahasa Rust. Ini dirancang untuk kecepatan tinggi, keamanan memori, dan kompatibilitas penuh dengan protokol **Amazon S3**.

### Keunggulan dibandingkan MinIO:
- **Performa Tinggi:** Optimal dalam menangani file kecil.
- **Memory Safe:** Dibangun dengan Rust, meminimalkan bug terkait memori.
- **Ringan:** Footprint resource yang lebih kecil dibandingkan Java-based storage.

## 🛠️ Konfigurasi Global
Layanan RustFS kini telah dipindahkan ke folder pusat agar bisa digunakan oleh semua proyek:
👉 [**_infrastructure/docker-compose.yml**](../_infrastructure/docker-compose.yml)

### Cara Menjalankan Layanan Pusat:
1. Masuk ke folder infrastruktur: `cd ../_infrastructure`
2. Jalankan: `docker compose up -d`

---

## 📄 Pengaturan Proyek Mathflix (`.env`)
Pastikan file [`.env`](./.env) di proyek ini sudah terkonfigurasi untuk menyambung ke RustFS global:

Pastikan file [`.env`](./.env) Anda sudah menggunakan variabel `RUSTFS_*`:

```env
# RustFS Configuration (S3-compatible)
RUSTFS_ENDPOINT=localhost
RUSTFS_PORT=9000
RUSTFS_ACCESS_KEY=admin
RUSTFS_SECRET_KEY=password123
RUSTFS_BUCKET=mathflix
RUSTFS_USE_SSL=false

# URL untuk akses publik dari frontend
VITE_STORAGE_URL=http://localhost:9000/mathflix
```

---

## 🏗️ Cara Menjalankan

1. **Jalankan container:**
   ```bash
   docker compose up -d rustfs
   ```

2. **Akses Console Web:**
   Buka [http://localhost:9005](http://localhost:9005) di browser Anda.
   - **Username:** `admin`
   - **Password:** `password123`

3. **Buat Bucket:**
   Di dalam console, buatlah bucket baru dengan nama `mathflix` (atau sesuai dengan `RUSTFS_BUCKET` di `.env`).

---

## 🔍 Verifikasi dengan MinIO Client (`mc`)

Walaupun kita menggunakan RustFS, Anda tetap bisa menggunakan tool `mc` (MinIO Client) karena RustFS sepenuhnya S3-compatible.

```bash
# Tambahkan alias
mc alias set rustfs http://localhost:9000 admin password123

# Buat bucket jika belum ada
mc mb rustfs/mathflix

# List isi bucket
mc ls rustfs/mathflix
```

---

## ⚠️ Catatan Migrasi

1. **Hapus Data Lama:** Folder `minio_data` telah dihapus. Pastikan Anda tidak memiliki data penting di sana sebelum melakukan pembersihan total.
2. **Kredensial:** Untuk lingkungan produksi, segera ganti `RUSTFS_ACCESS_KEY` dan `RUSTFS_SECRET_KEY` dengan nilai yang lebih aman.
3. **Endpoint API:** Jika backend Anda sebelumnya menggunakan library S3, cukup ganti `endpoint` ke `http://localhost:9000` dan matikan `forcePathStyle` (biasanya `true` untuk S3-compatible).

---
*Dibuat dengan ❤️ untuk Mathflix.*
