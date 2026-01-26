<template>
  <div class="min-h-screen bg-gray-900 text-white p-6 md:p-12 pb-24">
      <button @click="$router.push('/student/assignments')" class="text-gray-400 hover:text-white mb-6 flex items-center gap-2">
          ← Kembali ke Daftar Tugas
      </button>

      <div v-if="loading" class="text-center text-gray-500">Memuat detail tugas...</div>
      <div v-else-if="!task" class="text-center text-red-500">Tugas tidak ditemukan.</div>

      <div v-else class="max-w-3xl mx-auto">
          <!-- Task Header -->
          <div class="bg-gray-800 p-8 rounded-xl border border-gray-700 mb-8">
              <div class="flex justify-between items-start mb-4">
                  <h1 class="text-3xl font-bold">{{ task.title }}</h1>
                  <div v-if="submission" class="bg-green-600 px-3 py-1 rounded text-xs font-bold">Sudah Dikumpulkan</div>
                  <div v-else class="bg-yellow-600 px-3 py-1 rounded text-xs font-bold">Belum Dikumpulkan</div>
              </div>

              <div class="text-gray-400 text-sm mb-6 flex items-center gap-4">
                  <span>📅 Deadline: {{ new Date(task.due_date).toLocaleString() }}</span>
              </div>

              <!-- Content (Rich Text) -->
              <div class="bg-gray-900/50 p-6 rounded-lg border border-gray-700 text-gray-300 leading-relaxed">
                   <MathRenderer :content="task.description" />
              </div>
          </div>

          <!-- Submission Form -->
          <div class="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <h2 class="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Pengumpulan Tugas</h2>

              <div v-if="submission">
                  <div class="bg-green-900/30 border border-green-600/50 p-4 rounded mb-4">
                      <p class="text-green-400 font-bold mb-1">✅ Tugas Berhasil Dikirim</p>
                      <p class="text-xs text-gray-400 mb-2">Pada: {{ new Date(submission.submitted_at).toLocaleString() }}</p>

                      <div class="text-sm text-gray-300">
                          <strong>Link:</strong> <a :href="submission.submission_url" target="_blank" class="text-indigo-400 underline">{{ submission.submission_url }}</a>
                      </div>
                      <div class="text-sm text-gray-300 mt-1" v-if="submission.submission_note">
                          <strong>Catatan:</strong> {{ submission.submission_note }}
                      </div>
                  </div>

                  <div v-if="submission.grade !== null" class="bg-indigo-900/30 border border-indigo-600/50 p-4 rounded mt-4 text-center">
                      <div class="text-gray-400 text-xs uppercase mb-1">Nilai Anda</div>
                      <div class="text-4xl font-bold text-white">{{ submission.grade }}<span class="text-lg text-gray-500">/100</span></div>
                      <p v-if="submission.feedback" class="text-sm text-indigo-300 mt-2 italic">"{{ submission.feedback }}"</p>
                  </div>

                  <div v-if="taskRubric.length > 0 && submission?.rubric_scores?.length" class="bg-gray-900/40 border border-gray-700 p-4 rounded mt-4">
                      <h3 class="text-sm font-bold mb-3">Rubrik Penilaian</h3>
                      <div class="space-y-3">
                          <div v-for="item in taskRubric" :key="item.id" class="bg-gray-800/60 border border-gray-700 rounded p-3">
                              <div class="flex items-center justify-between text-xs font-semibold text-gray-200">
                                  <span>{{ item.title }}</span>
                                  <span>{{ getRubricScore(item.id)?.score ?? 0 }}/{{ item.max_score }}</span>
                              </div>
                              <p v-if="item.description" class="text-[11px] text-gray-400 mt-1">{{ item.description }}</p>
                              <p v-if="getRubricScore(item.id)?.comment" class="text-[11px] text-indigo-200 mt-2 italic">
                                  "{{ getRubricScore(item.id)?.comment }}"
                              </p>
                          </div>
                      </div>
                  </div>

                  <button @click="startEditSubmission" class="mt-4 text-xs text-gray-500 hover:text-white underline">Edit Pengumpulan</button>
              </div>

              <form v-else @submit.prevent="submitTask" class="space-y-4">
                  <div>
                      <label class="block text-sm font-bold text-gray-400 mb-1">Link Tugas (Google Drive / Docs / Video)</label>
                      <input v-model="form.url" type="url" required class="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="https://...">
                  </div>

                  <div>
                      <label class="block text-sm font-bold text-gray-400 mb-1">Catatan Tambahan (Opsional)</label>
                      <textarea v-model="form.note" class="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" rows="3" placeholder="Pesan untuk guru..."></textarea>
                  </div>

                  <button type="submit" :disabled="submitting" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded transition flex justify-center items-center gap-2">
                      <span v-if="submitting">Mengirim...</span>
                      <span v-else>📤 Kirim Tugas</span>
                  </button>
              </form>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';
