<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    <!-- Sidebar (Desktop) -->
    <aside class="w-64 bg-slate-800 text-white flex-col hidden md:flex">
      <div class="p-6 text-2xl font-bold tracking-wide border-b border-slate-700">
        Mathflix Admin
      </div>
      <nav class="flex-1 px-4 py-6 space-y-2">
        <router-link to="/admin/dashboard" class="nav-item">
          Dashboard
        </router-link>
        <router-link to="/admin/students" class="nav-item">
          Siswa
        </router-link>
        <router-link to="/admin/materials" class="nav-item">
          Materi
        </router-link>
        <router-link to="/admin/quizzes" class="nav-item">
           Kuis
        </router-link>
        <router-link to="/admin/announcements" class="nav-item">
           Pengumuman
        </router-link>
        <router-link to="/admin/discuss" class="nav-item">
           Diskusi
        </router-link>
        <router-link to="/admin/assignments" class="nav-item">
           Tugas
        </router-link>
        <router-link to="/admin/reflections" class="nav-item">
           Jurnal Siswa
        </router-link>
      </nav>
      <div class="p-4 border-t border-slate-700 text-sm text-slate-400">
        V 1.0.0
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto pb-20 md:pb-0">
      <header class="bg-white shadow sm:px-6 px-4 py-4 flex items-center justify-between">
        <h1 class="text-xl font-semibold text-gray-800">
          {{ routeName }}
        </h1>
        <div class="text-sm text-gray-500">Admin User</div>
      </header>
      <div class="p-6">
        <router-view></router-view>
      </div>
    </main>

    <!-- Bottom Navigation (Mobile Only) -->
    <div class="md:hidden fixed bottom-0 w-full bg-slate-900 border-t border-slate-700 flex justify-between p-2 z-50 text-xs shadow-lg">
      <router-link to="/admin/dashboard" class="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-1/5" active-class="text-indigo-400 font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        <span>Dash</span>
      </router-link>
      <router-link to="/admin/students" class="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-1/5" active-class="text-indigo-400 font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        <span>Siswa</span>
      </router-link>
      <router-link to="/admin/materials" class="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-1/5" active-class="text-indigo-400 font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        <span>Materi</span>
      </router-link>
      <router-link to="/admin/quizzes" class="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-1/5" active-class="text-indigo-400 font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m9 15 2 2 4-4"></path></svg>
        <span>Kuis</span>
      </router-link>
      <router-link to="/admin/announcements" class="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-1/5" active-class="text-indigo-400 font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        <span>Info</span>
      </router-link>
      <router-link to="/admin/discuss" class="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-1/5" active-class="text-indigo-400 font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        <span>Diskusi</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const routeName = computed(() => route.meta.title || 'Dashboard');
</script>

<style scoped>
.nav-item {
  @apply block px-4 py-2 rounded transition-colors duration-200 text-slate-300 hover:bg-slate-700 hover:text-white;
}
.nav-item.router-link-active {
  @apply bg-indigo-600 text-white;
}
</style>
