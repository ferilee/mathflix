<template>
  <div class="bg-white p-6 rounded shadow">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">Manajemen Materi</h2>
      <router-link 
        to="/admin/materials/new"
        class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Tambah Materi
      </router-link>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Jurusan</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="material in materials" :key="material.id">
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ material.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ material.major_target }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <router-link 
                :to="`/admin/materials/${material.id}/edit`"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                Edit
              </router-link>
              <button 
                @click="deleteMaterial(material.id)"
                class="text-red-600 hover:text-red-900"
              >
                Hapus
              </button>
            </td>
          </tr>
          <tr v-if="materials.length === 0">
            <td colspan="3" class="px-6 py-4 text-center text-gray-500">Belum ada materi.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../api';

interface Material {
  id: string;
  title: string;
  major_target: string;
}

const materials = ref<Material[]>([]);

const fetchMaterials = async () => {
  try {
    const { data } = await api.get('/materials');
    materials.value = data;
  } catch (e) {
    console.error("Gagal mengambil materi", e);
  }
};

const deleteMaterial = async (id: string) => {
  if (!confirm('Yakin ingin menghapus materi ini?')) return;
  try {
    await api.delete(`/materials/${id}`);
    await fetchMaterials();
  } catch (e) {
    alert("Gagal menghapus materi");
  }
};

onMounted(fetchMaterials);
</script>
