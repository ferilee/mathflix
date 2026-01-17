<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded shadow flex justify-between items-center">
      <div>
           <h2 class="text-2xl font-bold mb-1">Dashboard Guru</h2>
           <p class="text-gray-600">Overview performa siswa dan aktivitas terbaru (Tahap Assess).</p>
      </div>
      <button @click="loadAnalytics" class="text-indigo-600 hover:text-indigo-800 text-sm font-bold">Aggregated Real-time</button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded shadow border-l-4 border-blue-500">
            <h3 class="text-gray-500 text-sm font-bold uppercase">Total Siswa</h3>
            <div class="text-4xl font-bold text-gray-800 mt-2">{{ stats.total_students || 0 }}</div>
        </div>
        <div class="bg-white p-6 rounded shadow border-l-4 border-green-500">
            <h3 class="text-gray-500 text-sm font-bold uppercase">Rata-rata Nilai Kuis</h3>
            <div class="text-4xl font-bold text-gray-800 mt-2">{{ stats.average_score || 0 }}</div>
            <div class="text-xs text-gray-400 mt-1">Acuan ketuntasan: 75</div>
        </div>
        <div class="bg-white p-6 rounded shadow border-l-4 border-purple-500">
            <h3 class="text-gray-500 text-sm font-bold uppercase">Jurnal Refleksi Hari Ini</h3>
            <div class="text-4xl font-bold text-gray-800 mt-2">{{ stats.today_reflections || 0 }}</div>
            <div class="text-xs text-gray-400 mt-1">Siswa aktif merefleksi</div>
        </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Recent Reflections Feed -->
        <div class="lg:col-span-2 bg-white p-6 rounded shadow">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-lg">Jurnal Refleksi Terbaru</h3>
                <router-link to="/admin/reflections" class="text-indigo-600 text-sm hover:underline">Lihat Semua</router-link>
            </div>
            
            <div v-if="loading" class="text-gray-500 italic">Memuat data...</div>
            <div v-else-if="stats.recent_reflections?.length === 0" class="text-gray-500">Belum ada jurnal.</div>
            
            <div v-else class="space-y-4">
                <div v-for="ref in stats.recent_reflections" :key="ref.id" class="border-b pb-3 last:border-0 last:pb-0">
                    <div class="flex justify-between items-start">
                        <div>
                             <span class="font-bold text-gray-800 text-sm">{{ ref.student.full_name }}</span>
                             <span class="text-xs text-gray-500 ml-2">({{ ref.student.grade_level }} {{ ref.student.major }})</span>
                        </div>
                        <span class="text-xl">{{ getMoodEmoji(ref.mood) }}</span>
                    </div>
                    <p class="text-gray-600 text-sm mt-1 italic line-clamp-2">"{{ ref.content }}"</p>
                    <div class="text-xs text-gray-400 mt-1">{{ new Date(ref.created_at).toLocaleString() }}</div>
                </div>
            </div>
        </div>

        <!-- At-Risk Monitor -->
        <div class="bg-white p-6 rounded shadow border border-red-100">
            <h3 class="font-bold text-lg text-red-600 mb-4 flex items-center gap-2">
                ⚠️ Perlu Perhatian
            </h3>
            <p class="text-xs text-gray-500 mb-4">Siswa dengan rata-rata nilai kuis di bawah 60.</p>

            <div v-if="loading" class="text-gray-500 italic">Menganalisis...</div>
            <div v-else-if="stats.at_risk_students?.length === 0" class="text-center py-6 text-green-600">
                <div class="text-2xl mb-2">✅</div>
                Tidak ada siswa "at-risk". <br>Semua aman!
            </div>
            
            <div v-else class="space-y-3">
                 <div v-for="(student, idx) in stats.at_risk_students" :key="idx" class="flex justify-between items-center bg-red-50 p-3 rounded">
                     <span class="font-medium text-gray-700">{{ student.name }}</span>
                     <span class="bg-red-200 text-red-800 text-xs font-bold px-2 py-1 rounded">Avg: {{ student.average }}</span>
                 </div>
            </div>
        </div>
    </div>

    <!-- Quick Navigation (Compact) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link to="/admin/students" class="bg-indigo-50 p-4 rounded text-center hover:bg-indigo-100 transition font-bold text-indigo-700">Manajemen Siswa</router-link>
        <router-link to="/admin/materials" class="bg-green-50 p-4 rounded text-center hover:bg-green-100 transition font-bold text-green-700">Manajemen Materi</router-link>
        <router-link to="/admin/quizzes" class="bg-red-50 p-4 rounded text-center hover:bg-red-100 transition font-bold text-red-700">Manajemen Kuis</router-link>
        <router-link to="/admin/assignments" class="bg-yellow-50 p-4 rounded text-center hover:bg-yellow-100 transition font-bold text-yellow-700">Manajemen Tugas</router-link>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';

const stats = ref<any>({});
const loading = ref(true);

const getMoodEmoji = (mood: string) => {
    switch(mood) {
        case 'happy': return '😄';
        case 'neutral': return '😐';
        case 'confused': return '😕';
        case 'frustrated': return '😫';
        default: return '😐';
    }
};

const loadAnalytics = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('/analytics');
        stats.value = data;
    } catch (e) {
        console.error("Failed to load analytics", e);
    } finally {
        loading.value = false;
    }
};

onMounted(loadAnalytics);
</script>
