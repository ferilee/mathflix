<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Manajemen Guru</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Tambahkan guru baru agar dapat login menggunakan NIP, nama lengkap, dan asal sekolah.
      </p>

      <form @submit.prevent="handleAdd" class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">NIP</label>
          <input
            v-model="form.nip"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600"
            placeholder="1987xxxxxx"
            required
          />
          <p class="text-[10px] text-gray-500 mt-2">Gunakan NIP resmi yang unik.</p>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Nama Lengkap</label>
          <input
            v-model="form.full_name"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600"
            placeholder="Nama lengkap guru"
            required
          />
          <p class="text-[10px] text-gray-500 mt-2">Sesuai data admin, gunakan kapital yang konsisten.</p>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Asal Sekolah</label>
          <input
            v-model="form.school"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600"
            placeholder="SMK Negeri ..."
            required
          />
          <p class="text-[10px] text-gray-500 mt-2">Contoh: SMK Negeri 1.</p>
        </div>
        <div class="md:col-span-3 flex items-center justify-between gap-4">
          <div v-if="error" class="text-xs text-red-500">{{ error }}</div>
          <div v-else-if="success" class="text-xs text-emerald-600">{{ success }}</div>
          <button type="submit" class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
            Simpan Guru
          </button>
        </div>
      </form>
    </div>

    <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-gray-800 dark:text-white">Import CSV Guru</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Format kolom: <span class="font-semibold">nip, full_name, school</span> (baris pertama boleh header).
          </p>
        </div>
        <button
          type="button"
          class="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 disabled:opacity-60"
          :disabled="!importFile || importLoading"
          @click="handleImportCsv"
        >
          {{ importLoading ? 'Mengimpor...' : 'Import CSV' }}
        </button>
      </div>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div class="md:col-span-2">
          <input
            type="file"
            accept=".csv,text/csv"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600"
            @change="(e) => { resetImportMessages(); importFile = (e.target as HTMLInputElement).files?.[0] || null; }"
          />
          <p class="text-[10px] text-gray-500 mt-2">
            Gunakan pemisah koma atau titik koma. Baris kosong akan diabaikan.
          </p>
        </div>
        <div class="text-xs">
          <div v-if="importError" class="text-red-500">{{ importError }}</div>
          <div v-else-if="importSuccess" class="text-emerald-600">{{ importSuccess }}</div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded shadow overflow-x-auto transition-colors">
      <div class="p-6 flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-800 dark:text-white">Daftar Guru</h2>
        <button @click="refresh" class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Muat Ulang</button>
      </div>
      <table class="min-w-[900px] divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead class="bg-gray-50 dark:bg-slate-700">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">NIP</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sekolah</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jumlah Siswa</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status Tagihan</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Masa Tenggang</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Terdaftar</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="teacher in teachers" :key="teacher.id">
            <td class="px-4 py-3 text-gray-700 dark:text-gray-200">{{ teacher.nip }}</td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-200">{{ teacher.full_name }}</td>
            <td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ teacher.school }}</td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-200">
              {{ getStudentCount(teacher) }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-200">
              <div class="flex items-center gap-2">
                <span v-if="isExempt(teacher)" class="px-2 py-1 text-xs font-bold rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Bebas Bayar</span>
                <span v-else class="px-2 py-1 text-xs font-bold rounded bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Normal</span>
                <button
                  type="button"
                  class="text-xs text-indigo-600 dark:text-indigo-300 hover:underline"
                  @click="toggleExemption(teacher)"
                >
                  {{ isExempt(teacher) ? 'Batalkan' : 'Bebaskan' }}
                </button>
                <button
                  type="button"
                  class="text-xs text-emerald-600 dark:text-emerald-300 hover:underline"
                  @click="confirmPayment(teacher)"
                >
                  Konfirmasi Bayar
                </button>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-200">
              <div class="flex items-center gap-2">
                <input
                  :value="getGraceInput(teacher)"
                  type="number"
                  min="0"
                  class="w-20 border border-gray-300 rounded px-2 py-1 text-xs bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600"
                  @input="(e) => graceInputByTeacherId[teacher.nip] = (e.target as HTMLInputElement).value"
                  placeholder="Default"
                />
                <button
                  type="button"
                  class="text-xs text-indigo-600 dark:text-indigo-300 hover:underline"
                  @click="saveGracePolicy(teacher)"
                >
                  Simpan
                </button>
              </div>
              <div class="text-[10px] text-gray-400 mt-1">
                Kosongkan untuk default ({{ GRACE_DAYS_DEFAULT }} hari)
              </div>
            </td>
            <td class="px-4 py-3 text-gray-500 dark:text-gray-400">
              {{ new Date(teacher.created_at).toLocaleDateString() }}
            </td>
            <td class="px-4 py-3 text-right">
              <button @click="remove(teacher.id)" class="text-red-600 hover:text-red-700">Hapus</button>
              <button @click="openPayments(teacher)" class="ml-3 text-indigo-600 hover:text-indigo-700">Riwayat</button>
            </td>
          </tr>
          <tr v-if="teachers.length === 0">
            <td colspan="8" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              Belum ada guru terdaftar.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showPayments" class="fixed inset-0 z-[120] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/70" @click="closePayments"></div>
      <div class="relative w-[92%] max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6">
        <div class="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white">Riwayat Pembayaran</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ paymentsTeacher?.full_name || '' }}</p>
          </div>
          <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" @click="closePayments">✕</button>
        </div>
        <div v-if="paymentsLoading" class="text-sm text-slate-500">Memuat...</div>
        <div v-else-if="payments.length === 0" class="text-sm text-slate-500">Belum ada pembayaran.</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th class="py-2 pr-4">Tanggal</th>
                <th class="py-2 pr-4">Jumlah</th>
                <th class="py-2 pr-4">Siswa</th>
                <th class="py-2 pr-4">Aktif Hingga</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pay in payments" :key="pay.id" class="border-b border-slate-200 dark:border-slate-800">
                <td class="py-2 pr-4 text-slate-700 dark:text-slate-200">{{ new Date(pay.createdAt || pay.created_at).toLocaleString() }}</td>
                <td class="py-2 pr-4 text-slate-700 dark:text-slate-200">Rp {{ pay.amount }}</td>
                <td class="py-2 pr-4 text-slate-700 dark:text-slate-200">{{ pay.studentCount || pay.student_count }}</td>
                <td class="py-2 pr-4 text-slate-700 dark:text-slate-200">{{ new Date(pay.paidUntil || pay.paid_until).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { addTeacherAccount, getTeacherAccounts, removeTeacherAccount } from '../utils/teachers';
import api from '../api';
import { useDialog } from '../utils/dialog';
import {
  fetchTeacherExemptions,
  setTeacherExemption,
  removeTeacherExemption,
  fetchTeacherPolicies,
  setTeacherPolicy,
  removeTeacherPolicy,
  confirmTeacherPayment,
  fetchTeacherPayments
} from '../utils/billing';

const teachers = ref<any[]>([]);
const form = ref({
  nip: '',
  full_name: '',
  school: '',
});
const error = ref('');
const success = ref('');
const importFile = ref<File | null>(null);
const importLoading = ref(false);
const importError = ref('');
const importSuccess = ref('');
const studentCountByTeacherId = ref<Record<string, number>>({});
const studentCountByTeacherName = ref<Record<string, number>>({});
const exemptTeacherIds = ref<Set<string>>(new Set());
const graceDaysByTeacherId = ref<Record<string, number>>({});
const graceInputByTeacherId = ref<Record<string, string>>({});
const GRACE_DAYS_DEFAULT = 7;
const showPayments = ref(false);
const payments = ref<any[]>([]);
const paymentsLoading = ref(false);
const paymentsTeacher = ref<any>(null);
const dialog = useDialog();

const refresh = async () => {
  teachers.value = await getTeacherAccounts();
  await fetchStudentCounts();
  await fetchExemptions();
  await fetchPolicies();
};

const resetMessages = () => {
  error.value = '';
  success.value = '';
};

const resetImportMessages = () => {
  importError.value = '';
  importSuccess.value = '';
};

const normalizeCsvHeader = (value: string) => {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
};

const detectDelimiter = (line: string) => {
  let comma = 0;
  let semicolon = 0;
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (!inQuotes) {
      if (char === ',') comma += 1;
      if (char === ';') semicolon += 1;
    }
  }
  return semicolon > comma ? ';' : ',';
};

const parseCsvLine = (line: string, delimiter: string) => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (!inQuotes && char === delimiter) {
      result.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  result.push(current.trim());
  return result;
};

const parseCsv = (text: string): { rows: string[][]; delimiter: string } => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (lines.length === 0) return { rows: [], delimiter: ',' };
  const delimiter = detectDelimiter(lines[0] ?? '');
  const rows = lines.map((line) => parseCsvLine(line, delimiter));
  return { rows, delimiter };
};

