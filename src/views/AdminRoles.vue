<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Role & Permissions</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Matriks ringkas untuk membedakan akses admin dan guru.
      </p>

      <div class="mt-6 overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fitur</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Admin</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Guru</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <tr>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-200">Manajemen Materi</td>
              <td class="px-4 py-3 text-center text-emerald-600 font-bold">YA</td>
              <td class="px-4 py-3 text-center text-emerald-600 font-bold">YA (milik sendiri)</td>
            </tr>
            <tr>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-200">Manajemen Kuis</td>
              <td class="px-4 py-3 text-center text-emerald-600 font-bold">YA</td>
              <td class="px-4 py-3 text-center text-emerald-600 font-bold">YA (milik sendiri)</td>
            </tr>
            <tr>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-200">Pengumuman</td>
              <td class="px-4 py-3 text-center text-emerald-600 font-bold">YA</td>
              <td class="px-4 py-3 text-center text-emerald-600 font-bold">YA (milik sendiri)</td>
            </tr>
            <tr>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-200">Tugas</td>
              <td class="px-4 py-3 text-center text-emerald-600 font-bold">YA</td>
              <td class="px-4 py-3 text-center text-emerald-600 font-bold">YA (milik sendiri)</td>
            </tr>
            <tr>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-200">Data Siswa, Analitik, Bank Soal, Penilaian</td>
              <td class="px-4 py-3 text-center text-emerald-600 font-bold">YA</td>
              <td class="px-4 py-3 text-center text-gray-400 font-semibold">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
      <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Data Wajib Guru</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
        <div class="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded p-4">
          <div class="text-xs font-semibold uppercase text-gray-400 mb-1">Nomor Induk (NIP)</div>
          <div>Disimpan untuk identitas akun guru.</div>
        </div>
        <div class="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded p-4">
          <div class="text-xs font-semibold uppercase text-gray-400 mb-1">Nama Lengkap</div>
          <div>Digunakan sebagai penanda materi/kuis milik guru.</div>
        </div>
        <div class="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded p-4">
          <div class="text-xs font-semibold uppercase text-gray-400 mb-1">Asal Sekolah</div>
          <div>Menandai profil asal institusi guru.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
