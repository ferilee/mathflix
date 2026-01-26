<template>
  <div class="p-6">
      <button @click="$router.push('/admin/assignments')" class="text-gray-500 hover:text-black mb-4 flex items-center gap-2">
          ← Kembali ke Manajemen Tugas
      </button>

      <div v-if="loading" class="text-center py-10">Memuat data...</div>

      <div v-else-if="!assignment" class="text-red-500">Tugas tidak ditemukan.</div>

      <div v-else>
          <div class="bg-slate-800 p-6 rounded shadow mb-6 text-white">
              <h1 class="text-2xl font-bold mb-2">{{ assignment.title }}</h1>
               <div class="text-slate-300 mb-4 line-clamp-2">
                 <MathRenderer :content="assignment.description" />
               </div>
              <div class="flex gap-4 text-sm text-slate-300">
                  <span class="bg-slate-900/80 text-blue-200 px-2 py-1 rounded">Due: {{ new Date(assignment.due_date).toLocaleString() }}</span>
                  <span class="bg-slate-900/80 px-2 py-1 rounded">Total Siswa: {{ list.length }}</span>
                  <span class="bg-slate-900/80 text-green-200 px-2 py-1 rounded">Submitted: {{ submittedCount }}</span>
              </div>
          </div>

          <!-- Submission Table -->
          <div class="bg-slate-800 rounded shadow overflow-hidden text-white">
              <table class="min-w-full divide-y divide-slate-700">
                  <thead class="bg-slate-900">
                      <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Siswa</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Link Tugas</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Nilai</th>
                          <th class="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Aksi</th>
                      </tr>
                  </thead>
                  <tbody class="bg-slate-800 divide-y divide-slate-700">
                      <tr v-for="item in list" :key="item.student.id">
                          <td class="px-6 py-4 whitespace-nowrap">
                              <div class="font-bold text-white">{{ item.student.full_name }}</div>
                              <div class="text-xs text-slate-400">{{ item.student.grade_level }} {{ item.student.major }}</div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                              <span v-if="item.status === 'submitted'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Submitted
                              </span>
                              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  Missing
                              </span>
                              <div v-if="item.submission" class="text-[10px] text-slate-400 mt-1">
                                  {{ new Date(item.submission.submitted_at).toLocaleDateString() }}
                              </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm">
                              <div v-if="item.submission?.submission_url">
                                  <a :href="item.submission.submission_url" target="_blank" class="text-indigo-300 hover:text-indigo-200 underline truncate max-w-[150px] block">
                                      Buka Link ↗
                                  </a>
                                  <div class="text-xs text-slate-400 mt-1 italic w-40 truncate" v-if="item.submission.submission_note">"{{ item.submission.submission_note }}"</div>
                              </div>
                              <span v-else class="text-slate-500">-</span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                              <div v-if="item.submission?.grade !== null && item.submission?.grade !== undefined" class="font-bold text-white">
                                  {{ item.submission.grade }}
                              </div>
                              <span v-else class="text-slate-500">-</span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button @click="openGradeModal(item)" class="text-indigo-300 hover:text-indigo-200 font-bold">
                                  {{ item.submission?.grade ? 'Edit Nilai' : 'Nilai' }}
                              </button>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>

      <!-- Grade Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h3 class="text-lg font-bold mb-4">Nilai Tugas: {{ selectedItem?.student.full_name }}</h3>

              <div class="mb-4">
                  <label class="block text-sm font-bold text-gray-700 mb-1">Nilai (0-100)</label>
                  <input v-model.number="gradeForm.grade" type="number" min="0" max="100" class="w-full border p-2 rounded">
              </div>

              <div class="mb-6">
                  <label class="block text-sm font-bold text-gray-700 mb-1">Feedback / Komentar</label>
                  <textarea v-model="gradeForm.feedback" class="w-full border p-2 rounded" rows="3"></textarea>
              </div>

              <div v-if="assignmentRubric.length > 0" class="mb-6 border rounded p-3 bg-gray-50">
                  <div class="flex items-center justify-between mb-2">
                      <h4 class="text-sm font-bold text-gray-700">Rubrik Penilaian</h4>
                      <label class="text-xs text-gray-500 flex items-center gap-2">
                          <input type="checkbox" v-model="useRubricTotal" />
                          Gunakan total rubrik
                      </label>
                  </div>
                  <div class="space-y-3">
                      <div v-for="item in assignmentRubric" :key="item.id" class="border rounded p-2 bg-white">
                          <div class="flex items-center justify-between text-xs font-semibold text-gray-700">
                              <span>{{ item.title }}</span>
                              <span>Maks {{ item.max_score }}</span>
                          </div>
                          <p v-if="item.description" class="text-[11px] text-gray-500 mt-1">{{ item.description }}</p>
                          <div class="grid grid-cols-1 md:grid-cols-6 gap-2 mt-2">
                              <input
                                  type="number"
                                  min="0"
                                  :max="item.max_score"
                                  class="md:col-span-1 border p-2 rounded text-sm"
                                  v-model.number="rubricScoreFor(item.id).score"
                              />
                              <input
                                  type="text"
                                  class="md:col-span-5 border p-2 rounded text-sm"
                                  placeholder="Komentar untuk kriteria ini"
                                  v-model="rubricScoreFor(item.id).comment"
                              />
                          </div>
                      </div>
                  </div>
                  <div class="text-xs text-gray-600 mt-2">Total rubrik: {{ rubricTotal }}</div>
              </div>

              <div class="flex justify-end gap-3">
                  <button @click="showModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Batal</button>
                  <button @click="saveGrade" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Simpan Nilai</button>
              </div>
          </div>
      </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';
