<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Kelola Pengumuman</h1>

    <!-- Create Form -->
    <div class="bg-white dark:bg-slate-800 p-6 rounded shadow mb-8 transition-colors">
      <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Buat Pengumuman Baru</h2>
      <form @submit.prevent="createAnnouncement" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Judul</label>
          <input 
            v-model="form.title" 
            type="text" 
            required 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 dark:bg-slate-700 dark:text-white dark:border-slate-600"
          >
        </div>
        <div>
           <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Isi Pengumuman</label>
           <textarea
             v-model="form.content"
             rows="3"
             required
             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 dark:bg-slate-700 dark:text-white dark:border-slate-600"
           ></textarea>
        </div>
        <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Publish</button>
      </form>
    </div>

    <!-- List -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6 transition-colors overflow-hidden">
       <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
         <thead class="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Judul</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Isi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tanggal</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
            </tr>
         </thead>
         <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
            <tr v-for="item in announcements" :key="item.id">
               <td class="px-6 py-4 whitespace-nowrap font-medium">{{ item.title }}</td>
               <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{{ item.content }}</td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ new Date(item.created_at).toLocaleDateString() }}
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="deleteAnnouncement(item.id)" class="text-red-600 hover:text-red-900 dark:hover:text-red-400">Hapus</button>
               </td>
            </tr>
            <tr v-if="announcements.length === 0">
               <td colspan="4" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Belum ada pengumuman</td>
            </tr>
         </tbody>
       </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';

const announcements = ref<any[]>([]);
const form = ref({
  title: '',
  content: ''
});

const loadData = async () => {
   try {
     const { data } = await api.get('/announcements');
     announcements.value = data;
   } catch (e) {
     console.error("Failed to load announcements", e);
   }
};

const createAnnouncement = async () => {
    try {
        await api.post('/announcements', form.value);
        form.value = { title: '', content: '' };
        await loadData();
        alert('Pengumuman berhasil dibuat');
    } catch (e) {
        alert('Gagal membuat pengumuman');
    }
};

const deleteAnnouncement = async (id: string) => {
    if (!confirm('Hapus pengumuman ini?')) return;
    try {
        await api.delete(`/announcements/${id}`);
        await loadData();
    } catch (e) {
        alert('Gagal menghapus');
    }
};

onMounted(loadData);
</script>
