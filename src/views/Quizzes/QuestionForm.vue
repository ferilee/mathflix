<template>
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-2xl font-bold mb-6">Tambah Soal Baru</h2>

    <form @submit.prevent="saveQuestion" class="space-y-6">
      
      <!-- Question Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Tipe Soal</label>
        <select v-model="form.question_type" @change="resetOptions" class="mt-1 block w-full rounded border p-2">
          <option value="multiple_choice">Pilihan Ganda (Multiple Choice)</option>
          <option value="multiple_answer">Pilihan Ganda Kompleks (Multiple Answer)</option>
          <option value="true_false">Benar / Salah (True/False)</option>
          <option value="short_answer">Isian Singkat (Short Answer)</option>
          <option value="matching">Menjodohkan (Matching)</option>
        </select>
      </div>

      <!-- Question Text -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Pertanyaan (Teks & LaTeX)</label>
        <div class="h-48 mb-12">
           <QuillEditor 
            v-model:content="form.question_text" 
            content-type="html" 
            theme="snow" 
            toolbar="minimal"
          />
        </div>
      </div>

      <!-- Question Preview -->
      <div class="mt-4 border-t pt-4">
        <label class="block text-sm font-medium text-gray-500 mb-2">Preview Pertanyaan</label>
        <div class="bg-gray-50 p-4 rounded border">
          <MathRenderer :content="form.question_text" />
        </div>
      </div>

      <!-- Options Section -->
      <div class="space-y-4 border-t pt-4" v-if="form.question_type !== 'short_answer'">
        <h3 class="font-medium text-gray-900">
          {{ form.question_type === 'matching' ? 'Pasangan Jawaban' : 'Pilihan Jawaban' }}
        </h3>

        <!-- Multiple Choice (Single Answer) -->
        <div v-if="form.question_type === 'multiple_choice'">
          <div v-for="(_, index) in form.options" :key="index" class="flex items-center space-x-2 mb-2">
            <span class="font-bold w-6">{{ String.fromCharCode(65 + index) }}.</span>
            <input 
              v-model="form.options[index]" 
              type="text" 
              required
              class="flex-1 rounded border p-2"
              :placeholder="`Pilihan ${String.fromCharCode(65 + index)}`"
            />
            <input 
              type="radio" 
              :value="form.options[index]" 
              v-model="form.correct_answer"
              name="correct_answer_mc"
              required
            />
            <span class="text-sm text-gray-500">Benar</span>
          </div>
        </div>

        <!-- Multiple Answer (Checkboxes) -->
        <div v-if="form.question_type === 'multiple_answer'">
          <div v-for="(_, index) in form.options" :key="index" class="flex items-center space-x-2 mb-2">
            <span class="font-bold w-6">{{ String.fromCharCode(65 + index) }}.</span>
            <input 
              v-model="form.options[index]" 
              type="text" 
              required
              class="flex-1 rounded border p-2"
              :placeholder="`Pilihan ${String.fromCharCode(65 + index)}`"
            />
            <input 
              type="checkbox" 
              :value="form.options[index]" 
              v-model="form.correct_answers"
              name="correct_answer_ma"
            />
            <span class="text-sm text-gray-500">Benar</span>
          </div>
           <p class="text-xs text-gray-500 mt-1">* Pilih lebih dari satu jawaban benar.</p>
        </div>

        <!-- True / False -->
        <div v-if="form.question_type === 'true_false'">
          <div class="flex items-center space-x-4">
             <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" v-model="form.correct_answer" value="True" class="form-radio" />
                <span>Benar (True)</span>
             </label>
             <label class="flex items-center space-x-2 cursor-pointer">
                <input type="radio" v-model="form.correct_answer" value="False" class="form-radio" />
                <span>Salah (False)</span>
             </label>
          </div>
        </div>

        <!-- Matching -->
         <div v-if="form.question_type === 'matching'">
          <div v-for="(pair, index) in form.matching_pairs" :key="index" class="flex items-center space-x-2 mb-2">
            <span class="font-bold w-6 text-center">{{ index + 1 }}</span>
            <input 
              v-model="pair.left" 
              type="text" 
              required
              class="flex-1 rounded border p-2"
              placeholder="Pertanyaan / Sisi Kiri"
            />
            <span class="text-gray-500 font-bold"> - </span>
             <input 
              v-model="pair.right" 
              type="text" 
              required
              class="flex-1 rounded border p-2"
              placeholder="Jawaban / Sisi Kanan"
            />
            <button type="button" @click="removeMatchingPair(index)" class="text-red-500 px-2" v-if="form.matching_pairs.length > 2">X</button>
          </div>
          <button type="button" @click="addMatchingPair" class="text-sm text-indigo-600 font-medium hover:underline">+ Tambah Pasangan</button>
        </div>
      </div>

      <!-- Short Answer -->
      <div v-if="form.question_type === 'short_answer'">
        <label class="block text-sm font-medium text-gray-700 mb-1">Kunci Jawaban</label>
        <input 
          v-model="form.correct_answer" 
          type="text" 
          required
          class="w-full rounded border p-2"
          placeholder="Tuliskan jawaban singkat yang benar"
        />
        <p class="text-xs text-gray-500 mt-1">* Jawaban akan dicocokkan secara case-insensitive (biasanya).</p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-4 mt-6">
        <button 
          type="button" 
          @click="$router.back()"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Batal
        </button>
        <button 
          type="submit" 
          class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Simpan Soal
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { QuillEditor } from '@vueup/vue-quill';
import MathRenderer from '../../components/MathRenderer.vue';
import api from '../../api';

