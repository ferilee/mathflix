<template>
  <div class="bg-white p-6 rounded shadow">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">Manajemen Kuis</h2>
      <button 
        @click="showForm = !showForm"
        class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        {{ showForm ? 'Batal' : 'Buat Kuis Baru' }}
      </button>
    </div>

    <!-- Create Form -->
    <div v-if="showForm" class="mb-8 bg-gray-50 p-4 rounded border">
      <h3 class="font-bold mb-4">Buat Kuis Baru</h3>
      <form @submit.prevent="createQuiz" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="form.title" type="text" placeholder="Judul Kuis" class="border p-2 rounded" required />
        <select v-model="form.material_id" class="border p-2 rounded" required>
          <option value="" disabled>Pilih Materi Terkait</option>
          <option v-for="m in materials" :key="m.id" :value="m.id">{{ m.title }}</option>
        </select>
        <input v-model.number="form.passing_score" type="number" placeholder="Nilai KKM (Passing Score)" class="border p-2 rounded" required />
        
        <div class="md:col-span-2 flex justify-end">
          <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Simpan</button>
        </div>
      </form>
    </div>

    <!-- List Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Kuis</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materi Terkait</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KKM</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="quiz in quizzes" :key="quiz.id">
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ quiz.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ getMaterialTitle(quiz.material_id) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ quiz.passing_score }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <router-link 
                :to="`/admin/quizzes/${quiz.id}`"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                Lihat Soal
              </router-link>
              <button 
                @click="deleteQuiz(quiz.id)"
                class="text-red-600 hover:text-red-900"
              >
                Hapus
              </button>
            </td>
          </tr>
           <tr v-if="quizzes.length === 0">
            <td colspan="4" class="px-6 py-4 text-center text-gray-500">Belum ada kuis.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../api';

interface Quiz {
  id: string;
  material_id: string;
  title: string;
  passing_score: number;
}
interface Material {
  id: string;
  title: string;
}

const quizzes = ref<Quiz[]>([]);
const materials = ref<Material[]>([]);
const showForm = ref(false);
const form = ref({
  title: '',
  material_id: '',
  passing_score: 75
});


const fetchData = async () => {
  try {
    const [quizzesRes, materialsRes] = await Promise.all([
      api.get('/quizzes').catch(() => ({ data: [] })), 
      api.get('/materials').catch(() => ({ data: [] }))
    ]);
    quizzes.value = quizzesRes.data;
    materials.value = materialsRes.data;
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
    await api.post('/quizzes', form.value);
    await fetchData();
    showForm.value = false;
    form.value = { title: '', material_id: '', passing_score: 75 };
  } catch (e) {
    alert("Gagal membuat kuis");
  }
};

const deleteQuiz = async (id: string) => {
  if (!confirm('Yakin ingin menghapus kuis ini?')) return;
  try {
    await api.delete(`/quizzes/${id}`);
    await fetchData();
  } catch (e) {
    alert("Gagal menghapus kuis");
  }
};

onMounted(fetchData);
</script>
