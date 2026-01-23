<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Ringkasan Aktivitas Siswa</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Pantau materi terakhir dan durasi sesi belajar.</p>
        </div>
        <button
          @click="refreshData"
          class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-bold shadow transition"
        >
          Refresh
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="xl:col-span-2 bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors min-w-0">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div class="md:col-span-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari Nama Siswa atau ID..."
              class="w-full border p-2 rounded bg-gray-50 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <select v-model="filterMajor" class="w-full border p-2 rounded bg-gray-50 dark:bg-slate-700 dark:border-gray-600 dark:text-white">
              <option value="">Semua Jurusan</option>
              <option v-for="major in MAJOR_OPTIONS" :key="major.value" :value="major.value">{{ major.label }}</option>
            </select>
          </div>
          <div>
            <select v-model="filterGrade" class="w-full border p-2 rounded bg-gray-50 dark:bg-slate-700 dark:border-gray-600 dark:text-white">
              <option value="">Semua Kelas</option>
              <option value="10">Kelas 10</option>
              <option value="11">Kelas 11</option>
              <option value="12">Kelas 12</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="refreshData"
              class="w-full bg-slate-800 text-white font-bold py-2 px-4 rounded hover:bg-slate-900 transition"
            >
              Muat Ulang
            </button>
          </div>
        </div>

        <div v-if="loading" class="text-gray-500 italic">Memuat data siswa...</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-white">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kelas</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aktivitas Terakhir</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Durasi</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="student in students"
                :key="student.id"
                class="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                @click="selectStudent(student)"
              >
                <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 font-mono">{{ student.nisn }}</td>
                <td class="px-4 py-3 text-sm font-medium">{{ student.full_name }}</td>
                <td class="px-4 py-3 text-sm">{{ student.grade_level }} {{ student.major }}</td>
                <td class="px-4 py-3 text-sm">
                  <span v-if="getLatestEntry(student.id)">
                    {{ getLatestEntry(student.id)?.title }}
                  </span>
                  <span v-else class="text-gray-400">Belum ada aktivitas</span>
                </td>
                <td class="px-4 py-3 text-sm">
                  <span v-if="getLatestEntry(student.id)">
                    {{ getLatestEntry(student.id)?.duration ? formatDuration(getLatestEntry(student.id)?.duration) : '-' }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
              </tr>
              <tr v-if="students.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Belum ada data siswa.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="totalPages > 1" class="mt-6 flex flex-col md:flex-row md:flex-wrap justify-between items-center gap-4 bg-gray-50 dark:bg-slate-700 p-4 rounded border dark:border-gray-600 max-w-full">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Menampilkan {{ students.length }} dari {{ totalStudents }} siswa
          </div>
          <div class="flex items-center gap-2 flex-wrap max-w-full">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 bg-white dark:bg-slate-800 border rounded hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed dark:text-white dark:border-gray-600"
            >
              Sebelumnya
            </button>
            <div class="flex gap-1 overflow-x-auto max-w-full md:max-w-none">
              <button
                v-for="p in totalPages"
                :key="p"
                @click="currentPage = p"
                class="px-3 py-1 border rounded transition"
                :class="currentPage === p ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-600 dark:text-white dark:border-gray-600'"
              >
                {{ p }}
              </button>
            </div>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 bg-white dark:bg-slate-800 border rounded hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed dark:text-white dark:border-gray-600"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
        <div v-if="!selectedStudent" class="text-gray-500 dark:text-gray-400">
          Pilih siswa untuk melihat detail sesi belajar.
        </div>
        <div v-else>
          <div class="mb-4">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white">{{ selectedStudent.full_name }}</h3>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ selectedStudent.grade_level }} {{ selectedStudent.major }}</div>
          </div>

          <div v-if="sessionsLoading" class="text-gray-500 italic">Memuat sesi...</div>
          <div v-else-if="studentSessions.length === 0" class="text-gray-500">Belum ada sesi tercatat.</div>
          <div v-else class="space-y-3">
            <div v-for="session in studentSessions" :key="session.id" class="border border-gray-200 dark:border-slate-700 rounded p-3">
              <div class="flex items-center justify-between">
                <div class="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                  {{ session.title }}
                </div>
                <span
                  class="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                  :class="session.type === 'reflection' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'"
                >
                  {{ session.type === 'reflection' ? 'Jurnal' : 'Belajar' }}
                </span>
              </div>
              <div v-if="session.duration_seconds" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Durasi: {{ formatDuration(session.duration_seconds) }}
              </div>
              <div class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Waktu: {{ formatDate(session.timestamp) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import api from '../api';
import { MAJOR_OPTIONS } from '../constants/majors';

interface Student {
  id: string;
  nisn: string;
  full_name: string;
  major: string;
  grade_level: number;
}

const students = ref<Student[]>([]);
const activityByStudentId = ref<Record<string, any>>({});
const reflectionByStudentId = ref<Record<string, any>>({});
const selectedStudent = ref<Student | null>(null);
const studentSessions = ref<any[]>([]);
const sessionsLoading = ref(false);
const loading = ref(true);
let pollingInterval: ReturnType<typeof setInterval> | null = null;

const searchQuery = ref('');
const filterMajor = ref('');
const filterGrade = ref('');
const currentPage = ref(1);
const totalStudents = ref(0);
const totalPages = ref(0);
const itemsPerPage = ref(10);

const fetchStudents = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/students', {
      params: {
        page: currentPage.value,
        limit: itemsPerPage.value,
        search: searchQuery.value,
        major: filterMajor.value,
        grade: filterGrade.value
      }
    });
    students.value = data.data || [];
    totalStudents.value = data.total || 0;
    totalPages.value = data.totalPages || 0;
    await fetchLatestActivity();
    await fetchLatestReflections();
  } catch (e) {
    console.error('Gagal mengambil data siswa', e);
  } finally {
    loading.value = false;
  }
};