const route = useRoute();
const router = useRouter();
const quizId = route.params.quizId;

interface MatchingPair {
  left: string;
  right: string;
}

const form = ref({
  question_text: '',
  question_type: 'multiple_choice',
  options: ['', '', '', ''], // For MC and Multiple Answer
  correct_answer: '', // For MC, T/F, Short Answer
  correct_answers: [] as string[], // For Multiple Answer
  matching_pairs: [{ left: '', right: '' }, { left: '', right: '' }] as MatchingPair[] // For Matching
});


const resetOptions = () => {
    // Reset specific fields when type changes if needed, 
    // but often users might want to keep text.
    form.value.correct_answer = '';
    form.value.correct_answers = [];
    if (form.value.question_type === 'true_false') {
        form.value.options = ['True', 'False']; // Implicit options
    } else if (form.value.question_type === 'matching') {
        form.value.options = [];
    } else if (form.value.question_type === 'short_answer') {
        form.value.options = [];
    } else {
        // MC or Multiple Answer - ensure 4 default options if empty
        if (form.value.options.length === 0) form.value.options = ['', '', '', ''];
    }
};

const addMatchingPair = () => {
  form.value.matching_pairs.push({ left: '', right: '' });
};

const removeMatchingPair = (index: number) => {
  form.value.matching_pairs.splice(index, 1);
};

const saveQuestion = async () => {
  try {
    let payload: any = {
      question_text: form.value.question_text,
      question_type: form.value.question_type,
    };

    if (form.value.question_type === 'multiple_choice') {
        if (!form.value.options.includes(form.value.correct_answer)) {
            alert("Pilih satu jawaban yang benar!");
            return;
        }
        payload.options = form.value.options;
        payload.correct_answer = form.value.correct_answer;

    } else if (form.value.question_type === 'multiple_answer') {
        if (form.value.correct_answers.length === 0) {
             alert("Pilih setidaknya satu jawaban yang benar!");
             return;
        }
        // Ensure options include correct answers (they should as they are bound)
        payload.options = form.value.options;
        // Use correct_answer field to store JSON string or use a new field if backend supports.
        // Assuming backend stores `correct_answer` as a string, we might need to JSON stringify 
        // OR the backend might support `correct_answers` array.
        // Let's assume we store it as a JSON string for simplicity if backend schema is rigid, 
        // OR assume the backend is flexible (NoSQL/JSON column).
        // Based on previous conversations, Drizzle+SQLite JSON support was mentioned.
        // So we can send an array if the API expects it.
        // Let's try sending `correct_answer` as the JSON stringified array to be safe for a single column,
        // or just `correct_answer` if logic permits.
        // Let's send a specific field if possible, or overload `correct_answer`.
        payload.correct_answer = JSON.stringify(form.value.correct_answers);
        payload.options = form.value.options;
        
    } else if (form.value.question_type === 'true_false') {
        if (!form.value.correct_answer) {
             alert("Pilih Benar atau Salah!");
             return;
        }
        payload.options = ['True', 'False'];
        payload.correct_answer = form.value.correct_answer;

    } else if (form.value.question_type === 'short_answer') {
         if (!form.value.correct_answer) {
             alert("Isi kunci jawaban!");
             return;
        }
        payload.correct_answer = form.value.correct_answer;
        payload.options = []; // No options

    } else if (form.value.question_type === 'matching') {
        // Validate pairs
        if (form.value.matching_pairs.some(p => !p.left || !p.right)) {
            alert("Lengkapi semua pasangan!");
            return;
        }
        // Store as JSON in options or correct_answer?
        // Usually matching questions have separate structure.
        // Let's store the pairs in `options` as a JSON string or raw object if API supports it.
        // Re-using `options` to store the Pairs [ {left:..., right:...} ]
        // And `correct_answer` could be just "MATCHING" or stringified pairs.
        payload.options = form.value.matching_pairs.map(p => `${p.left} ||| ${p.right}`); // Encoding as string array for compatibility
        payload.correct_answer = JSON.stringify(form.value.matching_pairs);
    }

    await api.post(`/quizzes/${quizId}/questions`, payload);
    router.push(`/admin/quizzes/${quizId}`);
  } catch (e: any) {
    console.error("Gagal menyimpan soal", e);
    const msg = e.response?.data?.message || e.message || "Gagal menyimpan soal";
    alert(`Error: ${msg}`);
  }
};
</script>