const handleAdd = async () => {
  resetMessages();
  try {
    const created = await addTeacherAccount({
      nip: form.value.nip,
      full_name: form.value.full_name,
      school: form.value.school,
    });
    teachers.value = [created, ...teachers.value];
    form.value = { nip: '', full_name: '', school: '' };
    success.value = 'Guru berhasil ditambahkan.';
  } catch (err: any) {
    error.value = err?.response?.data?.error || err?.message || 'Gagal menambahkan guru.';
  }
};

const handleImportCsv = async () => {
  if (!importFile.value) return;
  resetImportMessages();
  importLoading.value = true;
  try {
    const text = await importFile.value.text();
    const { rows } = parseCsv(text);
    if (!rows.length) {
      importError.value = 'File CSV kosong atau tidak valid.';
      return;
    }

    const headerMap: Record<number, 'nip' | 'full_name' | 'school'> = {};
    const headerRow = (rows[0] ?? []).map((cell) => normalizeCsvHeader(cell ?? ''));
    headerRow.forEach((value, index) => {
      if (value === 'nip' || value === 'nomorindukpegawai') headerMap[index] = 'nip';
      if (value === 'fullname' || value === 'namalengkap' || value === 'nama') headerMap[index] = 'full_name';
      if (value === 'school' || value === 'sekolah' || value === 'asalsekolah') headerMap[index] = 'school';
    });
    const headerIndexes = {
      nip: Object.keys(headerMap).map(Number).find((key) => headerMap[key] === 'nip') ?? null,
      full_name: Object.keys(headerMap).map(Number).find((key) => headerMap[key] === 'full_name') ?? null,
      school: Object.keys(headerMap).map(Number).find((key) => headerMap[key] === 'school') ?? null,
    };
    const hasHeader = headerIndexes.nip !== null && headerIndexes.full_name !== null && headerIndexes.school !== null;

    const dataRows = hasHeader ? rows.slice(1) : rows;
    if (!dataRows.length) {
      importError.value = 'CSV hanya berisi header tanpa data.';
      return;
    }

    const existingNips = new Set(teachers.value.map((teacher) => String(teacher.nip).trim()));
    const uniqueNips = new Set<string>();
    const toCreate: Array<{ nip: string; full_name: string; school: string }> = [];
    let skipped = 0;

    dataRows.forEach((row) => {
      const getValue = (index: number) => String(row[index] ?? '').trim();
      const nip = hasHeader ? getValue(headerIndexes.nip as number) : getValue(0);
      const full_name = hasHeader ? getValue(headerIndexes.full_name as number) : getValue(1);
      const school = hasHeader ? getValue(headerIndexes.school as number) : getValue(2);

      if (!nip || !full_name || !school) {
        skipped += 1;
        return;
      }
      const normalizedNip = String(nip).trim();
      if (existingNips.has(normalizedNip) || uniqueNips.has(normalizedNip)) {
        skipped += 1;
        return;
      }
      uniqueNips.add(normalizedNip);
      toCreate.push({ nip: normalizedNip, full_name, school });
    });

    if (toCreate.length === 0) {
      importError.value = 'Tidak ada data baru untuk diimpor.';
      return;
    }

    let added = 0;
    let failed = 0;
    for (const payload of toCreate) {
      try {
        await addTeacherAccount(payload);
        added += 1;
      } catch (err) {
        failed += 1;
      }
    }
    await refresh();
    importSuccess.value = `Import selesai: ${added} ditambahkan, ${skipped} dilewati, ${failed} gagal.`;
    importFile.value = null;
  } finally {
    importLoading.value = false;
  }
};

