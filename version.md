# Mathflix Version Management Guide

Dokumen ini menjelaskan cara melakukan *Bumping* (menaikkan versi) dan *Dumping* (menampilkan/mencatat versi) pada aplikasi Mathflix.

## 1. Struktur Versi
Mathflix menggunakan standar **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`
- **PATCH**: Perbaikan bug (misal: `1.0.0` -> `1.0.1`)
- **MINOR**: Penambahan fitur baru yang kompatibel (misal: `1.0.1` -> `1.1.0`)
- **MAJOR**: Perubahan besar/breaking changes (misal: `1.1.0` -> `2.0.0`)

---

## 2. Cara Bumping Version

### Menggunakan Bun (Direkomendasikan)
Anda dapat menaikkan versi langsung melalui file `package.json`. Namun, untuk otomatisasi, gunakan perintah berikut di terminal:

```bash
# Untuk Patch (Bug Fixes)
npm version patch

# Untuk Minor (Fitur Baru)
npm version minor

# Untuk Major (Perubahan Besar)
npm version major
```
*Catatan: Perintah ini akan otomatis memperbarui `package.json` dan membuat git tag jika folder tersebut adalah repository Git.*

### Bumping Manual
Buka `package.json` di root atau di folder `mathflix-billing`, lalu ubah nilai pada field `"version"`:
```json
{
  "name": "mathflix-guru",
  "version": "1.0.5",
  ...
}
```

---

## 3. Cara Dumping Version

*Dumping* di sini berarti mengekstrak versi saat ini untuk ditampilkan di UI atau log.

### Di Frontend (Vite)
Untuk menampilkan versi di halaman "Tentang" atau "Footer":

1.  Buka file `.env` dan tambahkan:
    ```env
    VITE_APP_VERSION=$npm_package_version
    ```
2.  Atau akses langsung di Vue component:
    ```javascript
    import packageJson from '../package.json';
    const appVersion = packageJson.version;
    ```

### Di Backend (Hono/Bun)
Untuk mencatat versi saat server dinyalakan:
```typescript
import pkg from './package.json';
console.log(`[Mathflix] Service: ${pkg.name} | Version: ${pkg.version}`);
```

---

## 4. Automasi dengan Script
Tambahkan script berikut ke `package.json` Anda untuk memudahkan proses:

```json
"scripts": {
  "bump:patch": "npm version patch",
  "bump:minor": "npm version minor",
  "version:dump": "echo Current Version: $npm_package_version"
}
```

### Cara Menjalankan:
```bash
# Menaikkan versi patch
bun run bump:patch

# Melihat versi saat ini
bun run version:dump
```

---

## 5. Sinkronisasi Antar Layanan
Pastikan saat melakukan rilis besar, Anda melakukan bumping baik di **Frontend** maupun di **Mathflix-Billing** agar versi tetap sinkron dan memudahkan debugging.

---
*Last Updated: 2026-04-30*
