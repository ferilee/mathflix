<template>
  <div class="max-w-4xl mx-auto p-6 text-white">
    <div v-if="loading" class="text-center py-20">Loading Quiz...</div>
    
    <div v-else-if="result" class="text-center py-10 bg-gray-800 rounded-lg">
      <h2 class="text-3xl font-bold mb-4">Quiz Completed!</h2>
      <div class="text-6xl font-extrabold text-green-500 mb-6">{{ result.score }}</div>
      <p class="text-xl">Correct: {{ result.correct_answers }} / {{ result.total_questions }}</p>
      <div class="mt-8 flex justify-center gap-4">
        <button @click="$router.push('/student')" class="bg-gray-600 px-6 py-2 rounded hover:bg-gray-700">Home</button>
        <button @click="$router.push('/student/leaderboard')" class="bg-yellow-600 px-6 py-2 rounded hover:bg-yellow-700">Leaderboard</button>
      </div>
    </div>

    <div v-else>
      <div class="flex justify-between items-end mb-6 border-b border-gray-700 pb-4">
        <div>
          <h1 class="text-3xl font-bold text-red-500">{{ quiz.title }}</h1>
          <p class="text-gray-400 mt-1">Passing Score: {{ quiz.passing_score }}</p>
        </div>
        <div class="text-right">
             <!-- Timer could go here -->
        </div>
      </div>

      <form @submit.prevent="submitQuiz" class="space-y-12">
        <div v-for="(q, index) in questions" :key="q.id" class="space-y-4">
           <div class="flex gap-4">
             <span class="text-2xl font-bold text-gray-500">{{ index + 1 }}</span>
             <div class="flex-1">
                <div class="bg-gray-800/50 p-4 rounded-lg mb-4 border border-gray-700 text-lg">
                   <MathRenderer :content="q.question_text" />
                </div>

                <!-- Multiple Choice & True/False -->
                <div v-if="q.question_type === 'multiple_choice' || q.question_type === 'true_false'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label 
                      v-for="(opt, i) in q.options" 
                      :key="i"
                      class="flex items-center p-3 rounded border border-gray-700 cursor-pointer hover:bg-gray-800 transition"
                      :class="{'bg-indigo-900 border-indigo-500': answers[q.id] === opt}"
                    >
                      <input 
                        type="radio" 
                        :name="q.id" 
                        :value="opt" 
                        v-model="answers[q.id]" 
                        class="mr-3 w-5 h-5 text-indigo-600"
                        required
                      />
                      <span>{{ opt }}</span>
                    </label>
                </div>

                 <!-- Multiple Answer -->
                <div v-else-if="q.question_type === 'multiple_answer'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                     <label 
                      v-for="(opt, i) in q.options" 
                      :key="i"
                      class="flex items-center p-3 rounded border border-gray-700 cursor-pointer hover:bg-gray-800 transition"
                       :class="{'bg-indigo-900 border-indigo-500': (answers[q.id] || []).includes(opt)}"
                    >
                      <input 
                        type="checkbox" 
                        :value="opt" 
                        v-model="answers[q.id]" 
                        class="mr-3 w-5 h-5 text-indigo-600"
                      />
                      <span>{{ opt }}</span>
                    </label>
                </div>

                <!-- Short Answer -->
                <div v-else-if="q.question_type === 'short_answer'">
                   <input 
                    type="text" 
                    v-model="answers[q.id]" 
                    class="w-full bg-gray-900 border border-gray-700 rounded p-3 focus:border-indigo-500 outline-none"
                    placeholder="Type your answer here..."
                    required
                   />
                </div>

                 <!-- Matching (Simplified for Student: Dropdowns) -->
                 <div v-else-if="q.question_type === 'matching'" class="space-y-2">
                    <div v-for="(pairStr, i) in q.options" :key="i" class="flex items-center gap-4 bg-gray-800 p-2 rounded">
                        <span class="flex-1 font-medium">{{ getLeft(pairStr) }}</span>
                        <span class="text-gray-500">→</span>
                        <select v-model="answers[q.id + '_' + i]" class="flex-1 bg-gray-900 border border-gray-700 rounded p-2 text-white">
                           <option value="" disabled>Select Match</option>
                           <option v-for="p in q.options" :key="p" :value="getRight(p)">{{ getRight(p) }}</option>
                        </select>
                    </div>
                     <!-- Note: Matching submission logic needs careful handling. 
                          Ideally we'd construct the full answer object.
                          For simplicity here, we might skip complex matching grading or assume strict string match of JSON.
                      -->
                 </div>

             </div>
           </div>
        </div>

        <div class="flex justify-end pt-8 border-t border-gray-700">
           <button 
             type="submit" 
             class="bg-red-600 text-white px-8 py-3 rounded font-bold text-lg hover:bg-red-700 transition transform hover:scale-105"
             :disabled="submitting"
           >
             {{ submitting ? 'Submitting...' : 'Submit Quiz' }}
           </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MathRenderer from '../components/MathRenderer.vue';
import api from '../api';

const route = useRoute();
const quizId = route.params.id;

const quiz = ref<any>(null);
const questions = ref<any[]>([]);
const answers = ref<Record<string, any>>({});
const loading = ref(true);
const submitting = ref(false);
const result = ref<any>(null);

// Temporary Student ID (Assuming hardcoded or from auth later)
// Must fetch one from student list or create one.
// For now, let's pick a random UUID or use a hardcoded one if users exist.
// We'll fetch the first student from API for demo purposes.
const studentId = ref('');

const fetchQuiz = async () => {
  try {
    const { data } = await api.get(`/quizzes/${quizId}`);
    quiz.value = data;
    
    // Fetch Questions
    if (data.questions) {
      questions.value = data.questions;
    } else {
       const qIds = await api.get(`/quizzes/${quizId}/questions`); 
       questions.value = qIds.data;
    }

    // Initialize answers for arrays (multiple answer)
    questions.value.forEach(q => {
        if (q.question_type === 'multiple_answer') {
            answers.value[q.id] = [];
        }
    });

  } catch (e) {
    console.error("Error loading quiz", e);
  } finally {
    loading.value = false;
  }
};

const getLeft = (str: string) => str.split(' ||| ')[0];
const getRight = (str: string) => str.split(' ||| ')[1];

const submitQuiz = async () => {
    submitting.value = true;
    try {
        // Fetch a valid student UUID for submission
        if (!studentId.value) {
             const studRes = await api.get('/students');
             if (studRes.data.length > 0) {
                 studentId.value = studRes.data[0].id;
             } else {
                 alert("No students found in DB. Please create a student in Admin first.");
                 submitting.value = false;
                 return;
             }
        }

        // Format answers for backend
        const formattedAnswers = Object.keys(answers.value).map(k => {
            // Handle special cases if needed
             // For Matching, we have answers[q.id + '_' + i]. 
             // This simple logic only handles direct QID mapping. 
             // Complex types excluded from this demo or need improved logic.
             // We stick to simple types for now.
             
             let ans = answers.value[k];
             if (Array.isArray(ans)) {
                 ans = JSON.stringify(ans);
             }
             return {
                 question_id: k,
                 user_answer: ans
             };
        }).filter(a => !a.question_id.includes('_')); // Filter out helper keys (like for matching)

        const payload = {
            student_id: studentId.value,
            quiz_id: quizId,
            answers: formattedAnswers
        };

        const { data } = await api.post('/submit-quiz', payload);
        result.value = data;

    } catch (e) {
        console.error("Submission failed", e);
        alert("Failed to submit quiz.");
    } finally {
        submitting.value = false;
    }
};

onMounted(fetchQuiz);
</script>
