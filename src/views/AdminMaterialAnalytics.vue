<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors" data-tour="analytics">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Analitik Materi</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Progress gabungan, skor, kelulusan, dan soal tersulit.</p>
        </div>
        <button @click="loadAnalytics" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-bold shadow transition">
          Refresh
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div class="xl:col-span-2 bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors min-w-0">
        <div v-if="loading" class="text-gray-500 italic">Memuat data...</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-white">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Materi</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Progress</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rata-rata</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kelulusan</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aktif</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="item in materials"
                :key="item.material_id"
                class="hover:bg-gray-50 dark:hover:bg-slate-700 transition cursor-pointer"
                @click="selectMaterial(item.material_id)"
              >
                <td class="px-4 py-3 text-sm font-semibold">{{ item.title }}</td>
                <td class="px-4 py-3 text-sm">{{ item.progress_rate }}%</td>
                <td class="px-4 py-3 text-sm">{{ item.average_score ?? 0 }}</td>
                <td class="px-4 py-3 text-sm">{{ item.pass_rate }}%</td>
                <td class="px-4 py-3 text-sm">{{ item.active_students }}</td>
              </tr>
              <tr v-if="materials.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Belum ada data analitik.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
        <div v-if="detailLoading" class="text-gray-500 italic">Memuat detail...</div>
        <div v-else-if="!detail" class="text-gray-500 dark:text-gray-400">
          Pilih materi untuk melihat detail soal tersulit.
        </div>
        <div v-else>
          <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2">{{ detail.title }}</h3>
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Progress {{ detail.progress_rate }}% • Rata-rata {{ detail.average_score ?? 0 }} • Kelulusan {{ detail.pass_rate }}%
          </div>

          <h4 class="text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Soal Tersulit</h4>
          <div v-if="detail.hardest_questions.length === 0" class="text-gray-500">Belum ada data soal.</div>
          <div v-else class="space-y-3">
            <div v-for="q in detail.hardest_questions" :key="q.question_id" class="border border-gray-200 dark:border-slate-700 rounded p-3">
              <div class="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                {{ q.question_text }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Benar: {{ q.correct_rate }}% • Attempts: {{ q.attempts }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';
import { isDemoMode, getDemoMaterialAnalytics, getDemoMaterialAnalyticsDetail } from '../utils/demo';

const materials = ref<any[]>([]);
const loading = ref(true);
const detail = ref<any | null>(null);
const detailLoading = ref(false);
const demoMode = isDemoMode();

const loadAnalytics = async () => {
  loading.value = true;
  try {
    if (demoMode) {
      materials.value = getDemoMaterialAnalytics();
      return;
    }
    const { data } = await api.get('/analytics/materials');
    materials.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('Gagal memuat analitik materi', e);
  } finally {
    loading.value = false;
  }
};

const selectMaterial = async (materialId: string) => {
  detailLoading.value = true;
  try {
    if (demoMode) {
      detail.value = getDemoMaterialAnalyticsDetail(materialId);
      return;
    }
    const { data } = await api.get(`/analytics/materials/${materialId}`);
    detail.value = data;
  } catch (e) {
    console.error('Gagal memuat detail materi', e);
    detail.value = null;
  } finally {
    detailLoading.value = false;
  }
};

onMounted(loadAnalytics);
</script>
