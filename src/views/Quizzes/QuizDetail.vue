<template>
  <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800 dark:text-white">Detail Kuis: {{ quiz?.title }}</h2>
      <div class="space-x-2">
        <button @click="$router.push('/admin/quizzes')" class="px-4 py-2 border rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 dark:border-slate-600 transition">
          Kembali
        </button>
         <router-link
          :to="`/admin/quizzes/${route.params.id}/questions/new`"
          class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Tambah Soal
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="text-center py-4 text-gray-500">Loading...</div>

    <div v-else class="space-y-6">
      <!-- Quiz Info -->
      <div class="bg-gray-50 dark:bg-slate-700/50 p-4 rounded border dark:border-slate-700 space-y-4">
         <!-- Edit Mode Toggle -->
         <div class="flex justify-between items-center border-b dark:border-gray-700 pb-3">
            <h3 class="font-bold text-gray-800 dark:text-white">Informasi Kuis</h3>
            <button @click="editMode = !editMode" class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
               {{ editMode ? 'Batal Edit' : 'Edit Info Kuis' }}
            </button>
         </div>

         <!-- View Mode -->
         <div v-if="!editMode" class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm text-gray-500 dark:text-gray-400 block">Judul</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ quiz?.title }}</span>
            </div>
            <div>
              <span class="text-sm text-gray-500 dark:text-gray-400 block">Nilai KKM</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ quiz?.passing_score }}</span>
            </div>
            <div class="col-span-2" v-if="quiz?.image_url">
              <span class="text-sm text-gray-500 dark:text-gray-400 block mb-2">Background Image</span>
              <div class="w-64 aspect-video rounded-md overflow-hidden relative">
                 <img :src="resolveStorageUrl(quiz.image_url)" alt="Quiz background" class="w-full h-full object-cover">
                 <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <p class="text-white font-bold text-sm">{{ quiz.title }}</p>
                 </div>
              </div>
            </div>
         </div>

         <!-- Edit Mode -->
         <form v-else @submit.prevent="saveQuizInfo" class="space-y-4">
            <div>
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Kuis</label>
               <input v-model="editForm.title" type="text" required class="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nilai KKM</label>
               <input v-model.number="editForm.passing_score" type="number" required min="0" max="100" class="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
              <ImageUploader
                v-model="editForm.image_url"
                label="URL Background Image"
                placeholder="https://images.unsplash.com/photo-..."
                uploadLabel="Upload"
                :preview-title="editForm.title || 'Judul Kuis'"
                helper-text="Gambar akan ditampilkan sebagai background kartu di dashboard siswa."
              />
            </div>
            <div class="flex gap-2">
               <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Simpan</button>
               <button type="button" @click="editMode = false" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500">Batal</button>
            </div>
         </form>
      </div>

      <!-- Questions List -->
      <h3 class="text-lg font-bold border-b dark:border-gray-700 pb-2 text-gray-800 dark:text-white">Daftar Soal</h3>

      <div v-if="questions.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">
        Belum ada soal.
      </div>

      <div v-for="(q, index) in questions" :key="q.id" class="border dark:border-gray-700 rounded p-4 relative bg-white dark:bg-slate-800 transition-colors shadow-sm">
        <div class="flex justify-between">
          <div class="font-bold text-lg mb-2 text-gray-800 dark:text-white">Soal {{ index + 1 }} <span class="text-xs bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded ml-2">{{ q.question_type }}</span></div>
           <button @click="deleteQuestion(q.id)" class="text-red-600 dark:text-red-400 text-sm hover:underline">Hapus</button>
        </div>

        <!-- Render question text with math -->
        <div class="bg-gray-50 dark:bg-slate-900 p-3 rounded mb-3 text-gray-900 dark:text-gray-200">
          <MathRenderer :content="q.question_text" />
        </div>

        <!-- Render Options based on Type -->
        <div class="pl-4">

            <!-- Multiple Choice & True/False -->
            <div v-if="q.question_type === 'multiple_choice' || q.question_type === 'true_false'" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="(opt, i) in q.options" :key="i"
                    :class="{'text-green-600 dark:text-green-400 font-bold': opt === q.correct_answer, 'text-gray-700 dark:text-gray-300': opt !== q.correct_answer}"
                >
                    {{ String.fromCharCode(65 + (i as number)) }}. {{ opt }}
                    <span v-if="opt === q.correct_answer">✓</span>
                </div>
            </div>

            <!-- Multiple Answer -->
            <div v-else-if="q.question_type === 'multiple_answer'" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                 <div v-for="(opt, i) in q.options" :key="i"
                     :class="{'text-green-600 dark:text-green-400 font-bold': isCorrectMultiple(q.correct_answer, opt), 'text-gray-700 dark:text-gray-300': !isCorrectMultiple(q.correct_answer, opt)}"
                 >
                    [ {{ isCorrectMultiple(q.correct_answer, opt) ? 'X' : ' ' }} ] {{ opt }}
                 </div>
            </div>

            <!-- Short Answer -->
            <div v-else-if="q.question_type === 'short_answer'" class="text-gray-900 dark:text-gray-200">
                <span class="font-medium">Kunci Jawaban:</span>
                <span class="text-green-600 dark:text-green-400 font-bold ml-2">{{ q.correct_answer }}</span>
            </div>

            <!-- Matching -->
            <div v-else-if="q.question_type === 'matching'" class="space-y-1">
                 <div v-for="(opt, i) in q.options" :key="i" class="flex items-center space-x-2 border-b dark:border-gray-700 pb-1 last:border-0 text-gray-800 dark:text-gray-200">
                    <span class="font-medium">{{ getMatchingPair(opt).left }}</span>
                    <span class="text-gray-400">---</span>
                    <span class="font-bold text-green-700 dark:text-green-400">{{ getMatchingPair(opt).right }}</span>
                 </div>
            </div>

            <!-- Fallback -->
             <div v-else class="text-red-500">Tipe soal tidak dikenali.</div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MathRenderer from '../../components/MathRenderer.vue';
