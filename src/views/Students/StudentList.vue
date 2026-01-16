<template>
  <div class="bg-white p-6 rounded shadow">
    <div class="mb-6 flex justify-between items-center bg-white p-4 rounded shadow">
      <div>
         <h2 class="text-lg font-bold">Tambah Siswa</h2>
         <p class="text-sm text-gray-500">Input manual atau Import CSV (Google Sheets: NISN, Nama, Jurusan)</p>
      </div>
      <div class="flex gap-4">
          <!-- CSV Import trigger -->
          <label class="cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2">
             <span>📂 Import CSV</span>
             <input type="file" @change="handleFileUpload" accept=".csv" class="hidden">
          </label>
          <button 
            @click="showForm = !showForm"
            class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {{ showForm ? 'Batal' : 'Manual Input' }}
          </button>
      </div>
    </div>

    <!-- Create/Edit Form -->
    <div v-if="showForm" class="mb-8 bg-gray-50 p-4 rounded border">
      <h3 class="font-bold mb-4">Tambah Siswa Baru</h3>
      <form @submit.prevent="saveStudent" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="form.nisn" type="text" placeholder="NISN" class="border p-2 rounded" required />
        <input v-model="form.full_name" type="text" placeholder="Nama Lengkap" class="border p-2 rounded" required />
        <select v-model="form.major" class="border p-2 rounded" required>
          <option value="" disabled>Pilih Jurusan</option>
          <option value="TKJ">TKJ</option>
          <option value="RPL">RPL</option>
          <option value="Multimedia">Multimedia</option>
        </select>
        <input v-model.number="form.grade_level" type="number" placeholder="Kelas (10/11/12)" class="border p-2 rounded" required />
        
        <div class="md:col-span-2 flex justify-end">
          <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Simpan</button>
        </div>
      </form>
    </div>

    <!-- List Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NISN</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurusan</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="student in students" :key="student.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ student.nisn }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ student.full_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ student.major }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ student.grade_level }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="deleteStudent(student.id)"
                class="text-red-600 hover:text-red-900 ml-4"
              >
                Hapus
              </button>
            </td>
          </tr>
          <tr v-if="students.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">Belum ada data siswa.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
  grade_level: 10
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
    form.value = { nisn: '', full_name: '', major: '', grade_level: 10 };
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
        const cols = lines[i].split(',');
        if (cols.length >= 2) {
            studentsToImport.push({
                nisn: cols[0].trim(),
                name: cols[1].trim(),
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