const remove = async (id: string) => {
  const ok = await dialog.confirm('Hapus data guru ini?', 'Hapus Guru');
  if (!ok) return;
  try {
    await removeTeacherAccount(id);
    await refresh();
  } catch (err: any) {
    await dialog.alert(err?.response?.data?.error || err?.message || 'Gagal menghapus guru.', 'Hapus Guru');
  }
};

const fetchStudentCounts = async () => {
  try {
    const { data } = await api.get('/students', { params: { page: 1, limit: 5000 } });
    const students = data?.data || data || [];
    const byId: Record<string, number> = {};
    const byName: Record<string, number> = {};
    students.forEach((student: any) => {
      const id = student.teacher_id || student.teacherId;
      const name = student.teacher_name || student.teacherName;
      if (id) byId[id] = (byId[id] || 0) + 1;
      if (name) byName[name] = (byName[name] || 0) + 1;
    });
    studentCountByTeacherId.value = byId;
    studentCountByTeacherName.value = byName;
  } catch (e) {
    studentCountByTeacherId.value = {};
    studentCountByTeacherName.value = {};
  }
};

const getStudentCount = (teacher: any) => {
  const byId = studentCountByTeacherId.value[teacher.nip];
  if (byId != null) return byId;
  const byName = studentCountByTeacherName.value[teacher.full_name];
  return byName ?? 0;
};

