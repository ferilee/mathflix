<template>
  <div class="px-4 md:px-12 py-8 max-w-4xl mx-auto min-h-screen text-white">
     <h1 class="text-3xl font-bold mb-8">Papan Pengumuman</h1>

     <div class="space-y-6">
        <div 
          v-for="item in announcements" 
          :key="item.id" 
          class="bg-gray-800 rounded-lg p-6 border-l-4 border-red-600 shadow-lg"
        >
           <div class="flex justify-between items-start mb-2">
              <h2 class="text-xl font-bold text-white">{{ item.title }}</h2>
              <span class="text-xs text-gray-400">{{ new Date(item.created_at).toLocaleDateString() }}</span>
           </div>
           <p class="text-gray-300 whitespace-pre-line">{{ item.content }}</p>
        </div>

        <div v-if="announcements.length === 0" class="text-center text-gray-500 py-12">
            Belum ada pengumuman terbaru.
        </div>
     </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';

const announcements = ref<any[]>([]);

onMounted(async () => {
    try {
        const { data } = await api.get('/announcements');
        announcements.value = data;
        
        // Mark as read (save latest timestamp)
        if (data.length > 0) {
            const latest = data[0].created_at; // Assuming sorted desc
            localStorage.setItem('lastReadAnnouncement', latest);
        }
    } catch (e) {
        console.error(e);
    }
});
</script>
