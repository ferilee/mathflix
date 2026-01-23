<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-slate-800 p-6 rounded shadow flex justify-between items-center transition-colors">
      <div>
           <h2 class="text-2xl font-bold mb-1 text-gray-800 dark:text-gray-100">Dashboard Guru</h2>
           <p class="text-gray-600 dark:text-gray-400">Overview performa siswa dan aktivitas terbaru (Tahap Assess).</p>
      </div>
      <button @click="loadAnalytics" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-bold">Aggregated Real-time</button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-slate-800 p-6 rounded shadow border-l-4 border-blue-500 transition-colors">
            <h3 class="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase">Total Siswa</h3>
            <div class="text-4xl font-bold text-gray-800 dark:text-white mt-2">{{ stats.total_students || 0 }}</div>
        </div>
        <div class="bg-white dark:bg-slate-800 p-6 rounded shadow border-l-4 border-green-500 transition-colors">
            <h3 class="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase">Rata-rata Nilai Kuis</h3>
            <div class="text-4xl font-bold text-gray-800 dark:text-white mt-2">{{ stats.average_score || 0 }}</div>
            <div class="text-xs text-gray-400 mt-1">Acuan ketuntasan: 75</div>
        </div>
        <div class="bg-white dark:bg-slate-800 p-6 rounded shadow border-l-4 border-purple-500 transition-colors">
            <h3 class="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase">Jurnal Refleksi Hari Ini</h3>
            <div class="text-4xl font-bold text-gray-800 dark:text-white mt-2">{{ stats.today_reflections || 0 }}</div>
            <div class="text-xs text-gray-400 mt-1">Siswa aktif merefleksi</div>
        </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Recent Reflections Feed -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-lg text-gray-800 dark:text-white">Jurnal Refleksi Terbaru</h3>
                <router-link to="/admin/reflections" class="text-indigo-600 dark:text-indigo-400 text-sm hover:underline">Lihat Semua</router-link>
            </div>

            <div v-if="loading" class="text-gray-500 italic">Memuat data...</div>
            <div v-else-if="stats.recent_reflections?.length === 0" class="text-gray-500">Belum ada jurnal.</div>

            <div v-else class="space-y-4">
                <template v-for="ref in stats.recent_reflections" :key="ref.id">
                    <div v-if="ref.student" class="border-b dark:border-slate-700 pb-3 last:border-0 last:pb-0">
                        <div class="flex justify-between items-start">
                            <div>
                                <span class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ ref.student.full_name }}</span>
                                <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">({{ ref.student.grade_level }} {{ ref.student.major }})</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-xl">{{ getMoodEmoji(ref.mood) }}</span>
                                <button
                                    type="button"
                                    class="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200"
                                    @click="deleteReflection(ref.id)"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                        <p class="text-gray-600 dark:text-gray-300 text-sm mt-1 italic line-clamp-2">"{{ ref.content }}"</p>
                        <div class="text-xs text-gray-400 mt-1">{{ new Date(ref.created_at).toLocaleString() }}</div>
                    </div>
                </template>
            </div>
        </div>

        <!-- At-Risk Monitor -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded shadow border border-red-100 dark:border-red-900 transition-colors">
            <h3 class="font-bold text-lg text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                ⚠️ Perlu Perhatian
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">Siswa dengan rata-rata nilai kuis di bawah 60.</p>

            <div v-if="loading" class="text-gray-500 italic">Menganalisis...</div>
            <div v-else-if="stats.at_risk_students?.length === 0" class="text-center py-6 text-green-600 dark:text-green-400">
                <div class="text-2xl mb-2">✅</div>
                Tidak ada siswa "at-risk". <br>Semua aman!
            </div>

            <div v-else class="space-y-3">
                 <div v-for="(student, idx) in stats.at_risk_students" :key="idx" class="flex justify-between items-center bg-red-50 dark:bg-red-900/30 p-3 rounded">
                     <span class="font-medium text-gray-700 dark:text-gray-200">{{ student.name }}</span>
                     <span class="bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-bold px-2 py-1 rounded">Avg: {{ student.average }}</span>
                 </div>
            </div>
        </div>
    </div>

    <!-- Recent Student Activity -->
    <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg text-gray-800 dark:text-white">Aktivitas Siswa Terakhir</h3>
            <router-link to="/admin/activity" class="text-indigo-600 dark:text-indigo-400 text-sm hover:underline">Lihat Aktivitas</router-link>
        </div>
        <div v-if="activityLoading" class="text-gray-500 italic">Memuat aktivitas...</div>
        <div v-else-if="recentActivity.length === 0" class="text-gray-500">Belum ada aktivitas siswa.</div>
        <div v-else class="space-y-3">
            <div v-for="item in recentActivity" :key="item.student_id" class="flex items-center justify-between bg-gray-50 dark:bg-slate-700 p-3 rounded">
                <div>
                    <div class="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                        {{ item.student_name }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ item.material_title || 'Materi tidak diketahui' }}
                    </div>
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-300">
                    {{ formatDuration(item.duration_seconds) }}
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Navigation (Compact) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link to="/admin/students" class="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded text-center hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition font-bold text-indigo-700 dark:text-indigo-300">Manajemen Siswa</router-link>
        <router-link to="/admin/materials" class="bg-green-50 dark:bg-green-900/30 p-4 rounded text-center hover:bg-green-100 dark:hover:bg-green-900/50 transition font-bold text-green-700 dark:text-green-300">Manajemen Materi</router-link>
        <router-link to="/admin/quizzes" class="bg-red-50 dark:bg-red-900/30 p-4 rounded text-center hover:bg-red-100 dark:hover:bg-red-900/50 transition font-bold text-red-700 dark:text-red-300">Manajemen Kuis</router-link>
        <router-link to="/admin/assignments" class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded text-center hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition font-bold text-yellow-700 dark:text-yellow-300">Manajemen Tugas</router-link>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';

