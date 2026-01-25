<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Manajemen Guru</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Tambahkan guru baru agar dapat login menggunakan NIP, nama lengkap, dan asal sekolah.
      </p>

      <form @submit.prevent="handleAdd" class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">NIP</label>
          <input
            v-model="form.nip"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600"
            placeholder="1987xxxxxx"
            required
          />
          <p class="text-[10px] text-gray-500 mt-2">Gunakan NIP resmi yang unik.</p>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Nama Lengkap</label>
          <input
            v-model="form.full_name"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600"
            placeholder="Nama lengkap guru"
            required
          />
          <p class="text-[10px] text-gray-500 mt-2">Sesuai data admin, gunakan kapital yang konsisten.</p>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Asal Sekolah</label>
          <input
            v-model="form.school"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600"
            placeholder="SMK Negeri ..."
            required
          />
          <p class="text-[10px] text-gray-500 mt-2">Contoh: SMK Negeri 1.</p>
        </div>
        <div class="md:col-span-3 flex items-center justify-between gap-4">
          <div v-if="error" class="text-xs text-red-500">{{ error }}</div>
          <div v-else-if="success" class="text-xs text-emerald-600">{{ success }}</div>
          <button type="submit" class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
            Simpan Guru
          </button>
        </div>
      </form>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded shadow overflow-hidden transition-colors">
      <div class="p-6 flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-800 dark:text-white">Daftar Guru</h2>
        <button @click="refresh" class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Muat Ulang</button>
      </div>
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead class="bg-gray-50 dark:bg-slate-700">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">NIP</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sekolah</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Terdaftar</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="teacher in teachers" :key="teacher.id">
            <td class="px-4 py-3 text-gray-700 dark:text-gray-200">{{ teacher.nip }}</td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-200">{{ teacher.full_name }}</td>
            <td class="px-4 py-3 text-gray-600 dark:text-gray-300">{{ teacher.school }}</td>
            <td class="px-4 py-3 text-gray-500 dark:text-gray-400">
              {{ new Date(teacher.created_at).toLocaleDateString() }}
            </td>
            <td class="px-4 py-3 text-right">
              <button @click="remove(teacher.id)" class="text-red-600 hover:text-red-700">Hapus</button>
            </td>
          </tr>
          <tr v-if="teachers.length === 0">
            <td colspan="5" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              Belum ada guru terdaftar.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { addTeacherAccount, getTeacherAccounts, removeTeacherAccount } from '../utils/teachers';

const teachers = ref<any[]>([]);
const form = ref({
  nip: '',
  full_name: '',
  school: '',
});
const error = ref('');
const success = ref('');

const refresh = async () => {
  teachers.value = await getTeacherAccounts();
};

const resetMessages = () => {
  error.value = '';
  success.value = '';
};

const handleAdd = async () => {
  resetMessages();
  try {
    const created = await addTeacherAccount({
      nip: form.value.nip,
      full_name: form.value.full_name,
      school: form.value.school,
    });
    teachers.value = [created, ...teachers.value];
    form.value = { nip: '', full_name: '', school: '' };
    success.value = 'Guru berhasil ditambahkan.';
  } catch (err: any) {
    error.value = err?.response?.data?.error || err?.message || 'Gagal menambahkan guru.';
  }
};

const remove = async (id: string) => {
  if (!confirm('Hapus data guru ini?')) return;
  await removeTeacherAccount(id);
  await refresh();
};

onMounted(refresh);
</script>
