<template>
  <div class="min-h-screen bg-gray-900 text-white font-sans">
    <!-- Navbar -->
    <nav class="fixed top-0 z-50 w-full bg-gradient-to-b from-black/80 to-transparent transition-all duration-300" :class="{ 'bg-black': isScrolled }">
      <div class="px-4 md:px-12 py-4 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <router-link to="/student" class="text-2xl font-bold text-red-600 tracking-wider">MATHFLIX</router-link>
          <ul class="hidden md:flex gap-6 text-sm text-gray-300">
            <li><router-link to="/student" class="hover:text-white transition">Home</router-link></li>
            <li><router-link to="/student/leaderboard" class="hover:text-white transition">Leaderboard</router-link></li>
            <li><router-link to="/student/my-list" class="hover:text-white transition">Daftar Saya</router-link></li>
            <li><router-link to="/student/assignments" class="hover:text-white transition">Tugas Saya</router-link></li>
            <li>
                <router-link to="/student/announcements" class="hover:text-white transition relative">
                    Pengumuman
                    <span v-if="hasNotification" class="absolute -top-1 -right-2 w-2 h-2 bg-red-600 rounded-full"></span>
                </router-link>
            </li>
            <li><router-link to="/student/discuss" class="hover:text-white transition">Diskusi</router-link></li>
          </ul>
        </div>
        <div class="flex items-center gap-4 text-sm font-medium relative">
           <!-- Profile Dropdown Trigger -->
           <div 
             v-if="student" 
             class="flex items-center gap-3 cursor-pointer"
             @click="showMenu = !showMenu"
           >
               <span class="hidden sm:block">{{ student.full_name }}</span>
               <div v-if="student.photo_profile" class="w-8 h-8 rounded bg-gray-700 overflow-hidden">
                   <img :src="student.photo_profile" alt="Profile" class="w-full h-full object-cover">
               </div>
               <div v-else class="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold">
                   {{ initials }}
               </div>
           </div>
           
           <!-- Login Button if no user -->
           <router-link v-else to="/login" class="bg-red-600 px-4 py-1 rounded hover:bg-red-700">Masuk</router-link>


           <!-- Dropdown Menu -->
           <div v-if="showMenu" class="absolute top-full right-0 mt-2 w-48 bg-black/90 border border-gray-700 rounded shadow-xl py-2 flex flex-col z-50">
               <div class="px-4 py-2 border-b border-gray-700 text-xs text-gray-400">
                   Logged in as <br> <span class="text-white font-bold">{{ student?.nisn }}</span>
               </div>
               
               <button @click="showDevInfo = true; showMenu = false" class="text-left px-4 py-2 hover:bg-gray-800 text-indigo-400 flex items-center gap-2">
                  <span>ℹ</span> Tentang Aplikasi
               </button>
               
               <button @click="logout" class="text-left px-4 py-2 hover:bg-gray-800 text-red-500">Keluar</button>
           </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="pt-16 pb-20 md:pb-0">
      <router-view />
    </div>

    <!-- Bottom Navigation (Mobile Only) -->
    <div class="md:hidden fixed bottom-0 w-full bg-black/90 border-t border-gray-800 flex justify-around p-3 z-50 text-xs backdrop-blur-md">
      <router-link to="/student" class="flex flex-col items-center gap-1 text-gray-400 hover:text-white" active-class="text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Home</span>
      </router-link>
      <router-link to="/student/leaderboard" class="flex flex-col items-center gap-1 text-gray-400 hover:text-white" active-class="text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2h-6c-1.1 0-2 .9-2 2v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4c0-1.1-.9-2-2-2Z"/></svg>
        <span>Leaderboard</span>
      </router-link>
      <router-link to="/student/my-list" class="flex flex-col items-center gap-1 text-gray-400 hover:text-white" active-class="text-red-600">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
         <span>Daftar Saya</span>
      </router-link>
      <router-link to="/student/announcements" class="flex flex-col items-center gap-1 text-gray-400 hover:text-white relative" active-class="text-red-600">
         <div class="relative">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
             <span v-if="hasNotification" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-black"></span>
         </div>
         <span>Info</span>
      </router-link>
      <router-link to="/student/discuss" class="flex flex-col items-center gap-1 text-gray-400 hover:text-white" active-class="text-red-600">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
         <span>Diskusi</span>
      </router-link>
    </div>

    <!-- Developer Widget (Modal) -->
    <DeveloperWidget :is-open="showDevInfo" @close="showDevInfo = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import DeveloperWidget from '../components/DeveloperWidget.vue';

const router = useRouter();
const isScrolled = ref(false);
const student = ref<any>(null);
const showMenu = ref(false);
const showDevInfo = ref(false);
const hasNotification = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const loadStudent = () => {
    const saved = localStorage.getItem('student');
    if (saved) {
        student.value = JSON.parse(saved);
    }
};

import api from '../api';

const checkNotifications = async () => {
    try {
        const { data } = await api.get('/announcements');
        if (data.length > 0) {
            const latest = data[0].created_at;
            const lastRead = localStorage.getItem('lastReadAnnouncement');
            if (!lastRead || new Date(latest) > new Date(lastRead)) {
                hasNotification.value = true;
            }
        }
    } catch (e) {
        // ignore
    }
};

const logout = () => {
    localStorage.removeItem('student');
    router.push('/login');
};

const initials = computed(() => {
    return student.value?.full_name ? student.value.full_name.charAt(0).toUpperCase() : 'S';
});

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    loadStudent();
    checkNotifications();
});

onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<style scoped>
/* Custom scrollbar hide if needed */
</style>
