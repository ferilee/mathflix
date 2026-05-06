# Panduan RustFS untuk Mathflix

Dokumen ini menjelaskan cara mengganti MinIO menjadi RustFS sebagai object storage S3-compatible.

## 1. Perubahan yang sudah diterapkan

- Service `minio` di [`docker-compose.yml`](/home/ferilee/DEV/Mathflix2/docker-compose.yml) diganti menjadi `rustfs`.
- Image diganti ke `rustfs/rustfs:latest`.
- Container name diganti jadi `mathflix-rustfs`.
- Volume data diganti ke `/home/ferilee/mathflix-rustfs/data:/data`.
- Port tetap:
  - `9000` untuk S3 API
  - `9005` (host) -> `9001` (container) untuk console
- Kredensial disetel via env:
  - `RUSTFS_ACCESS_KEY=admin`
  - `RUSTFS_SECRET_KEY=password123`

## 2. Jalankan RustFS

```bash
docker compose up -d rustfs
```

Cek status:

```bash
docker compose ps
docker logs mathflix-rustfs
```

## 3. Endpoint yang dipakai aplikasi

- S3 endpoint: `http://localhost:9000`
- Console RustFS: `http://localhost:9005`
- Bucket default (sesuai `.env`): `mathflix`

## 4. Konfigurasi environment

Di [`.env`](/home/ferilee/DEV/Mathflix2/.env):

- Variabel `MINIO_*` tetap dipertahankan untuk kompatibilitas backend lama.
- Variabel `RUSTFS_*` juga ditambahkan jika backend sudah mendukung pembacaan langsung variabel RustFS.

Jika backend Anda hanya membaca `MINIO_*`, tidak perlu ubah kode backend.
Jika backend membaca `RUSTFS_*`, Anda bisa migrasi pembacaan env secara bertahap.

## 5. Verifikasi cepat dengan MinIO Client (`mc`)

```bash
mc alias set rustfs http://localhost:9000 admin password123
mc mb rustfs/mathflix
mc ls rustfs
```

Jika bucket bisa dibuat dan dilist, RustFS sudah siap dipakai.

## 6. Catatan migrasi dari MinIO

1. RustFS tetap S3-compatible, jadi SDK/logic upload biasanya tidak perlu diubah.
2. Pastikan path volume lama MinIO tidak tercampur dengan volume RustFS baru.
3. Untuk produksi, ganti kredensial default `admin/password123`.

## Referensi

- RustFS Docker install: https://docs.rustfs.com/installation/docker/
- RustFS image: https://hub.docker.com/r/rustfs/rustfs
