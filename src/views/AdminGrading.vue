<template>
  <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Rekap Penilaian Siswa</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Total skor kuis, rata-rata, dan keaktifan.</p>
      </div>
      <button
        @click="downloadCSV"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold flex items-center gap-2 shadow transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download CSV
      </button>
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
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded border border-indigo-200 dark:border-indigo-800">
            <div class="text-xs text-indigo-600 dark:text-indigo-400 uppercase font-bold">Total Siswa (Filtered)</div>
            <div class="text-2xl font-bold text-indigo-800 dark:text-indigo-200">{{ filteredStudents.length }}</div>
        </div>
        <div class="bg-blue-100 dark:bg-blue-900/30 p-4 rounded border border-blue-200 dark:border-blue-800">
             <div class="text-xs text-blue-600 dark:text-blue-400 uppercase font-bold">Rata-rata (Filtered)</div>
             <div class="text-2xl font-bold text-blue-800 dark:text-blue-200">{{ classAverage }}</div>
        </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-white">
        <thead class="bg-gray-50 dark:bg-slate-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">NISN</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Lengkap</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jurusan</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quiz Avg</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quiz Total</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Refleksi</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Badges</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-gray-50 dark:hover:bg-slate-700 transition">
            <td class="px-6 py-4 whitespace-nowrap font-mono text-sm">{{ student.nisn }}</td>
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ student.full_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">{{ student.major }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 rounded font-bold" :class="getScoreColor(student.quiz_avg)">
                    {{ student.quiz_avg }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap font-mono">{{ student.quiz_total }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">{{ student.reflection_count }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">{{ student.badges_count }}</td>
          </tr>
          <tr v-if="loading">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">Memuat data...</td>
          </tr>
           <tr v-if="!loading && filteredStudents.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">Belum ada data (Cek filter anda).</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import api from '../api';
import { MAJOR_OPTIONS } from '../constants/majors';

interface StudentGrade {
    id: string;
    nisn: string;
    full_name: string;
    major: string;
    grade_level: number;
    quiz_total: number;
    quiz_avg: number | string;
    reflection_count: number;
    badges_count: number;
}

const students = ref<StudentGrade[]>([]);
const loading = ref(true);
let pollingInterval: any = null;

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

const classAverage = computed(() => {
    if (filteredStudents.value.length === 0) return 0;
    const total = filteredStudents.value.reduce((acc, curr) => acc + Number(curr.quiz_avg), 0);
    return (total / filteredStudents.value.length).toFixed(1);
});

const fetchData = async (isPolling = false) => {
    try {
        if (!isPolling) {
            loading.value = true;
        }
        const { data } = await api.get('/grading');
        students.value = data;
    } catch (e) {
        console.error("Gagal memuat data grading", e);
    } finally {
        if (!isPolling) {
            loading.value = false;
        }
    }
};

const getScoreColor = (score: number | string) => {
    const s = Number(score);
    if (s >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (s >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
};

const downloadCSV = () => {
    if (filteredStudents.value.length === 0) return;

    // Defines headers
    const headers = ['NISN', 'Nama Lengkap', 'Jurusan', 'Kelas', 'Quiz Total', 'Quiz Avg', 'Jml Refleksi', 'Jml Badges'];

    // Map data to CSV row format
    const rows = filteredStudents.value.map(s => [
        s.nisn,
        `"${s.full_name}"`, // Quote name to handle commas
        s.major,
        s.grade_level,
        s.quiz_total,
        s.quiz_avg,
        s.reflection_count,
        s.badges_count
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
    ].join('\n');

    // CreateBlob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rekap_nilai_mathflix_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

onMounted(() => {
    fetchData();
    pollingInterval = setInterval(() => fetchData(true), 5000);
});

onUnmounted(() => {
    if (pollingInterval) clearInterval(pollingInterval);
});
</script>