import ImageUploader from '../../components/ImageUploader.vue';
import api from '../../api';
import { addAuditLog } from '../../utils/auditLog';
import { useDialog } from '../../utils/dialog';

import { resolveStorageUrl } from '../../utils/storage';

const route = useRoute();
const quizId = route.params.id;
const quiz = ref<any>(null);
const questions = ref<any[]>([]);
const loading = ref(true);
const editMode = ref(false);
const editForm = ref({
  title: '',
  passing_score: 0,
  image_url: ''
});
const dialog = useDialog();


const fetchData = async () => {
  loading.value = true;
  try {
    // Assumption: GET /quizzes/:id returns quiz info AND questions or we fetch separately.
    // If backend doesn't support questions in getting quiz, we might need a separate call.
    // For now assuming we can fetch quiz info first.
    const { data } = await api.get(`/quizzes/${quizId}`);
    quiz.value = data;

    // Populate edit form
    editForm.value = {
      title: data.title || '',
      passing_score: data.passing_score || 0,
      image_url: data.image_url || ''
    };

    // FETCHING QUESTIONS:
    // If questions are not in `data.questions`, we might need to fetch them.
    // Let's assume they might be included or we need another endpoint.
     // In many simple implementations: GET /quizzes/:id/questions
     // Let's try fetching questions separately if not present.
    if (data.questions) {
      questions.value = data.questions;
    } else {
       // Fallback: fetch questions
       const qIds = await api.get(`/quizzes/${quizId}/questions`);
       // Depending on API, sometimes it returns list directly.
       questions.value = qIds.data;
    }
  } catch (e) {
    console.error("Failed to load quiz details", e);
  } finally {
    loading.value = false;
  }
};

const saveQuizInfo = async () => {
  try {
    await api.put(`/quizzes/${quizId}`, editForm.value);
    addAuditLog({
      action: 'update',
      entity: 'quiz',
      entity_id: String(quizId),
      summary: `Update kuis: ${editForm.value.title}`,
    }).catch(() => undefined);
    editMode.value = false;
    await fetchData();
  } catch (e) {
    await dialog.alert('Gagal menyimpan perubahan');
    console.error(e);
  }
};

const deleteQuestion = async (id: string) => {
   const ok = await dialog.confirm('Hapus soal ini?', 'Hapus Soal');
   if (!ok) return;
   try {
     // Assumption: DELETE /questions/:id or /quizzes/:quizId/questions/:id
     // Usually REST is DELETE /questions/:id
     await api.delete(`/questions/${id}`);
     await fetchData();
   } catch (e) {
     await dialog.alert("Gagal menghapus soal (Mungkin API belum support delete question)");
   }
};

// Helper methods for rendering
const isCorrectMultiple = (correctJson: string, option: string) => {
    try {
        const correct = JSON.parse(correctJson);
        return Array.isArray(correct) && correct.includes(option);
    } catch (e) {
        return false;
    }
};

const getMatchingPair = (optionStr: string) => {
  const parts = optionStr.split(' ||| ');
  return { left: parts[0] || '?', right: parts[1] || '?' };
};

onMounted(fetchData);
</script>
