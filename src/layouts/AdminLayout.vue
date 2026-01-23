<template>
  <div class="flex h-screen bg-gray-100 dark:bg-slate-900 font-sans transition-colors duration-300">
    <!-- Sidebar (Desktop) -->
    <aside class="w-64 bg-slate-800 text-white flex-col hidden md:flex">
      <div class="p-6 text-2xl font-bold tracking-wide border-b border-slate-700">
        Mathflix Guru
      </div>
      <nav class="flex-1 px-4 py-6 space-y-2">
        <router-link to="/admin/dashboard" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Dashboard
        </router-link>
        <router-link to="/admin/students" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Siswa
        </router-link>
        <router-link to="/admin/activity" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>
          Aktivitas
        </router-link>
        <router-link to="/admin/materials" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          Materi
        </router-link>
        <router-link to="/admin/quizzes" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m9 15 2 2 4-4"></path></svg>
           Kuis
        </router-link>
        <router-link to="/admin/question-bank" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><path d="M8 6h8"></path><path d="M8 10h8"></path></svg>
          Bank Soal
        </router-link>
        <router-link to="/admin/material-analytics" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>
          Analitik Materi
        </router-link>
        <router-link to="/admin/announcements" class="nav-item">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
           Pengumuman
        </router-link>
        <router-link to="/admin/discuss" class="nav-item">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
           Diskusi
        </router-link>
        <router-link to="/admin/assignments" class="nav-item">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
           Tugas
        </router-link>
        <router-link to="/admin/reflections" class="nav-item">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
           Jurnal Siswa
        </router-link>
        <router-link to="/admin/grading" class="nav-item">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
           Penilaian
        </router-link>
      </nav>
      <div class="p-4 border-t border-slate-700 text-sm text-slate-400">
        V 1.0.0
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto pb-20 md:pb-0">
      <header class="bg-white dark:bg-slate-800 shadow sm:px-6 px-4 py-4 flex items-center justify-between transition-colors duration-300">
        <div class="flex items-center gap-3">
          <!-- Mobile Dashboard Link -->
          <router-link to="/admin/dashboard" class="md:hidden text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </router-link>
          <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {{ routeName }}
          </h1>
        </div>
        <div class="flex items-center gap-4">
             <button @click="toggleTheme" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition">
                <span v-if="isDark" class="text-yellow-400 text-xl">☀</span>
                <span v-else class="text-gray-500 text-xl">🌙</span>
             </button>
             <div class="text-sm text-gray-500 dark:text-gray-300">Guru / Pengajar</div>
        </div>
      </header>
      <div class="p-6">
        <router-view></router-view>
      </div>
    </main>

    <!-- Expandable Menu (FAB) -->
    <div class="md:hidden fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2">
      <transition name="fade">
        <div v-if="showMenu" class="flex flex-col gap-2 mb-2">
          <router-link to="/admin/students" class="bg-indigo-600 text-white p-3 rounded-full shadow-lg flex items-center gap-2" @click="showMenu = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span class="text-sm font-bold pr-2">Siswa</span>
          </router-link>
          <router-link to="/admin/materials" class="bg-indigo-600 text-white p-3 rounded-full shadow-lg flex items-center gap-2" @click="showMenu = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            <span class="text-sm font-bold pr-2">Materi</span>
          </router-link>
          <router-link to="/admin/quizzes" class="bg-indigo-600 text-white p-3 rounded-full shadow-lg flex items-center gap-2" @click="showMenu = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m9 15 2 2 4-4"></path></svg>
            <span class="text-sm font-bold pr-2">Kuis</span>
          </router-link>
        </div>
      </transition>
      <button @click="showMenu = !showMenu" class="bg-pink-600 text-white p-4 rounded-full shadow-lg hover:bg-pink-700 transition transform hover:scale-105">
         <svg v-if="!showMenu" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
         <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <!-- Bottom Navigation (Mobile Only) -->
    <div class="md:hidden fixed bottom-0 w-full bg-slate-900 border-t border-slate-700 flex justify-between p-2 z-50 text-xs shadow-lg">
      <router-link to="/admin/announcements" class="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-1/5" active-class="text-indigo-400 font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        <span>Info</span>
      </router-link>
      <router-link to="/admin/discuss" class="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-1/5" active-class="text-indigo-400 font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        <span>Diskusi</span>
      </router-link>
      <router-link to="/admin/assignments" class="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-1/5" active-class="text-indigo-400 font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
        <span>Tugas</span>
      </router-link>
      <router-link to="/admin/reflections" class="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-1/5" active-class="text-indigo-400 font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
        <span>Jurnal</span>
      </router-link>
      <router-link to="/admin/grading" class="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-1/5" active-class="text-indigo-400 font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
        <span>Nilai</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const routeName = computed(() => route.meta.title || 'Dashboard');
const showMenu = ref(false);

const isDark = ref(false);

const toggleTheme = () => {
    isDark.value = !isDark.value;
    if (isDark.value) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('admin_theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('admin_theme', 'light');
    }
};

onMounted(() => {
    const saved = localStorage.getItem('admin_theme');
    if (saved === 'dark') {
        isDark.value = true;
        document.documentElement.classList.add('dark');
    } else {
        isDark.value = false;
        document.documentElement.classList.remove('dark');
    }
});
</script>

<style scoped>
.nav-item {
  @apply flex items-center gap-3 px-4 py-2 rounded transition-colors duration-200 text-slate-300 hover:bg-slate-700 hover:text-white;
}
.nav-item.router-link-active {
  @apply bg-indigo-600 text-white;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
