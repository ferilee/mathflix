<template>
  <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
    <div class="mb-6 flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded shadow border dark:border-gray-700">
      <div>
         <h2 class="text-lg font-bold text-gray-800 dark:text-white">Tambah Siswa</h2>
         <p class="text-sm text-gray-500 dark:text-gray-400">Input manual atau Import CSV (ID, Nama Siswa, Kelas, Jurusan, Sekolah)</p>
      </div>
      <div class="flex gap-4">
          <!-- CSV Import trigger -->
          <label class="cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold flex items-center gap-2 shadow transition">
             <span>📂 Import CSV</span>
             <input type="file" @change="handleFileUpload" accept=".csv" class="hidden">
          </label>
          <button
            @click="showForm = !showForm"
            class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-bold shadow transition"
          >
            {{ showForm ? 'Batal' : 'Manual Input' }}
          </button>
      </div>
    </div>

    <!-- Create/Edit Form -->
    <div v-if="showForm" class="mb-8 bg-gray-50 dark:bg-slate-700 p-6 rounded border dark:border-gray-600 shadow-inner">
      <h3 class="font-bold mb-6 text-gray-800 dark:text-white">Tambah Siswa Baru</h3>
      <form @submit.prevent="saveStudent" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput v-model="form.nisn" label="ID (NISN)" id="s_nisn" required />
        <FloatingInput v-model="form.full_name" label="Nama Siswa" id="s_name" required />
        <FloatingInput v-model="form.school" label="Sekolah" id="s_school" required />

        <div class="relative z-0 w-full mb-6 group">
            <select v-model="form.major" id="s_major" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer">
              <option class="text-black" value="" disabled>Pilih Jurusan</option>
              <option v-for="major in MAJOR_OPTIONS" :key="major.value" :value="major.value" class="text-black">{{ major.label }}</option>
            </select>
            <label for="s_major" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Jurusan</label>
        </div>

        <FloatingInput v-model="form.grade_level" type="number" label="Kelas" id="s_grade" required />

        <div class="md:col-span-2 flex justify-end">
          <button type="submit" class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 font-bold shadow">Simpan Data</button>
        </div>
      </form>
    </div>

    <!-- Filters -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-6 gap-4">
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
            <input
              v-model="filterSchool"
              type="text"
              placeholder="Sekolah..."
              class="w-full border p-2 rounded bg-gray-50 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
            />
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
                v-if="searchQuery || filterMajor || filterGrade"
                @click="handleBulkDelete"
                class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow transition flex items-center justify-center gap-2"
            >
                <span>🗑️ Hapus Sesuai Filter</span>
            </button>
        </div>
    </div>

    <!-- List Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-white">
        <thead class="bg-gray-50 dark:bg-slate-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID (NISN)</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Siswa</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jurusan</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sekolah</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kelas</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aktivitas Terakhir</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="student in students" :key="student.id" class="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 font-mono">{{ student.nisn }}</td>
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ student.full_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-0.5 rounded text-xs font-bold" :class="{
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': student.major === 'RPL',
                    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200': student.major === 'TKJ',
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': student.major === 'DPIB',
                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200': student.major === 'Multimedia'
                }">{{ student.major }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{{ student.school || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ student.grade_level }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">
              <div v-if="activityByStudentId[student.id]">
                <div class="font-semibold text-gray-800 dark:text-gray-100">
                  {{ activityByStudentId[student.id].material_title || 'Materi tidak diketahui' }}
                </div>
                <div class="text-[11px] text-gray-500 dark:text-gray-400">
                  {{ formatDuration(activityByStudentId[student.id].duration_seconds) }}
                </div>
              </div>
              <span v-else class="text-gray-400">Belum ada aktivitas</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="deleteStudent(student.id)"
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-4 font-bold"
              >
                Hapus
              </button>
            </td>
          </tr>
          <tr v-if="students.length === 0">
            <td colspan="7" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Belum ada data (Cek filter anda).</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 dark:bg-slate-700 p-4 rounded border dark:border-gray-600">
        <div class="text-sm text-gray-600 dark:text-gray-400">
            Menampilkan {{ students.length }} dari {{ totalStudents }} siswa
        </div>
        <div class="flex items-center gap-2">
            <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 bg-white dark:bg-slate-800 border rounded hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed dark:text-white dark:border-gray-600"
            >
                Sebelumnya
            </button>
            <div class="flex gap-1 overflow-x-auto max-w-[200px] md:max-w-none">
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
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import FloatingInput from '../../components/FloatingInput.vue';
import api from '../../api';
import { MAJOR_OPTIONS } from '../../constants/majors';

interface Student {
  id: string;
  nisn: string;
  full_name: string;
  major: string;
  grade_level: number;
  school?: string;
}

const students = ref<Student[]>([]);
const activityByStudentId = ref<Record<string, any>>({});
const showForm = ref(false);
const form = ref({
  nisn: '',
  full_name: '',
  school: '',
  major: '',
  grade_level: ''
});

