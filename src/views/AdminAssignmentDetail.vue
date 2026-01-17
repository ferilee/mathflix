<template>
  <div class="p-6">
      <button @click="$router.push('/admin/assignments')" class="text-gray-500 hover:text-black mb-4 flex items-center gap-2">
          ← Kembali ke Manajemen Tugas
      </button>

      <div v-if="loading" class="text-center py-10">Memuat data...</div>
      
      <div v-else-if="!assignment" class="text-red-500">Tugas tidak ditemukan.</div>
      
      <div v-else>
          <div class="bg-white p-6 rounded shadow mb-6">
              <h1 class="text-2xl font-bold mb-2">{{ assignment.title }}</h1>
               <div class="text-gray-600 mb-4 line-clamp-2">
                 <MathRenderer :content="assignment.description" />
               </div>
              <div class="flex gap-4 text-sm text-gray-500">
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">Due: {{ new Date(assignment.due_date).toLocaleString() }}</span>
                  <span class="bg-gray-100 px-2 py-1 rounded">Total Siswa: {{ list.length }}</span>
                  <span class="bg-green-100 text-green-800 px-2 py-1 rounded">Submitted: {{ submittedCount }}</span>
              </div>
          </div>

          <!-- Submission Table -->
          <div class="bg-white rounded shadow overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                      <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Siswa</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link Tugas</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai</th>
                          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="item in list" :key="item.student.id">
                          <td class="px-6 py-4 whitespace-nowrap">
                              <div class="font-bold text-gray-900">{{ item.student.full_name }}</div>
                              <div class="text-xs text-gray-500">{{ item.student.grade_level }} {{ item.student.major }}</div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                              <span v-if="item.status === 'submitted'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Submitted
                              </span>
                              <span v-else class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  Missing
                              </span>
                              <div v-if="item.submission" class="text-[10px] text-gray-400 mt-1">
                                  {{ new Date(item.submission.submitted_at).toLocaleDateString() }}
                              </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm">
                              <div v-if="item.submission?.submission_url">
                                  <a :href="item.submission.submission_url" target="_blank" class="text-indigo-600 hover:text-indigo-900 underline truncate max-w-[150px] block">
                                      Buka Link ↗
                                  </a>
                                  <div class="text-xs text-gray-500 mt-1 italic w-40 truncate" v-if="item.submission.submission_note">"{{ item.submission.submission_note }}"</div>
                              </div>
                              <span v-else class="text-gray-400">-</span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                              <div v-if="item.submission?.grade !== null && item.submission?.grade !== undefined" class="font-bold text-gray-900">
                                  {{ item.submission.grade }}
                              </div>
                              <span v-else class="text-gray-400">-</span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button @click="openGradeModal(item)" class="text-indigo-600 hover:text-indigo-900 font-bold">
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

              <div class="flex justify-end gap-3">
                  <button @click="showModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Batal</button>
                  <button @click="saveGrade" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Simpan Nilai</button>
              </div>
          </div>
      </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';
import MathRenderer from '../components/MathRenderer.vue';

const route = useRoute();
const id = route.params.id as string;

const assignment = ref<any>(null);
const list = ref<any[]>([]);
const loading = ref(true);

const showModal = ref(false);
const selectedItem = ref<any>(null);
const gradeForm = reactive({
    grade: 0,
    feedback: ''
});

const submittedCount = computed(() => list.value.filter(i => i.status === 'submitted').length);

const loadData = async () => {
    try {
        const [assignRes, subRes] = await Promise.all([
            api.get(`/assignments/${id}`),
            api.get(`/assignments/${id}/submissions`)
        ]);
        assignment.value = assignRes.data;
        list.value = subRes.data;
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

const openGradeModal = (item: any) => {
    selectedItem.value = item;
    gradeForm.grade = item.submission?.grade || 0;
    gradeForm.feedback = item.submission?.feedback || '';
    showModal.value = true;
};

const saveGrade = async () => {
    if (!selectedItem.value) return;
    
    try {
        await api.post(`/assignments/${id}/grade`, {
            student_id: selectedItem.value.student.id,
            grade: gradeForm.grade,
            feedback: gradeForm.feedback
        });
        
        // Update local state
        // If submission didn't exist (missing), it will be created on backend.
        // We should reload to get proper ID and dates, or just mock it update.
        // Let's reload for consistency.
        showModal.value = false;
        await loadData();
        
    } catch (e: any) {
        alert('Gagal menyimpan nilai');
        console.error(e);
    }
};

onMounted(loadData);
</script>