const fetchExemptions = async () => {
  try {
    const rows = await fetchTeacherExemptions();
    exemptTeacherIds.value = new Set(rows.map((row: any) => row.teacherId || row.teacher_id).filter(Boolean));
  } catch (e) {
    exemptTeacherIds.value = new Set();
  }
};

const isExempt = (teacher: any) => {
  return exemptTeacherIds.value.has(teacher.nip);
};

const toggleExemption = async (teacher: any) => {
  const teacherId = teacher.nip;
  if (!teacherId) return;
  if (isExempt(teacher)) {
    const ok = await dialog.confirm(
      `Batalkan bebas bayar untuk ${teacher.full_name}?`,
      'Batalkan Bebas Bayar',
    );
    if (!ok) return;
    try {
      await removeTeacherExemption(teacherId);
      await fetchExemptions();
    } catch (err: any) {
      await dialog.alert(err?.response?.data?.error || err?.message || 'Gagal memperbarui status tagihan.');
    }
    return;
  }

  const reason = await dialog.prompt(
    `Alasan pembebasan (opsional) untuk ${teacher.full_name}:`,
    'Bebaskan Tagihan',
    'Misalnya: program sekolah',
  );
  if (reason === null) return;
  try {
    await setTeacherExemption(teacherId, {
      reason: reason || '',
      teacher_name: teacher.full_name,
    });
    await fetchExemptions();
  } catch (err: any) {
    await dialog.alert(err?.response?.data?.error || err?.message || 'Gagal memperbarui status tagihan.');
  }
};

const confirmPayment = async (teacher: any) => {
  const teacherId = teacher?.nip;
  if (!teacherId) return;
  const ok = await dialog.confirm(
    `Konfirmasi pembayaran untuk ${teacher.full_name}?`,
    'Konfirmasi Pembayaran',
  );
  if (!ok) return;
  try {
    const result = await confirmTeacherPayment(teacherId);
    if (result?.paid_students === 0) {
      await dialog.alert('Tidak ada siswa berbayar. Status tetap aman.', 'Info Pembayaran');
      return;
    }
    await dialog.alert('Pembayaran dikonfirmasi.', 'Info Pembayaran');
  } catch (err: any) {
    await dialog.alert(err?.response?.data?.error || err?.message || 'Gagal konfirmasi pembayaran.');
  }
};

const openPayments = async (teacher: any) => {
  paymentsTeacher.value = teacher;
  showPayments.value = true;
  paymentsLoading.value = true;
  try {
    payments.value = await fetchTeacherPayments(teacher.nip, 100);
  } catch (err: any) {
    await dialog.alert(err?.response?.data?.error || err?.message || 'Gagal memuat riwayat pembayaran.');
    payments.value = [];
  } finally {
    paymentsLoading.value = false;
  }
};

const closePayments = () => {
  showPayments.value = false;
  paymentsTeacher.value = null;
};

const fetchPolicies = async () => {
  try {
    const rows = await fetchTeacherPolicies();
    graceDaysByTeacherId.value = rows.reduce((acc: Record<string, number>, row: any) => {
      if (row?.teacherId || row?.teacher_id) {
        const key = row.teacherId || row.teacher_id;
        acc[key] = Number(row.graceDays ?? row.grace_days ?? 0);
      }
      return acc;
    }, {});
    graceInputByTeacherId.value = { ...graceInputByTeacherId.value };
  } catch (e) {
    graceDaysByTeacherId.value = {};
  }
};

const getGraceInput = (teacher: any) => {
  const key = teacher.nip;
  if (!graceInputByTeacherId.value[key]) {
    const value = graceDaysByTeacherId.value[key];
    graceInputByTeacherId.value[key] = value != null ? String(value) : '';
  }
  return graceInputByTeacherId.value[key];
};

const saveGracePolicy = async (teacher: any) => {
  const key = teacher.nip;
  if (!key) return;
  const raw = graceInputByTeacherId.value[key] ?? '';
  try {
    if (raw.trim() === '') {
      await removeTeacherPolicy(key);
      await fetchPolicies();
      await dialog.alert('Masa tenggang dikembalikan ke default.', 'Info Masa Tenggang');
      return;
    }
    const value = Number(raw);
    if (Number.isNaN(value) || value < 0 || !Number.isFinite(value)) {
      await dialog.alert('Nilai masa tenggang harus berupa angka >= 0.', 'Info Masa Tenggang');
      return;
    }
    await setTeacherPolicy(key, { grace_days: value, teacher_name: teacher.full_name });
    await fetchPolicies();
    await dialog.alert('Masa tenggang berhasil disimpan.', 'Info Masa Tenggang');
  } catch (err: any) {
    await dialog.alert(err?.response?.data?.error || err?.message || 'Gagal menyimpan masa tenggang.');
  }
};

onMounted(refresh);
</script>
