<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Manajemen Materi (DELTA)</h2>
      <router-link to="/admin/materials/new" class="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 font-bold shadow transition flex items-center gap-2">
         <span>+ Buat Materi Baru</span>
      </router-link>
    </div>

    <!-- Stats Review -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
         <!-- Can add stats here later -->
    </div>

    <!-- Filter -->
    <div class="bg-white dark:bg-slate-800 p-4 rounded shadow flex gap-4 transition-colors">
        <div class="flex-1 relative">
             <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
             <input v-model="search" placeholder="Cari judul materi..." class="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-emerald-500 bg-transparent dark:text-white dark:border-gray-600">
        </div>
        <select v-model="filterMajor" class="border rounded px-4 py-2 bg-transparent dark:text-white dark:border-gray-600 dark:bg-slate-700">
            <option class="text-black" value="">Semua Jurusan</option>
            <option class="text-black" value="TKJ">TKJ</option>
            <option class="text-black" value="RPL">RPL</option>
        </select>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="material in filteredMaterials" :key="material.id" class="bg-white dark:bg-slate-800 rounded-lg shadow border dark:border-gray-700 hover:shadow-lg transition-all flex flex-col">
             <div class="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-t-lg flex items-center justify-center text-white p-4 relative overflow-hidden">
                 <div class="absolute inset-0 bg-black/10"></div>
                 <h3 class="text-xl font-bold relative z-10 text-center">{{ material.title }}</h3>
                 <span v-if="material.is_featured" class="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded shadow">FEATURED</span>
             </div>
             <div class="p-6 flex-1 flex flex-col">
                 <div class="flex justify-between items-center mb-4">
                     <span class="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">{{ material.major_target || 'UMUM' }}</span>
                     <span class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{{ material.teacher_name }}</span>
                 </div>
                 <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{{ material.description || 'Tidak ada deskripsi singkat.' }}</p>
                 
                 <div class="mt-auto flex justify-end gap-2 pt-4 border-t dark:border-gray-700">
                     <button @click="$router.push(`/admin/materials/`+material.id+`/edit`)" class="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-1.5 rounded text-sm font-bold transition">Edit</button>
                     <button @click="deleteMaterial(material.id)" class="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-1.5 rounded text-sm font-bold transition">Hapus</button>
                 </div>
             </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredMaterials.length === 0" class="col-span-full text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded shadow">
            Belum ada materi pelajaran.
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../../api';

const materials = ref<any[]>([]);
const search = ref('');
const filterMajor = ref('');
const loading = ref(true);

const filteredMaterials = computed(() => {
    return materials.value.filter(m => {
        const matchTitle = m.title.toLowerCase().includes(search.value.toLowerCase());
        const matchMajor = filterMajor.value ? m.major_target === filterMajor.value : true;
        return matchTitle && matchMajor;
    });
});

const loadMaterials = async () => {
    try {
        const { data } = await api.get('/materials');
        materials.value = data;
    } catch (e) {
        console.error("Failed to load materials");
    } finally {
        loading.value = false;
    }
};

const deleteMaterial = async (id: string) => {
    if (!confirm('Hapus materi ini?')) return;
    try {
        await api.delete(`/materials/${id}`);
        await loadMaterials();
    } catch (e) {
        alert('Gagal menghapus');
    }
};

onMounted(loadMaterials);
</script>
