# SMK Micro-Learning Platform API

A RESTful API for a vocational school (SMK) micro-learning platform built with Bun, Hono, Drizzle ORM, and SQLite.

## Tech Stack
- **Runtime:** Bun
- **Framework:** Hono
- **Database:** SQLite
- **ORM:** Drizzle ORM
- **Validation:** Zod

## Getting Started

### Installation
```bash
bun install
```

### Running the Server
```bash
bun run src/index.ts
```
The server runs on `http://localhost:3000`.

## Terminal Usage Guide (cURL Examples)

You can manage the platform directly from your terminal using `curl`.

### 1. Students (Siswa)

#### Get All Students
```bash
curl http://localhost:3000/students
```

#### Create Student
```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{
    "nisn": "12345",
    "full_name": "Budi Santoso",
    "major": "TKJ",
    "grade_level": 10
  }'
```

#### Delete Student
Replace `:id` with the actual Student ID (e.g., `33d917a3...`):
```bash
curl -X DELETE http://localhost:3000/students/:id
```

### 2. Materials (Materi)

#### Get All Materials
```bash
curl http://localhost:3000/materials
```

#### Create Material
```bash
curl -X POST http://localhost:3000/materials \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dasar Teknik Jaringan",
    "content": "Pengenalan OSI Layer dan TCP/IP...",
    "major_target": "TKJ"
  }'
```
*Note: Copy the `id` from the response to use in Quizzes.*

#### Delete Material
```bash
curl -X DELETE http://localhost:3000/materials/:id
```

### 3. Quizzes (Kuis)

#### Create Quiz Information
Link a quiz to a material ID (replace `MATERIAL_ID_HERE`):
```bash
curl -X POST http://localhost:3000/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "material_id": "MATERIAL_ID_HERE",
    "title": "Kuis Jaringan Dasar",
    "passing_score": 75
  }'
```

#### Add Questions to Quiz
Relace `QUIZ_ID_HERE` with the quiz ID from the previous step:
```bash
curl -X POST http://localhost:3000/quizzes/QUIZ_ID_HERE/questions \
  -H "Content-Type: application/json" \
  -d '[
    {
      "question_text": "Kepanjangan dari LAN adalah?",
      "question_type": "multiple_choice",
      "options": ["Local Area Network", "Long Area Network"],
      "correct_answer": "Local Area Network"
    }
  ]'
```

#### Submit Quiz (Auto-Grading)
```bash
curl -X POST http://localhost:3000/quizzes/submit-quiz \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "STUDENT_ID_HERE",
    "quiz_id": "QUIZ_ID_HERE",
    "answers": [
      { "question_id": "QUESTION_ID_HERE", "user_answer": "Local Area Network" }
    ]
  }'
```

## Database Management
The database is auto-managed using Drizzle Kit.
- **Push Schema Changes:** `bun x drizzle-kit push`

---

## 4. Billing (Kuota Gratis + Berbayar)

### Status Akses Siswa
Status akses yang digunakan di frontend:
- `free`: termasuk kuota gratis
- `paid`: sudah dibayar
- `grace`: masa tenggang aktif
- `blocked`: akses ditunda (belum dibayar)

### Get Billing Summary
Mengembalikan ringkasan tagihan per guru.
```bash
curl "http://localhost:3000/billing/summary?teacher_id=TEACHER_ID"
```

Contoh response:
```json
{
  "total_students": 18,
  "free_quota": 5,
  "paid_students": 13,
  "price_per_student": 1000,
  "amount_due": 13000,
  "grace_days": 7,
  "overdue_students": 4,
  "grace_students": 3
}
```

### Get Per-Student Billing Status
Mengembalikan status akses per siswa.
```bash
curl "http://localhost:3000/billing/students?teacher_id=TEACHER_ID"
```

Contoh response:
```json
[
  {
    "student_id": "STUDENT_ID_1",
    "status": "free",
    "grace_until": null,
    "paid_until": null
  },
  {
    "student_id": "STUDENT_ID_2",
    "status": "grace",
    "grace_until": "2025-02-12T23:59:59.000Z",
    "paid_until": null
  }
]
```

### Sync Students to Billing
Sinkron data siswa dari layanan utama ke billing.
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

### Pay Billing
Mencatat pembayaran dan mengaktifkan siswa berbayar.
```bash
curl -X POST http://localhost:3000/billing/pay \
  -H "Content-Type: application/json" \
  -d '{
    "teacher_id": "TEACHER_ID",
    "amount": 13000,
    "student_count": 13,
    "student_ids": ["STUDENT_ID_2", "STUDENT_ID_3"]
  }'
```

Contoh response:
```json
{
  "status": "ok",
  "paid_students": 13,
  "paid_until": "2025-03-01T00:00:00.000Z"
}
```

### Get Student Access (Login Gate)
Untuk memastikan akses siswa saat login.
```bash
curl "http://localhost:3000/billing/access?student_id=STUDENT_ID"
```

### Teacher Exemptions
Admin dapat membebaskan guru dari tagihan.

List:
```bash
curl http://localhost:3000/billing/teachers/exemptions
```

### Teacher Grace Policy
Atur masa tenggang (hari) per guru.

List:
```bash
curl http://localhost:3000/billing/teachers/policies
```

### Confirm Payment (Admin)
Konfirmasi pembayaran manual per guru (menandai siswa berbayar).
```bash
curl -X POST http://localhost:3000/billing/teachers/NIP_123/confirm-payment \
  -H "Content-Type: application/json" \
  -d '{ "period_days": 30 }'
```

### Billing Settings
Set URL pembayaran yang akan dibuka oleh guru.
```bash
curl -X POST http://localhost:3000/billing/settings \
  -H "Content-Type: application/json" \
  -d '{ "payment_url": "https://payment.example.com" }'
```

### Billing Payments History
```bash
curl http://localhost:3000/billing/payments?teacher_id=NIP_123
curl http://localhost:3000/billing/teachers/NIP_123/payments
```

Get:
```bash
curl http://localhost:3000/billing/settings
```
Set:
```bash
curl -X POST http://localhost:3000/billing/teachers/NIP_123/policy \
  -H "Content-Type: application/json" \
  -d '{ "grace_days": 3, "teacher_name": "Aan Triono" }'
```

Remove:
```bash
curl -X DELETE http://localhost:3000/billing/teachers/NIP_123/policy
```
Set:
```bash
curl -X POST http://localhost:3000/billing/teachers/NIP_123/exempt \
  -H "Content-Type: application/json" \
  -d '{ "reason": "Program bantuan sekolah" }'
```

Remove:
```bash
curl -X DELETE http://localhost:3000/billing/teachers/NIP_123/exempt
```

Contoh response:
```json
{
  "student_id": "STUDENT_ID",
  "status": "blocked",
  "grace_until": null,
  "paid_until": null
}
```
