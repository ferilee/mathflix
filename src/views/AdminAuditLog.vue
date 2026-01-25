<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Audit Log Perubahan</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Catatan perubahan materi, kuis, pengumuman, dan tugas.
          </p>
        </div>
        <button
          @click="refreshLogs"
          class="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-700 transition"
        >
          Muat Ulang
        </button>
      </div>

      <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select v-model="filterAction" class="border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600">
          <option value="all">Semua Aksi</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
        <select v-model="filterEntity" class="border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600">
          <option value="all">Semua Entitas</option>
          <option value="material">Materi</option>
          <option value="quiz">Kuis</option>
          <option value="announcement">Pengumuman</option>
          <option value="assignment">Tugas</option>
        </select>
        <input
          v-model="searchText"
          type="text"
          placeholder="Cari judul atau aktor..."
          class="border rounded px-3 py-2 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600"
        />
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded shadow overflow-hidden transition-colors">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-slate-700">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Waktu</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Entitas</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ringkasan</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aktor</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <tr v-for="log in filteredLogs" :key="log.id">
            <td class="px-4 py-3 text-gray-500 dark:text-gray-400">
              {{ new Date(log.timestamp).toLocaleString() }}
            </td>
            <td class="px-4 py-3 font-semibold" :class="actionClass(log.action)">
              {{ log.action }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-200 capitalize">
              {{ log.entity }}
            </td>
            <td class="px-4 py-3 text-gray-600 dark:text-gray-300">
              {{ log.summary || '-' }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-200">
              {{ log.actor_name }} ({{ log.actor_role }})
            </td>
          </tr>
          <tr v-if="filteredLogs.length === 0">
            <td colspan="5" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
              Belum ada audit log.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { getAuditLogs, type AuditLogEntry } from '../utils/auditLog';

const logs = ref<AuditLogEntry[]>([]);
const filterAction = ref('all');
const filterEntity = ref('all');
const searchText = ref('');

const refreshLogs = async () => {
  logs.value = await getAuditLogs();
};

const filteredLogs = computed(() => {
  const query = searchText.value.toLowerCase();
  return logs.value.filter((log) => {
    const matchesAction = filterAction.value === 'all' || log.action === filterAction.value;
    const matchesEntity = filterEntity.value === 'all' || log.entity === filterEntity.value;
    const summary = log.summary || '';
    const matchesQuery =
      !query ||
      summary.toLowerCase().includes(query) ||
      log.actor_name.toLowerCase().includes(query);
    return matchesAction && matchesEntity && matchesQuery;
  });
});

const actionClass = (action: string) => {
  if (action === 'create') return 'text-emerald-600';
  if (action === 'update') return 'text-indigo-600';
  if (action === 'delete') return 'text-red-600';
  return 'text-gray-600';
};

onMounted(refreshLogs);
</script>