// Filters & Pagination
const searchQuery = ref('');
const filterMajor = ref('');
const filterSchool = ref('');
const filterGrade = ref('');
const currentPage = ref(1);
const totalStudents = ref(0);
const totalPages = ref(0);
const itemsPerPage = ref(10);

const fetchStudents = async () => {
  try {
    const { data } = await api.get('/students', {
        params: {
            page: currentPage.value,
            limit: itemsPerPage.value,
            search: searchQuery.value,
            major: filterMajor.value,
            school: filterSchool.value,
            grade: filterGrade.value
        }
    });
    students.value = data.data;
    totalStudents.value = data.total;
    totalPages.value = data.totalPages;
    await fetchLatestActivity();
  } catch (e) {
    console.error("Gagal mengambil data siswa", e);
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
    console.error("Gagal mengambil aktivitas siswa", e);
  }
};

const formatDuration = (seconds?: number | null) => {
  if (!seconds || seconds <= 0) return 'Durasi tidak tersedia';
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins < 1) return `${secs}s`;
  return `${mins}m ${secs}s`;
};

// Reset to page 1 on filter change
watch([searchQuery, filterMajor, filterSchool, filterGrade], () => {
    currentPage.value = 1;
    fetchStudents();
});

watch(currentPage, fetchStudents);

const saveStudent = async () => {
  try {
    await api.post('/students', form.value);
    await fetchStudents();
    showForm.value = false;
    form.value = { nisn: '', full_name: '', school: '', major: '', grade_level: '' };
  } catch (e: any) {
    console.error("Gagal menyimpan siswa", e);
    const msg = e.response?.data?.message || e.message || "Gagal menyimpan siswa";
    alert(`Error: ${msg}`);
  }
};

const deleteStudent = async (id: string) => {
  if (!confirm('Yakin ingin menghapus siswa ini?')) return;
  try {
    await api.delete(`/students/${id}`);
    await fetchStudents();
  } catch (e) {
    alert("Gagal menghapus siswa");
  }
};

const handleBulkDelete = async () => {
    const filterText = [
        searchQuery.value ? `Nama/ID: "${searchQuery.value}"` : '',
        filterSchool.value ? `Sekolah: ${filterSchool.value}` : '',
        filterGrade.value ? `Kelas: ${filterGrade.value}` : '',
        filterMajor.value ? `Jurusan: ${filterMajor.value}` : ''
    ].filter(Boolean).join(', ');

    if (!confirm(`PERINGATAN: Yakin ingin menghapus SEMUA siswa yang sesuai dengan filter berikut?\n\n${filterText}\n\nTindakan ini tidak dapat dibatalkan.`)) {
        return;
    }

    try {
        const { data } = await api.post('/students/bulk-delete', {
            full_name: searchQuery.value,
            grade_level: filterGrade.value,
            major: filterMajor.value,
            school: filterSchool.value
        });
        alert(data.message);
        await fetchStudents();
    } catch (e: any) {
        const msg = e.response?.data?.error || 'Gagal menghapus data secara massal';
        alert(`Gagal: ${msg}`);
    }
};

const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        if (!e.target) return;
        const text = e.target.result as string;
        await processCSV(text);
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
};

const processCSV = async (csvText: string) => {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) return;

    // Detect delimiter: check if first line has more ; or ,
    const firstLine = lines[0] || '';
    const commaCount = (firstLine.match(/,/g) || []).length;
    const semiCount = (firstLine.match(/;/g) || []).length;
    const delimiter = semiCount > commaCount ? ';' : ',';

    const studentsToImport = [];

    // Header Detection: Skip if first line contains any of these keywords
    let startIndex = 0;
    const headerKeywords = ['id', 'nama', 'nisn', 'kelas', 'jurusan', 'grade', 'major', 'sekolah', 'school'];
    if (headerKeywords.some(key => firstLine.toLowerCase().includes(key))) {
        startIndex = 1;
    }

    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        const cols = line.split(delimiter);
        if (cols.length >= 4) {
            const grade = cols[2]?.trim();
            // Basic validation: grade must be numeric
            if (!isNaN(Number(grade)) && grade !== '') {
                studentsToImport.push({
                    nisn: cols[0]?.trim() || '',
                    name: cols[1]?.trim() || '',
                    grade: Number(grade),
                    major: cols[3]?.trim() || '',
                    school: cols[4]?.trim() || '',
                });
            }
        }
    }

    if (studentsToImport.length > 0) {
        try {
            const { data } = await api.post('/students/bulk', studentsToImport);
            alert(data.message);
            fetchStudents();
        } catch (e: any) {
            const errorMsg = e.response?.data?.error || 'Gagal import CSV.';
            alert(`${errorMsg}\nPastikan format: ID, Nama Siswa, Kelas, Jurusan, Sekolah`);
            console.error(e);
        }
    } else {
        alert('Tidak ada data valid ditemukan di CSV. Pastikan kolom Kelas berisi angka.');
    }
};

onMounted(fetchStudents);
</script>
