# Mathflix Billing API

Backend billing service (Bun + Hono + Drizzle + SQLite) untuk kuota gratis 5 siswa dan Rp 1.000 per siswa.

## Setup

1) Install dependencies
```bash
bun install
```

2) Push schema ke SQLite
```bash
bun x drizzle-kit push
```

3) Jalankan server
```bash
bun run src/index.ts
```

Server berjalan di `http://localhost:3000`.

## Env

- `PORT` (default 3000)
- `DB_URL` (default `./data/billing.db`)
- `FREE_STUDENT_QUOTA` (default 5)
- `PRICE_PER_STUDENT` (default 1000)
- `GRACE_DAYS` (default 7)
- `BILLING_PERIOD_DAYS` (default 30)

## Endpoints

- `GET /billing/summary?teacher_id=...`
- `GET /billing/students?teacher_id=...`
- `POST /billing/students/sync`
- `GET /billing/teachers/exemptions`
- `POST /billing/teachers/:teacherId/exempt`
- `DELETE /billing/teachers/:teacherId/exempt`
- `GET /billing/teachers/policies`
- `POST /billing/teachers/:teacherId/policy`
- `DELETE /billing/teachers/:teacherId/policy`
- `POST /billing/teachers/:teacherId/confirm-payment`
- `GET /billing/settings`
- `POST /billing/settings`
- `GET /billing/payments`
- `GET /billing/teachers/:teacherId/payments`
- `POST /billing/pay`
- `GET /billing/access?student_id=...`

Detail kontrak ada di `../api-mathflix.md`.

## Catatan

- Tabel `students` perlu terisi agar perhitungan kuota dan status akses berjalan.
- Data siswa bisa diimpor/sinkronisasi dari service utama Mathflix.

### Sinkronisasi Siswa (contoh)
```bash
curl -X POST http://localhost:3000/billing/students/sync \
  -H "Content-Type: application/json" \
  -d '[
    {
      "id": "STUDENT_ID",
      "nisn": "12345",
      "full_name": "Budi Santoso",
      "teacher_id": "NIP_123",
      "teacher_name": "Ibu Dina",
      "created_at": "2025-02-01T09:00:00.000Z"
    }
  ]'
```

### Script batch sync (dari API utama ke billing)
```bash
MAIN_API_URL=http://localhost:3000 BILLING_API_URL=http://localhost:3000 \\
  bun run scripts/sync-students.ts
```

Filter per guru:
```bash
TEACHER_ID=NIP_123 MAIN_API_URL=http://localhost:3000 BILLING_API_URL=http://localhost:3000 \\
  bun run scripts/sync-students.ts
```
