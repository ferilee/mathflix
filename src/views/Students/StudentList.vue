<template>
  <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
    <div class="mb-6 flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded shadow border dark:border-gray-700">
      <div>
         <h2 class="text-lg font-bold text-gray-800 dark:text-white">Tambah Siswa</h2>
         <p class="text-sm text-gray-500 dark:text-gray-400">Input manual atau Import CSV (Google Sheets: NISN, Nama, Jurusan)</p>
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
        <FloatingInput v-model="form.nisn" label="NISN (Nomor Induk)" id="s_nisn" required />
        <FloatingInput v-model="form.full_name" label="Nama Lengkap" id="s_name" required />
        
        <div class="relative z-0 w-full mb-6 group">
            <select v-model="form.major" id="s_major" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer">
              <option class="text-black" value="" disabled>Pilih Jurusan</option>
              <option class="text-black" value="TKJ">TKJ</option>
              <option class="text-black" value="RPL">RPL</option>
              <option class="text-black" value="Multimedia">Multimedia</option>
            </select>
            <label for="s_major" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Jurusan</label>
        </div>

        <FloatingInput v-model="form.grade_level" type="number" label="Kelas (10/11/12)" id="s_grade" required />
        
        <div class="md:col-span-2 flex justify-end">
          <button type="submit" class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 font-bold shadow">Simpan Data</button>
        </div>
      </form>
    </div>

    <!-- Filters -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Cari Nama atau NISN..." 
              class="w-full border p-2 rounded bg-gray-50 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
            />
        </div>
        <div>
            <select v-model="filterMajor" class="w-full border p-2 rounded bg-gray-50 dark:bg-slate-700 dark:border-gray-600 dark:text-white">
                <option value="">Semua Jurusan</option>
                <option value="TKJ">TKJ</option>
                <option value="RPL">RPL</option>
                <option value="Multimedia">Multimedia</option>
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
    </div>

    <!-- List Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-white">
        <thead class="bg-gray-50 dark:bg-slate-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">NISN</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jurusan</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kelas</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 font-mono">{{ student.nisn }}</td>
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ student.full_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-0.5 rounded text-xs font-bold" :class="{
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': student.major === 'RPL',
                    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200': student.major === 'TKJ',
                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200': student.major === 'Multimedia'
                }">{{ student.major }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ student.grade_level }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="deleteStudent(student.id)"
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-4 font-bold"
              >
                Hapus
              </button>
            </td>
          </tr>
          <tr v-if="filteredStudents.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Belum ada data (Cek filter anda).</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import FloatingInput from '../../components/FloatingInput.vue';
import api from '../../api';

interface Student {
  id: string;
  nisn: string;
  full_name: string;
  major: string;
  grade_level: number;
}

const students = ref<Student[]>([]);
const showForm = ref(false);
const form = ref({
  nisn: '',
  full_name: '',
  major: '',
  grade_level: ''
});

// Filters
const searchQuery = ref('');
const filterMajor = ref('');
const filterGrade = ref('');

const filteredStudents = computed(() => {
    return students.value.filter(s => {
        const matchesSearch = s.full_name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                              s.nisn.includes(searchQuery.value);
        const matchesMajor = filterMajor.value ? s.major === filterMajor.value : true;
        const matchesGrade = filterGrade.value ? s.grade_level == Number(filterGrade.value) : true;
        
        return matchesSearch && matchesMajor && matchesGrade;
    });
});


const fetchStudents = async () => {
  try {
    const { data } = await api.get('/students');
    students.value = data;
  } catch (e) {
    console.error("Gagal mengambil data siswa", e);
  }
};

const saveStudent = async () => {
  try {
    await api.post('/students', form.value);
    await fetchStudents();
    showForm.value = false;
    form.value = { nisn: '', full_name: '', major: '', grade_level: '' };
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
    // Basic CSV Parser (Handle Google Sheets export)
    // Assumes no commas in data, or handled simply.
    // Format: NISN, Name, Major
    
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) return;

    const studentsToImport = [];

    // Skip header if looks like header (contains 'NISN')
    let startIndex = 0;
    if (lines[0] && lines[0].toLowerCase().includes('nisn')) startIndex = 1;

    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        const cols = line.split(',');
        if (cols.length >= 2) {
            studentsToImport.push({
                nisn: cols[0]?.trim() || '',
                name: cols[1]?.trim() || '',
                major: cols[2]?.trim() || 'Umum',
            });
        }
    }

    if (studentsToImport.length > 0) {
        try {
            const { data } = await api.post('/students/bulk', studentsToImport);
            alert(data.message);
            fetchStudents();
        } catch (e) {
            alert('Gagal import CSV. Pastikan format: NISN, Nama, Jurusan');
            console.error(e);
        }
    } else {
        alert('Tidak ada data valid ditemukan di CSV');
    }
};

onMounted(fetchStudents);
</script>
