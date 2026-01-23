<template>
  <div class="max-w-4xl mx-auto p-6 text-white min-h-[80vh]">
    <h1 class="text-4xl font-extrabold text-yellow-500 mb-8 text-center uppercase tracking-widest drop-shadow-md">
       🏆 Leaderboard
    </h1>

    <div v-if="loading" class="text-center py-10">Loading ranks...</div>

    <div v-else class="bg-gray-800 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
       <div class="grid grid-cols-12 bg-gray-900 p-4 font-bold text-gray-400 border-b border-gray-700">
          <div class="col-span-2 text-center">Rank</div>
          <div class="col-span-6">Student</div>
          <div class="col-span-4 text-right">Points</div>
       </div>

       <div
        v-for="(entry, index) in leaderboard"
        :key="index"
        class="grid grid-cols-12 p-4 border-b border-gray-700/50 items-center hover:bg-gray-700/50 transition"
        :class="{
            'bg-yellow-900/20': index === 0,
            'bg-gray-800': index > 2
        }"
       >
          <div class="col-span-2 text-center font-bold text-xl" :class="{
              'text-yellow-400 text-3xl': index === 0,
              'text-gray-300': index > 0
          }">
              {{ index + 1 }}
          </div>
          <div class="col-span-6 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                  {{ getInitial(entry.student_name) }}
              </div>
              <span class="font-medium text-lg">{{ getDisplayName(entry.student_name) }}</span>
          </div>
          <div class="col-span-4 text-right font-mono text-xl text-green-400">
              {{ entry.total_score }} XP
          </div>
       </div>

       <div v-if="leaderboard.length === 0" class="p-8 text-center text-gray-500">
          No records yet. Be the first!
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';

const leaderboard = ref<any[]>([]);
const loading = ref(true);

const getDisplayName = (name: string | null | undefined) => {
  return name && name.trim() ? name : 'Siswa';
};

const getInitial = (name: string | null | undefined) => {
  const display = getDisplayName(name);
  return display.charAt(0).toUpperCase();
};

const fetchLeaderboard = async () => {
  try {
    // Try fetching from specific endpoint
    // If 404, we might need a backup strategy or I'll implement the endpoint.
    const { data } = await api.get('/leaderboard');
    leaderboard.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Failed to fetch leaderboard", e);
    // Fallback: Fetch all results and aggregate manually if API missing (not ideal but safe fallback)
    // Or just alert. I'll prefer ensuring the endpoint exists in next step.
  } finally {
    loading.value = false;
  }
};

onMounted(fetchLeaderboard);
</script>
