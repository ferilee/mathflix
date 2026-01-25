<template>
  <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800 dark:text-white">Manajemen Kuis</h2>
      <button
        @click="showForm = !showForm"
        class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-bold shadow transition"
      >
        {{ showForm ? 'Batal' : 'Buat Kuis Baru' }}
      </button>
    </div>

    <!-- Create Form -->
    <div v-if="showForm" class="mb-8 bg-gray-50 dark:bg-slate-700 p-4 rounded border dark:border-gray-600">
      <h3 class="font-bold mb-4 text-gray-800 dark:text-white">Buat Kuis Baru</h3>
      <form @submit.prevent="createQuiz" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="form.title" type="text" placeholder="Judul Kuis" class="border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600" required />
        <select v-model="form.material_id" class="border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600" required>
          <option value="" disabled class="text-gray-500">Pilih Materi Terkait</option>
          <option v-for="m in materials" :key="m.id" :value="m.id">{{ m.title }}</option>
        </select>
        <input v-model.number="form.passing_score" type="number" placeholder="Nilai KKM (Passing Score)" class="border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600" required />
        <select v-model="form.style" class="border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600">
            <option value="classic">Tampilan Klasik (Formulir)</option>
            <option value="millionaire">Tampilan Millionaire (Game Show)</option>
        </select>
        <div class="md:col-span-2 flex items-center gap-2">
          <input id="use_bank" v-model="form.use_bank" type="checkbox" class="h-4 w-4">
          <label for="use_bank" class="text-sm text-gray-700 dark:text-gray-200">Gunakan Bank Soal (dinamis per siswa)</label>
        </div>
        <div v-if="form.use_bank" class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input v-model.number="form.question_count" type="number" min="1" max="100" placeholder="Jumlah soal" class="border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600" />
          <input v-model.number="form.difficulty_mix.easy" type="number" min="0" placeholder="Mudah" class="border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600" />
          <input v-model.number="form.difficulty_mix.medium" type="number" min="0" placeholder="Sedang" class="border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600" />
          <input v-model.number="form.difficulty_mix.hard" type="number" min="0" placeholder="Sulit" class="border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600" />
        </div>

        <div class="md:col-span-2 border-t dark:border-gray-600 pt-4">
             <ImageUploader
                v-model="form.image_url"
                label="Cover Kuis (Aesthetic Netflix)"
                placeholder="Upload gambar kuis..."
                :previewTitle="form.title || 'Kuis Baru'"
            />
        </div>

        <div class="md:col-span-2 flex justify-end">
          <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-bold">Simpan</button>
        </div>
      </form>
    </div>

    <!-- List Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-slate-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Judul Kuis</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Materi Terkait</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">KKM</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mode</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bank</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-white">
          <tr v-for="quiz in quizzes" :key="quiz.id" class="hover:bg-gray-50 dark:hover:bg-slate-700 transition">
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ quiz.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{{ getMaterialTitle(quiz.material_id) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ quiz.passing_score }}</td>
            <td class="px-6 py-4 whitespace-nowrap capitalize">{{ quiz.style || 'millionaire' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-xs">
              <span v-if="quiz.use_bank" class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Dinamis</span>
              <span v-else class="text-gray-400">Manual</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <router-link
                :to="`/admin/quizzes/${quiz.id}`"
                class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4 font-bold"
              >
                Lihat Soal
              </router-link>
              <button
                @click="deleteQuiz(quiz.id)"
                class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-bold"
              >
                Hapus
              </button>
            </td>
          </tr>
           <tr v-if="quizzes.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Belum ada kuis.</td>
           </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../api';
import ImageUploader from '../../components/ImageUploader.vue';
import { addAuditLog } from '../../utils/auditLog';
import { getStaffActorId, getStaffUser } from '../../utils/auth';

interface Quiz {
  id: string;
  material_id: string;
  title: string;
  passing_score: number;
  style?: string;
  image_url?: string;
  use_bank?: boolean;
}

interface Material {
  id: string;
  title: string;
}

const quizzes = ref<Quiz[]>([]);
const materials = ref<Material[]>([]);
const showForm = ref(false);
const staffUser = ref(getStaffUser());
const actorId = ref(getStaffActorId(staffUser.value));
const isGuru = ref(staffUser.value?.role === 'guru');
const form = ref({
  title: '',
  material_id: '',
  passing_score: 75,
  style: 'millionaire',
  image_url: '',
  use_bank: false,
  question_count: 10,
  difficulty_mix: {
    easy: 4,
    medium: 4,
    hard: 2
  }
});

const fetchData = async () => {
  try {
    const [quizzesRes, materialsRes] = await Promise.all([
      api.get('/quizzes').catch(() => ({ data: [] })),
      api.get('/materials').catch(() => ({ data: [] }))
    ]);
    const quizData = Array.isArray(quizzesRes.data) ? quizzesRes.data : [];
    const materialData = Array.isArray(materialsRes.data) ? materialsRes.data : [];
    if (isGuru.value) {
      quizzes.value = quizData.filter((q: any) => String(q.created_by || '') === actorId.value);
      materials.value = materialData.filter((m: any) => {
        if (String(m.created_by || '') === actorId.value) return true;
        return staffUser.value?.full_name && m.teacher_name === staffUser.value.full_name;
      });
    } else {
      quizzes.value = quizData;
      materials.value = materialData;
    }
  } catch (e) {
    console.error("Gagal mengambil data", e);
  }
};

const getMaterialTitle = (id: string) => {
  const m = materials.value.find(mat => mat.id === id);
  return m ? m.title : id;
};

const createQuiz = async () => {
  try {
    const payload = {
      ...form.value,
      difficulty_mix: form.value.use_bank ? form.value.difficulty_mix : undefined,
      question_count: form.value.use_bank ? form.value.question_count : undefined,
      created_by: actorId.value
    };
    const response = await api.post('/quizzes', payload);
    const createdId = response?.data?.id || response?.data?.quiz_id || response?.data?.data?.id;
    addAuditLog({
      action: 'create',
      entity: 'quiz',
      entity_id: String(createdId || ''),
      summary: `Tambah kuis: ${payload.title}`,
    }).catch(() => undefined);
    await fetchData();
    showForm.value = false;
    form.value = {
      title: '',
      material_id: '',
      passing_score: 75,
      style: 'millionaire',
      image_url: '',
      use_bank: false,
      question_count: 10,
      difficulty_mix: { easy: 4, medium: 4, hard: 2 }
    };
  } catch (e: any) {
    const status = e?.response?.status;
    const serverMessage = e?.response?.data?.message || e?.response?.data?.error;
    const requestUrl = `${e?.config?.baseURL || api.defaults.baseURL || ''}${e?.config?.url || ''}`;
    alert(`Gagal membuat kuis${status ? ` (${status})` : ''}: ${serverMessage || e?.message || 'Terjadi kesalahan.'}${requestUrl ? `\nURL: ${requestUrl}` : ''}`);
    console.error('Create quiz error:', e);
  }
};

const deleteQuiz = async (id: string) => {
  if (!confirm('Yakin ingin menghapus kuis ini?')) return;
  if (isGuru.value) {
    if (!quizzes.value.find((q: any) => String(q.id) === String(id))) {
      alert('Anda hanya dapat menghapus kuis milik Anda sendiri.');
      return;
    }
  }
  try {
    await api.delete(`/quizzes/${id}`);
    addAuditLog({
      action: 'delete',
      entity: 'quiz',
      entity_id: String(id),
      summary: 'Hapus kuis',
    }).catch(() => undefined);
    await fetchData();
  } catch (e) {
    alert("Gagal menghapus kuis");
  }
};

onMounted(fetchData);
</script>
