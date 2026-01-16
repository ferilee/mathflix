<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Kelola Pengumuman</h1>

    <!-- Create Form -->
    <div class="bg-white p-6 rounded shadow mb-8">
      <h2 class="text-xl font-bold mb-4">Buat Pengumuman Baru</h2>
      <form @submit.prevent="createAnnouncement" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Judul</label>
          <input 
            v-model="form.title" 
            type="text" 
            required 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
          >
        </div>
        <div>
           <label class="block text-sm font-medium text-gray-700">Isi Pengumuman</label>
           <textarea 
             v-model="form.content" 
             rows="3" 
             required
             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
           ></textarea>
        </div>
        <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Publish</button>
      </form>
    </div>

    <!-- List -->
    <div class="bg-white rounded shadow overflow-hidden">
       <table class="min-w-full divide-y divide-gray-200">
         <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Isi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
         </thead>
         <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in announcements" :key="item.id">
               <td class="px-6 py-4 whitespace-nowrap font-medium">{{ item.title }}</td>
               <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{{ item.content }}</td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ new Date(item.created_at).toLocaleDateString() }}
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="deleteAnnouncement(item.id)" class="text-red-600 hover:text-red-900">Hapus</button>
               </td>
            </tr>
            <tr v-if="announcements.length === 0">
               <td colspan="4" class="px-6 py-4 text-center text-gray-500">Belum ada pengumuman</td>
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
