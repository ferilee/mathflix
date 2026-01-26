const MAIN_API_URL = process.env.MAIN_API_URL || 'http://localhost:3000';
const BILLING_API_URL = process.env.BILLING_API_URL || 'http://localhost:3000';
const TEACHER_ID = process.env.TEACHER_ID || '';
const LIMIT = Number(process.env.LIMIT || 500);

const fetchJson = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
};

const postJson = async (url: string, body: any) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
};

const buildStudentPayload = (row: any) => ({
  id: row.id,
  nisn: row.nisn,
  full_name: row.full_name || row.fullName,
  teacher_id: row.teacher_id || TEACHER_ID || row.teacherId || null,
  teacher_name: row.teacher_name || row.teacherName || null,
  created_at: row.created_at || row.createdAt
});

const run = async () => {
  let page = 1;
  let totalPages = 1;
  let synced = 0;

  while (page <= totalPages) {
    const url = new URL('/students', MAIN_API_URL);
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(LIMIT));
    if (TEACHER_ID) {
      url.searchParams.set('teacher_id', TEACHER_ID);
    }

    const data = await fetchJson(url.toString());
    const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    totalPages = Number(data?.totalPages || (rows.length === LIMIT ? page + 1 : page));

    if (rows.length === 0) break;

    const payload = rows.map(buildStudentPayload).filter((row: any) => row.id);
    if (payload.length > 0) {
      await postJson(`${BILLING_API_URL}/billing/students/sync`, payload);
      synced += payload.length;
    }

    page += 1;
  }

  console.log(`[sync] done. synced ${synced} students.`);
};

run().catch((err) => {
  console.error('[sync] failed:', err);
  process.exit(1);
});
