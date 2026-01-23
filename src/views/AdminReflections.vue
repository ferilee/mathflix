<template>
  <div>
    <div class="mb-6">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Jurnal Refleksi Siswa</h2>
    </div>

    <div v-if="loading" class="p-8 text-center text-gray-500">Memuat data...</div>
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{{ error }}</div>

    <div v-else>
        <div class="space-y-4">
             <div v-if="reflections.length === 0" class="text-gray-500 italic">Belum ada jurnal dari siswa.</div>

             <div v-for="ref in reflections" :key="ref.id" class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow transition-colors">
                 <div class="flex justify-between items-start mb-2">
                     <div class="flex items-center gap-2">
                         <span class="font-bold text-gray-800 dark:text-white">{{ getStudentName(ref) }}</span>
                         <span class="text-xs text-gray-500 dark:text-gray-400">{{ getStudentMeta(ref) }}</span>
                         <span class="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-0.5 rounded ml-2">{{ ref.topic || 'General' }}</span>
                     </div>
                     <div class="flex items-center gap-3">
                         <div class="text-2xl" title="Mood">
                             {{ getMoodEmoji(ref.mood) }}
                         </div>
                         <button
                             type="button"
                             class="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200"
                             @click="deleteReflection(ref.id)"
                         >
                             Hapus
                         </button>
                     </div>
                 </div>

                 <p class="text-gray-700 dark:text-gray-200 whitespace-pre-line mb-3 bg-gray-50 dark:bg-slate-700/50 p-3 rounded italic">"{{ ref.content }}"</p>

                 <div class="text-right text-xs text-gray-400">
                     Ditulis pada: {{ new Date(ref.created_at).toLocaleString() }}
                 </div>
             </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';

const reflections = ref<any[]>([]);
const loading = ref(true);
const error = ref('');

const getMoodEmoji = (mood: string) => {
    switch(mood) {
        case 'happy': return '😄';
        case 'neutral': return '😐';
        case 'confused': return '😕';
        case 'frustrated': return '😫';
        default: return '😐';
    }
};

const getStudentName = (ref: any) => {
    return ref?.student?.full_name || 'Siswa tidak ditemukan';
};

const getStudentMeta = (ref: any) => {
    if (!ref?.student) return '(data siswa tidak tersedia)';
    return `(${ref.student.grade_level} ${ref.student.major})`;
};

const deleteReflection = async (reflectionId: string) => {
    if (!confirm('Hapus jurnal refleksi ini?')) return;
    try {
        await api.delete(`/reflections/${reflectionId}`);
        reflections.value = reflections.value.filter((ref) => ref.id !== reflectionId);
    } catch (e: any) {
        console.error("Failed to delete reflection", e);
        error.value = 'Gagal menghapus jurnal: ' + (e.response?.data?.error || e.message || e);
    }
};

const loadData = async () => {
    loading.value = true;
    error.value = '';
    try {
        const { data } = await api.get('/reflections'); // Admin gets all
        reflections.value = data;
    } catch (e: any) {
        console.error("Error loading reflections:", e);
        error.value = 'Gagal memuat data: ' + (e.message || e);
    } finally {
        loading.value = false;
    }
};

onMounted(loadData);
</script>