const fetchLatestActivity = async () => {
  if (students.value.length === 0) {
    activityByStudentId.value = {};
    return;
  }
  try {
    const ids = students.value.map((s) => s.id).join(',');
    const { data } = await api.get('/activity/latest', { params: { student_ids: ids } });
    const map: Record<string, any> = {};
    (Array.isArray(data) ? data : []).forEach((row: any) => {
      if (row?.student_id) map[row.student_id] = row;
    });
    activityByStudentId.value = map;
  } catch (e) {
    console.error('Gagal mengambil aktivitas siswa', e);
  }
};

const fetchLatestReflections = async () => {
  if (students.value.length === 0) {
    reflectionByStudentId.value = {};
    return;
  }
  try {
    const ids = students.value.map((s) => s.id).join(',');
    const { data } = await api.get('/reflections/latest', { params: { student_ids: ids } });
    const map: Record<string, any> = {};
    (Array.isArray(data) ? data : []).forEach((row: any) => {
      if (row?.student_id) map[row.student_id] = row;
    });
    reflectionByStudentId.value = map;
  } catch (e) {
    console.error('Gagal mengambil refleksi siswa', e);
  }
};

const normalizeTimestamp = (value?: number | string | null) => {
  if (!value) return 0;
  const num = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(num)) return 0;
  return num < 1e12 ? num * 1000 : num;
};

const getLatestEntry = (studentId: string) => {
  const activity = activityByStudentId.value[studentId];
  const reflection = reflectionByStudentId.value[studentId];
  if (!activity && !reflection) return null;

  const activityTime = normalizeTimestamp(activity?.ended_at || activity?.started_at);
  const reflectionTime = normalizeTimestamp(reflection?.created_at);

  if (reflection && reflectionTime >= activityTime) {
    return {
      type: 'reflection',
      title: `Jurnal: ${reflection.topic || 'Umum'}`,
      timestamp: reflection.created_at,
      duration: null
    };
  }

  return {
    type: 'activity',
    title: activity?.material_title || 'Materi tidak diketahui',
    timestamp: activity?.ended_at || activity?.started_at,
    duration: activity?.duration_seconds || null
  };
};

const fetchStudentSessions = async (studentId: string) => {
  sessionsLoading.value = true;
  try {
    const [activityRes, reflectionRes] = await Promise.all([
      api.get('/activity', { params: { student_id: studentId, limit: 25 } }),
      api.get('/reflections', { params: { student_id: studentId } })
    ]);

    const activitySessions = (Array.isArray(activityRes.data) ? activityRes.data : []).map((row: any) => ({
      id: row.id,
      type: 'activity',
      title: row.material_title || 'Materi tidak diketahui',
      duration_seconds: row.duration_seconds,
      timestamp: row.ended_at || row.started_at
    }));

    const reflectionSessions = (Array.isArray(reflectionRes.data) ? reflectionRes.data : []).map((row: any) => ({
      id: row.id,
      type: 'reflection',
      title: `Jurnal: ${row.topic || 'Umum'}`,
      duration_seconds: null,
      timestamp: row.created_at
    }));

    const merged = [...activitySessions, ...reflectionSessions].sort((a, b) => {
      return normalizeTimestamp(b.timestamp) - normalizeTimestamp(a.timestamp);
    });

    studentSessions.value = merged;
    if (studentSessions.value.length === 0 && activityByStudentId.value[studentId]) {
      const fallback = activityByStudentId.value[studentId];
      studentSessions.value = [{
        id: fallback.id,
        type: 'activity',
        title: fallback.material_title || 'Materi tidak diketahui',
        duration_seconds: fallback.duration_seconds,
        timestamp: fallback.ended_at || fallback.started_at
      }];
    }
  } catch (e) {
    console.error('Gagal mengambil sesi siswa', e);
    if (activityByStudentId.value[studentId]) {
      const fallback = activityByStudentId.value[studentId];
      studentSessions.value = [{
        id: fallback.id,
        type: 'activity',
        title: fallback.material_title || 'Materi tidak diketahui',
        duration_seconds: fallback.duration_seconds,
        timestamp: fallback.ended_at || fallback.started_at
      }];
    } else {
      studentSessions.value = [];
    }
  } finally {
    sessionsLoading.value = false;
  }
};

const selectStudent = (student: Student) => {
  selectedStudent.value = student;
  fetchStudentSessions(student.id);
};

const refreshData = () => {
  fetchStudents();
  if (selectedStudent.value) {
    fetchStudentSessions(selectedStudent.value.id);
  }
};

const formatDuration = (seconds?: number | null) => {
  if (!seconds || seconds <= 0) return 'Durasi tidak tersedia';
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins < 1) return `${secs}s`;
  return `${mins}m ${secs}s`;
};

const formatDate = (value?: number | string | null) => {
  if (!value) return '-';
  const date = new Date(normalizeTimestamp(value));
  return date.toLocaleString();
};

watch([searchQuery, filterMajor, filterGrade], () => {
  currentPage.value = 1;
  fetchStudents();
});

watch(currentPage, fetchStudents);

onMounted(() => {
  fetchStudents();
  pollingInterval = setInterval(() => {
    fetchLatestActivity();
    fetchLatestReflections();
    if (selectedStudent.value) {
      fetchStudentSessions(selectedStudent.value.id);
    }
  }, 5000);
});

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>