import MathRenderer from '../components/MathRenderer.vue';
import { isDemoMode, getDemoAssignmentById, getDemoAssignmentSubmission, saveDemoAssignmentSubmission } from '../utils/demo';
import { useDialog } from '../utils/dialog';

const route = useRoute();
const id = route.params.id as string;

const task = ref<any>(null);
const submission = ref<any>(null);
const loading = ref(true);
const submitting = ref(false);
const isEditingSubmission = ref(false);
let pollingInterval: any = null;
const taskRubric = ref<any[]>([]);
const demoMode = isDemoMode();
const dialog = useDialog();

const form = reactive({
    url: '',
    note: ''
});

const loadData = async (isPolling = false) => {
    if (demoMode) {
        task.value = getDemoAssignmentById(id);
        submission.value = getDemoAssignmentSubmission(id);
        loading.value = false;
        return;
    }
    const studentData = localStorage.getItem('student');
    if (!studentData) return;
    const student = JSON.parse(studentData);

    try {
        if (!isPolling) {
            loading.value = true;
        }
        const [taskRes, subRes] = await Promise.all([
            api.get(`/assignments/${id}`),
            api.get(`/assignments/${id}/status`, { headers: { 'X-Student-ID': student.id } })
        ]);

        task.value = taskRes.data;
        taskRubric.value = normalizeRubric(taskRes.data?.rubric);
        if (!isEditingSubmission.value) {
            submission.value = subRes.data;
        }

    } catch (e) {
        console.error("Failed to load task", e);
    } finally {
        if (!isPolling) {
            loading.value = false;
        }
    }
};

const normalizeRubric = (raw: any) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
};

const getRubricScore = (rubricId: string) => {
    const scores = submission.value?.rubric_scores;
    if (!scores) return null;
    return scores.find((item: any) => item.rubric_id === rubricId) || null;
};

const submitTask = async () => {
    if (demoMode) {
        const payload = {
            submission_url: form.url,
            submission_note: form.note,
            submitted_at: new Date().toISOString(),
            grade: null,
            feedback: null,
        };
        saveDemoAssignmentSubmission(id, payload);
        submission.value = payload;
        isEditingSubmission.value = false;
        return;
    }
    const studentData = localStorage.getItem('student');
    if (!studentData) return;
    const student = JSON.parse(studentData);

    submitting.value = true;
    try {
        await api.post(`/assignments/${id}/submit`, form, {
            headers: { 'X-Student-ID': student.id }
        });

        await dialog.alert('Tugas berhasil dikirim!');
        isEditingSubmission.value = false;
        // Reload to show submission state
        loadData();
    } catch (e) {
        await dialog.alert('Gagal mengirim tugas. Cek koneksi.');
        console.error(e);
    } finally {
        submitting.value = false;
    }
};

onMounted(loadData);
onMounted(() => {
    if (!demoMode) {
        pollingInterval = setInterval(() => {
            if (!isEditingSubmission.value) {
                loadData(true);
            }
        }, 5000);
    }
});

onUnmounted(() => {
    if (pollingInterval) clearInterval(pollingInterval);
});

const startEditSubmission = () => {
    isEditingSubmission.value = true;
    submission.value = null;
};
</script>
