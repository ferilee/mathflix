<template>
  <div class="px-4 md:px-12 py-8 min-h-screen text-white pb-24">
      <h1 class="text-3xl font-bold mb-2">Jurnal Refleksi</h1>
      <p class="text-gray-400 mb-8">Refleksikan apa yang telah kamu pelajari hari ini (Tahap Transform)</p>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Form Section -->
          <div class="lg:col-span-1">
              <div class="bg-gray-800 p-6 rounded-xl border border-gray-700 sticky top-4">
                  <h2 class="font-bold text-xl mb-4">Tulis Jurnal Baru</h2>

                  <div class="mb-4">
                      <label class="block text-gray-400 text-sm mb-2">Topik (Opsional)</label>
                      <input v-model="form.topic" placeholder="Misal: Fungsi Linear" class="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:outline-none focus:border-indigo-500">
                  </div>

                  <div class="mb-4">
                      <label class="block text-gray-400 text-sm mb-2">Bagaimana perasaanmu?</label>
                      <div class="flex gap-2">
                          <button @click="form.mood = 'happy'" :class="['text-2xl p-2 rounded transition', form.mood === 'happy' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600']">😄</button>
                          <button @click="form.mood = 'neutral'" :class="['text-2xl p-2 rounded transition', form.mood === 'neutral' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600']">😐</button>
                          <button @click="form.mood = 'confused'" :class="['text-2xl p-2 rounded transition', form.mood === 'confused' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600']">😕</button>
                          <button @click="form.mood = 'frustrated'" :class="['text-2xl p-2 rounded transition', form.mood === 'frustrated' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600']">😫</button>
                      </div>
                  </div>

                  <div class="mb-4">
                      <label class="block text-gray-400 text-sm mb-2">Apa yang kamu pelajari? Apa yang sulit?</label>
                      <textarea v-model="form.content" rows="4" class="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded focus:outline-none focus:border-indigo-500" placeholder="Ceritakan progres belajarmu..."></textarea>
                  </div>

                  <button @click="submitReflection" :disabled="loadingSubmit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition disabled:opacity-50">
                      {{ loadingSubmit ? 'Menyimpan...' : 'Simpan Jurnal' }}
                  </button>
              </div>
          </div>

          <!-- Timeline Section -->
          <div class="lg:col-span-2 space-y-6">
              <h2 class="font-bold text-xl">Riwayat Refleksi</h2>
              <div v-if="loading" class="text-center text-gray-400">Memuat riwayat...</div>
              <div v-else-if="reflections.length === 0" class="text-center text-gray-500 bg-gray-800 p-8 rounded-xl border border-gray-700">
                  Belum ada catatan jurnal. Mulailah menulis hari ini!
              </div>

              <div v-for="ref in reflections" :key="ref.id" class="bg-gray-800 p-6 rounded-xl border border-gray-700 relative">
                  <!-- Mood Badge -->
                  <div class="absolute top-4 right-4 text-2xl">
                    {{ getMoodEmoji(ref.mood) }}
                  </div>

                  <div class="mb-2">
                       <span class="text-xs text-indigo-400 font-bold uppercase tracking-wider">{{ ref.topic || 'General' }}</span>
                       <span class="text-xs text-gray-500 ml-2">• {{ new Date(ref.created_at).toLocaleString() }}</span>
                  </div>

                  <p class="text-gray-300 whitespace-pre-line leading-relaxed">{{ ref.content }}</p>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import api from '../api';
import { isDemoMode, getDemoReflections, saveDemoReflections } from '../utils/demo';

const reflections = ref<any[]>([]);
const loading = ref(true);
const loadingSubmit = ref(false);
const demoMode = isDemoMode();

const form = reactive({
    content: '',
    mood: 'neutral',
    topic: ''
});

const getMoodEmoji = (mood: string) => {
    switch(mood) {
        case 'happy': return '😄';
        case 'neutral': return '😐';
        case 'confused': return '😕';
        case 'frustrated': return '😫';
        default: return '😐';
    }
};

const loadReflections = async () => {
    if (demoMode) {
        reflections.value = getDemoReflections();
        loading.value = false;
        return;
    }
    const studentData = localStorage.getItem('student');
    if (!studentData) return;
    const student = JSON.parse(studentData);

    loading.value = true;
    try {
        const { data } = await api.get('/reflections/my-reflections', {
            headers: { 'X-Student-ID': student.id }
        });
        reflections.value = data;
    } catch (e) {
        console.error("Failed to load reflections", e);
    } finally {
        loading.value = false;
    }
};

const submitReflection = async () => {
    if (!form.content.trim()) return alert("Isi jurnal tidak boleh kosong!");

    if (demoMode) {
        const newItem = {
            id: `demo-ref-${Date.now()}`,
            content: form.content,
            mood: form.mood,
            topic: form.topic,
            created_at: new Date().toISOString()
        };
        const next = [newItem, ...getDemoReflections()];
        saveDemoReflections(next);
        reflections.value = next;
        form.content = '';
        form.mood = 'neutral';
        form.topic = '';
        return;
    }

    const studentData = localStorage.getItem('student');
    if (!studentData) return;
    const student = JSON.parse(studentData);

    loadingSubmit.value = true;
    try {
        await api.post('/reflections', form, {
            headers: { 'X-Student-ID': student.id }
        });

        // Check for Badges
        const { data: badgeData } = await api.post('/badges/check', {}, {
            headers: { 'X-Student-ID': student.id }
        });

        if (badgeData.new_badges && badgeData.new_badges.length > 0) {
            const names = badgeData.new_badges.map((b: any) => b.icon + ' ' + b.name).join(', ');
            alert(`🎉 Selamat! Kamu mendapatkan lencana baru: ${names}`);
        }

        // Reset and Reload
        form.content = '';
        form.mood = 'neutral';
        form.topic = '';
        await loadReflections();
    } catch (e: any) {
        alert("Gagal menyimpan jurnal: " + (e.response?.data?.error || e.message));
    } finally {
        loadingSubmit.value = false;
    }
};

onMounted(loadReflections);
</script>