const stats = ref<any>({});
const loading = ref(true);
const recentActivity = ref<any[]>([]);
const activityLoading = ref(true);

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
        const [analyticsRes, reflectionsRes] = await Promise.all([
            api.get('/analytics'),
            api.get('/reflections')
        ]);
        const analytics = analyticsRes.data || {};
        const reflections = Array.isArray(reflectionsRes.data) ? reflectionsRes.data : reflectionsRes.data?.data || [];

        const today = new Date();
        const todayKey = today.toISOString().slice(0, 10);
        const uniqueStudents = new Set<string>();

        reflections.forEach((ref: any) => {
            const createdAt = ref?.created_at;
            if (!createdAt) return;
            if (new Date(createdAt).toISOString().slice(0, 10) !== todayKey) return;
            const studentId = ref?.student?.id || ref?.student_id || ref?.student?.nisn || ref?.nisn;
            if (studentId) uniqueStudents.add(String(studentId));
        });

        stats.value = {
            ...analytics,
            today_reflections: uniqueStudents.size
        };
        await loadRecentActivity();
    } catch (e) {
        console.error("Failed to load analytics", e);
    } finally {
        loading.value = false;
    }
};

const loadRecentActivity = async () => {
    activityLoading.value = true;
    try {
        const studentsRes = await api.get('/students', { params: { page: 1, limit: 20 } });
        const students = studentsRes.data?.data || [];
        const ids = students.map((s: any) => s.id).join(',');
        if (!ids) {
            recentActivity.value = [];
            return;
        }
        const activityRes = await api.get('/activity/latest', { params: { student_ids: ids } });
        const activity = Array.isArray(activityRes.data) ? activityRes.data : [];
        const map = new Map(students.map((s: any) => [s.id, s.full_name]));
        recentActivity.value = activity
            .map((row: any) => ({
                ...row,
                student_name: map.get(row.student_id) || 'Siswa'
            }))
            .slice(0, 6);
    } catch (e) {
        console.error("Failed to load recent activity", e);
        recentActivity.value = [];
    } finally {
        activityLoading.value = false;
    }
};

const formatDuration = (seconds?: number | null) => {
    if (!seconds || seconds <= 0) return 'Durasi tidak tersedia';
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    if (mins < 1) return `${secs}s`;
    return `${mins}m ${secs}s`;
};

const deleteReflection = async (reflectionId: string) => {
    if (!confirm('Hapus jurnal refleksi ini?')) return;
    try {
        await api.delete(`/reflections/${reflectionId}`);
        await loadAnalytics();
    } catch (e: any) {
        console.error("Failed to delete reflection", e);
        alert('Gagal menghapus jurnal: ' + (e.response?.data?.error || e.message || e));
    }
};

onMounted(loadAnalytics);
</script>
