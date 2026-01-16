<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded shadow">
      <h2 class="text-2xl font-bold mb-2">Selamat Datang Admin!</h2>
      <p class="text-gray-600">Gunakan menu di sidebar atau kartu di bawah ini untuk mengelola konten Mathflix.</p>
    </div>

    <!-- Quick Access Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Students Card -->
      <div class="bg-white p-6 rounded shadow border-l-4 border-indigo-500 hover:shadow-lg transition">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-800">Siswa</h3>
            <p class="text-sm text-gray-500">Kelola data siswa</p>
          </div>
          <div class="p-2 bg-indigo-100 rounded text-indigo-600">
            👥
          </div>
        </div>
        <router-link to="/admin/students" class="text-indigo-600 font-medium hover:underline text-sm">
          Lihat semua siswa →
        </router-link>
      </div>

      <!-- Materials Card -->
      <div class="bg-white p-6 rounded shadow border-l-4 border-green-500 hover:shadow-lg transition">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-800">Materi</h3>
            <p class="text-sm text-gray-500">Kelola materi pelajaran</p>
          </div>
          <div class="p-2 bg-green-100 rounded text-green-600">
            📚
          </div>
        </div>
        <div class="flex flex-col gap-2">
           <router-link to="/admin/materials" class="text-green-600 font-medium hover:underline text-sm">
            Lihat daftar materi →
          </router-link>
          <router-link to="/admin/materials/new" class="text-gray-500 text-xs hover:text-green-600">
            + Tambah materi baru
          </router-link>
        </div>
      </div>

      <!-- Quizzes Card -->
      <div class="bg-white p-6 rounded shadow border-l-4 border-red-500 hover:shadow-lg transition">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-800">Kuis</h3>
            <p class="text-sm text-gray-500">Kelola kuis dan soal</p>
          </div>
          <div class="p-2 bg-red-100 rounded text-red-600">
            📝
          </div>
        </div>
        <router-link to="/admin/quizzes" class="text-red-600 font-medium hover:underline text-sm">
          Kelola kuis →
        </router-link>
      </div>
    </div>
  </div>
</template>
