<template>
  <div class="bg-white p-6 rounded shadow">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">Detail Kuis: {{ quiz?.title }}</h2>
      <div class="space-x-2">
        <button @click="$router.push('/admin/quizzes')" class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">
          Kembali
        </button>
         <router-link 
          :to="`/admin/quizzes/${route.params.id}/questions/new`"
          class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Tambah Soal
        </router-link>
      </div>
    </div>
    
    <div v-if="loading" class="text-center py-4">Loading...</div>
    
    <div v-else class="space-y-6">
      <!-- Quiz Info -->
      <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
         <div>
           <span class="text-sm text-gray-500 block">Judul</span>
           <span class="font-medium">{{ quiz?.title }}</span>
         </div>
         <div>
           <span class="text-sm text-gray-500 block">Nilai KKM</span>
           <span class="font-medium">{{ quiz?.passing_score }}</span>
         </div>
      </div>

      <!-- Questions List -->
      <h3 class="text-lg font-bold border-b pb-2">Daftar Soal</h3>
      
      <div v-if="questions.length === 0" class="text-center text-gray-500 py-4">
        Belum ada soal.
      </div>

      <div v-for="(q, index) in questions" :key="q.id" class="border rounded p-4 relative">
        <div class="flex justify-between">
          <div class="font-bold text-lg mb-2">Soal {{ index + 1 }} <span class="text-xs bg-gray-200 px-2 py-1 rounded ml-2">{{ q.question_type }}</span></div>
           <button @click="deleteQuestion(q.id)" class="text-red-600 text-sm hover:underline">Hapus</button>
        </div>
        
        <!-- Render question text with math -->
        <div class="bg-gray-50 p-3 rounded mb-3">
          <MathRenderer :content="q.question_text" />
        </div>

        <!-- Render Options based on Type -->
        <div class="pl-4">

            <!-- Multiple Choice & True/False -->
            <div v-if="q.question_type === 'multiple_choice' || q.question_type === 'true_false'" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="(opt, i) in q.options" :key="i" 
                    :class="{'text-green-600 font-bold': opt === q.correct_answer, 'text-gray-700': opt !== q.correct_answer}"
                >
                    {{ String.fromCharCode(65 + (i as number)) }}. {{ opt }}
                    <span v-if="opt === q.correct_answer">✓</span>
                </div>
            </div>

            <!-- Multiple Answer -->
            <div v-else-if="q.question_type === 'multiple_answer'" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                 <div v-for="(opt, i) in q.options" :key="i"
                     :class="{'text-green-600 font-bold': isCorrectMultiple(q.correct_answer, opt), 'text-gray-700': !isCorrectMultiple(q.correct_answer, opt)}"
                 >
                    [ {{ isCorrectMultiple(q.correct_answer, opt) ? 'X' : ' ' }} ] {{ opt }}
                 </div>
            </div>

            <!-- Short Answer -->
            <div v-else-if="q.question_type === 'short_answer'" class="text-gray-900">
                <span class="font-medium">Kunci Jawaban:</span> 
                <span class="text-green-600 font-bold ml-2">{{ q.correct_answer }}</span>
            </div>

            <!-- Matching -->
            <div v-else-if="q.question_type === 'matching'" class="space-y-1">
                 <div v-for="(opt, i) in q.options" :key="i" class="flex items-center space-x-2 border-b pb-1 last:border-0">
                    <span class="font-medium text-gray-800">{{ getMatchingPair(opt).left }}</span>
                    <span class="text-gray-400">---</span>
                    <span class="font-bold text-green-700">{{ getMatchingPair(opt).right }}</span>
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
import api from '../../api';

const route = useRoute();
const quizId = route.params.id;
const quiz = ref<any>(null);
const questions = ref<any[]>([]);
const loading = ref(true);


const fetchData = async () => {
  loading.value = true;
  try {
    // Assumption: GET /quizzes/:id returns quiz info AND questions or we fetch separately.
    // If backend doesn't support questions in getting quiz, we might need a separate call.
    // For now assuming we can fetch quiz info first.
    const { data } = await api.get(`/quizzes/${quizId}`);
    quiz.value = data;
    
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

const deleteQuestion = async (id: string) => {
   if (!confirm('Hapus soal ini?')) return;
   try {
     // Assumption: DELETE /questions/:id or /quizzes/:quizId/questions/:id
     // Usually REST is DELETE /questions/:id
     await api.delete(`/questions/${id}`);
     await fetchData();
   } catch (e) {
     alert("Gagal menghapus soal (Mungkin API belum support delete question)");
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