import MathRenderer from '../components/MathRenderer.vue';
import { useDialog } from '../utils/dialog';

const route = useRoute();
const id = route.params.id as string;

const assignment = ref<any>(null);
const list = ref<any[]>([]);
const loading = ref(true);
let pollingInterval: any = null;

const showModal = ref(false);
const selectedItem = ref<any>(null);
const dialog = useDialog();
const gradeForm = reactive({
    grade: 0,
    feedback: '',
    rubric_scores: [] as Array<{ rubric_id: string; score: number; comment?: string }>
});
const useRubricTotal = ref(true);

const assignmentRubric = computed(() => {
    const raw = assignment.value?.rubric;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
});

const rubricTotal = computed(() => {
    if (!gradeForm.rubric_scores?.length) return 0;
    return gradeForm.rubric_scores.reduce((sum, item) => sum + (Number(item.score) || 0), 0);
});

const submittedCount = computed(() => list.value.filter(i => i.status === 'submitted').length);

const loadData = async (isPolling = false) => {
    try {
        if (!isPolling) {
            loading.value = true;
        }
        const [assignRes, subRes] = await Promise.all([
            api.get(`/assignments/${id}`),
            api.get(`/assignments/${id}/submissions`)
        ]);
        assignment.value = assignRes.data;
        list.value = subRes.data;
    } catch (e) {
        console.error(e);
    } finally {
        if (!isPolling) {
            loading.value = false;
        }
    }
};

const buildRubricScores = (existing: any[] = []) => {
    const rubric = assignmentRubric.value || [];
    if (rubric.length === 0) return [];
    return rubric.map((item: any) => {
        const found = existing.find((s: any) => s.rubric_id === item.id);
        return {
            rubric_id: item.id,
            score: found?.score ?? 0,
            comment: found?.comment ?? ''
        };
    });
};

const rubricScoreFor = (rubricId: string) => {
    let entry = gradeForm.rubric_scores.find((s) => s.rubric_id === rubricId);
    if (!entry) {
        entry = { rubric_id: rubricId, score: 0, comment: '' };
        gradeForm.rubric_scores.push(entry);
    }
    return entry;
};

const openGradeModal = (item: any) => {
    selectedItem.value = item;
    gradeForm.grade = item.submission?.grade || 0;
    gradeForm.feedback = item.submission?.feedback || '';
    gradeForm.rubric_scores = buildRubricScores(item.submission?.rubric_scores || []);
    useRubricTotal.value = assignmentRubric.value.length > 0;
    showModal.value = true;
};

const saveGrade = async () => {
    if (!selectedItem.value) return;

    try {
        await api.post(`/assignments/${id}/grade`, {
            student_id: selectedItem.value.student.id,
            grade: gradeForm.grade,
            feedback: gradeForm.feedback,
            rubric_scores: gradeForm.rubric_scores
        });

        // Update local state
        // If submission didn't exist (missing), it will be created on backend.
        // We should reload to get proper ID and dates, or just mock it update.
        // Let's reload for consistency.
        showModal.value = false;
        await loadData();

    } catch (e: any) {
        await dialog.alert('Gagal menyimpan nilai');
        console.error(e);
    }
};

onMounted(() => {
    loadData();
    pollingInterval = setInterval(() => loadData(true), 5000);
});

onUnmounted(() => {
    if (pollingInterval) clearInterval(pollingInterval);
});

watch([rubricTotal, useRubricTotal], () => {
    if (useRubricTotal.value) {
        gradeForm.grade = rubricTotal.value;
    }
});
</script>
