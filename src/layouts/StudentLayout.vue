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
            <li>
                <router-link to="/student/assignments" class="hover:text-white transition relative">
                    Tugas Saya
                    <span v-if="hasAssignmentNotification" class="absolute -top-1 -right-2 w-2 h-2 bg-red-600 rounded-full"></span>
                </router-link>
            </li>
            <li><router-link to="/student/reflections" class="hover:text-white transition">Jurnal</router-link></li>
            <li><router-link to="/student/s-badges" class="hover:text-white transition">Pencapaian</router-link></li>
            <li>
                <router-link to="/student/announcements" class="hover:text-white transition relative">
                    Pengumuman
                    <span v-if="hasNotification" class="absolute -top-1 -right-2 w-2 h-2 bg-red-600 rounded-full"></span>
                </router-link>
            </li>
            <li>
                <router-link to="/student/discuss" class="hover:text-white transition relative">
                    Diskusi
                    <span v-if="hasDiscussNotification" class="absolute -top-1 -right-2 w-2 h-2 bg-red-600 rounded-full"></span>
                </router-link>
            </li>
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
           <button
             v-else
             @click="showLoginModal = true"
             class="bg-red-600 px-6 py-2 rounded-full font-bold hover:bg-red-700 transition transform hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20"
           >
             Masuk
           </button>


           <!-- Dropdown Menu -->
           <transition name="fade">
             <div v-if="showMenu" class="absolute top-full right-0 mt-3 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-2 flex flex-col z-[100] backdrop-blur-xl">
                 <div class="px-4 py-3 border-b border-gray-800">
                     <div class="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">NISN</div>
                     <div class="text-sm font-bold text-white">{{ student?.nisn }}</div>
                 </div>

                 <button @click="showDevInfo = true; showMenu = false" class="text-left px-4 py-3 hover:bg-gray-800/50 text-indigo-400 flex items-center gap-3 transition">
                    <span class="text-lg">ℹ️</span>
                    <span class="text-sm font-semibold">Tentang Aplikasi</span>
                 </button>

                 <button v-if="demoMode" @click="resetDemoSession" class="text-left px-4 py-3 hover:bg-gray-800/50 text-yellow-400 flex items-center gap-3 transition">
                    <span class="text-lg">🧹</span>
                    <span class="text-sm font-semibold">Reset Demo</span>
                 </button>

                 <button @click="logout" class="text-left px-4 py-3 hover:bg-red-900/10 text-red-500 flex items-center gap-3 transition border-t border-gray-800">
                   <span class="text-lg">🚪</span>
                   <span class="text-sm font-semibold">Keluar</span>
                 </button>
             </div>
           </transition>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="pt-16 pb-20 md:pb-0">
      <router-view />
    </div>

    <!-- Expandable Menu (FAB) -->
    <div class="md:hidden fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2">
      <transition name="fade">
        <div v-if="showMenu" class="flex flex-col gap-2 mb-2">
          <router-link to="/student/leaderboard" class="bg-red-600 text-white p-3 rounded-full shadow-lg flex items-center gap-2" @click="showMenu = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2h-6c-1.1 0-2 .9-2 2v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4c0-1.1-.9-2-2-2Z"/></svg>
            <span class="text-sm font-bold pr-2">Leaderboard</span>
          </router-link>
          <router-link to="/student/my-list" class="bg-red-600 text-white p-3 rounded-full shadow-lg flex items-center gap-2" @click="showMenu = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            <span class="text-sm font-bold pr-2">Daftar Saya</span>
          </router-link>
          <router-link to="/student/s-badges" class="bg-red-600 text-white p-3 rounded-full shadow-lg flex items-center gap-2" @click="showMenu = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
            <span class="text-sm font-bold pr-2">Pencapaian</span>
          </router-link>
        </div>
      </transition>
      <button @click="showMenu = !showMenu" class="bg-yellow-500 text-black p-4 rounded-full shadow-lg hover:bg-yellow-400 transition transform hover:scale-105">
         <svg v-if="!showMenu" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
         <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <!-- Bottom Navigation (Mobile Only) -->
    <div class="md:hidden fixed bottom-0 w-full bg-black/90 border-t border-gray-800 flex justify-around p-3 z-50 text-xs backdrop-blur-md">
      <router-link to="/student" class="flex flex-col items-center gap-1 text-gray-400 hover:text-white" active-class="text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Home</span>
      </router-link>
      <router-link to="/student/assignments" class="flex flex-col items-center gap-1 text-gray-400 hover:text-white relative" active-class="text-red-600">
         <div class="relative">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
             <span v-if="hasAssignmentNotification" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-black"></span>
         </div>
         <span>Tugas</span>
      </router-link>
      <router-link to="/student/reflections" class="flex flex-col items-center gap-1 text-gray-400 hover:text-white" active-class="text-red-600">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
         <span>Jurnal</span>
      </router-link>
      <router-link to="/student/announcements" class="flex flex-col items-center gap-1 text-gray-400 hover:text-white relative" active-class="text-red-600">
         <div class="relative">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
             <span v-if="hasNotification" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-black"></span>
         </div>
         <span>Info</span>
      </router-link>
      <router-link to="/student/discuss" class="flex flex-col items-center gap-1 text-gray-400 hover:text-white relative" active-class="text-red-600">
         <div class="relative">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
             <span v-if="hasDiscussNotification" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-black"></span>
         </div>
         <span>Diskusi</span>
      </router-link>
    </div>

     <!-- Login Modal -->
     <LoginModal :is-open="showLoginModal" @close="showLoginModal = false" />

     <!-- Developer Widget (Modal) -->
     <DeveloperWidget :is-open="showDevInfo" @close="showDevInfo = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import DeveloperWidget from '../components/DeveloperWidget.vue';
import LoginModal from '../components/LoginModal.vue';
import api from '../api';
import { isDemoMode, enableDemo, resetDemo, getDemoStudent } from '../utils/demo';

const router = useRouter();
const route = useRoute();
const isScrolled = ref(false);
const student = ref<any>(null);
const showMenu = ref(false);
const showDevInfo = ref(false);
const showLoginModal = ref(false);
const hasNotification = ref(false);
const hasAssignmentNotification = ref(false);
const hasDiscussNotification = ref(false);
let pollingInterval: any = null;
const demoMode = ref(isDemoMode());

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const loadStudent = () => {
    const saved = localStorage.getItem('student');
    if (saved) {
        student.value = JSON.parse(saved);
    } else if (demoMode.value) {
        enableDemo();
        student.value = getDemoStudent();
    }
};

const checkNotifications = async () => {
    if (demoMode.value || !student.value?.id) return;
    try {
        const { data } = await api.get('/announcements', { params: { student_id: student.value.id } });
        const announcements = Array.isArray(data) ? data : data?.data || [];
        hasNotification.value = announcements.some((item: any) => !item.has_read);
    } catch (e) {
        // ignore
    }
};

const markAllAnnouncementsRead = async () => {
    if (demoMode.value || !student.value?.id) return;
    try {
        const { data } = await api.get('/announcements', { params: { student_id: student.value.id } });
        const announcements = Array.isArray(data) ? data : data?.data || [];
        const unread = announcements.filter((item: any) => !item.has_read);
        await Promise.all(
            unread.map((item: any) => api.post(`/announcements/${item.id}/read`, { student_id: student.value.id }))
        );
        hasNotification.value = false;
    } catch (e) {
        // ignore
    }
};

const checkDiscussNotifications = async (): Promise<void> => {
    if (demoMode.value || !student.value?.id) return;
    try {
        const { data } = await api.get('/discussions', { params: { user_id: student.value.id } });
        const discussions = Array.isArray(data) ? data : data?.data || [];
        hasDiscussNotification.value = discussions.some((d: any) => d.has_unread);
    } catch (e) {
        // ignore
    }
};

const markAllDiscussionsRead = async () => {
    if (demoMode.value || !student.value?.id) return;
    try {
        const { data } = await api.get('/discussions', { params: { user_id: student.value.id } });
        const discussions = Array.isArray(data) ? data : data?.data || [];
        const unread = discussions.filter((d: any) => d.has_unread);
        await Promise.all(unread.map((d: any) => api.post(`/discussions/${d.id}/read`, { user_id: student.value.id })));
        hasDiscussNotification.value = false;
    } catch (e) {
        // ignore
    }
};

const getAssignmentTimestamp = (assignment: any) => {
    return assignment?.created_at || assignment?.updated_at || assignment?.due_date || null;
};

const checkAssignmentNotifications = async (): Promise<string | null> => {
    if (demoMode.value) return null;
    if (!student.value) return null;
    try {
        const { data } = await api.get('/assignments/my-assignments', {
            headers: { 'X-Student-ID': student.value.id }
        });
        const assignments = Array.isArray(data) ? data : data?.data || [];
        const latestTimestamp = assignments
            .map(getAssignmentTimestamp)
            .filter(Boolean)
            .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime())[0];
        if (!latestTimestamp) {
            hasAssignmentNotification.value = false;
            return null;
        }
        const lastReadKey = `lastReadAssignment_${student.value.id || student.value.nisn}`;
        const lastRead = localStorage.getItem(lastReadKey);
        if (!lastRead || new Date(latestTimestamp) > new Date(lastRead)) {
            hasAssignmentNotification.value = true;
        } else {
            hasAssignmentNotification.value = false;
        }
        return latestTimestamp;
    } catch (e) {
        // ignore
        return null;
    }
};

const markAssignmentsRead = (latestTimestamp?: string | null) => {
    if (!student.value) return;
    const lastReadKey = `lastReadAssignment_${student.value.id || student.value.nisn}`;
    if (latestTimestamp) {
        localStorage.setItem(lastReadKey, latestTimestamp);
    } else {
        localStorage.setItem(lastReadKey, new Date().toISOString());
    }
    hasAssignmentNotification.value = false;
};

const logout = () => {
    if (demoMode.value) {
        resetDemo();
        demoMode.value = false;
    }
    localStorage.removeItem('student');
    router.push('/login');
};

const resetDemoSession = () => {
    resetDemo();
    demoMode.value = false;
    student.value = null;
    showMenu.value = false;
    router.push('/login');
};

const initials = computed(() => {
    return student.value?.full_name ? student.value.full_name.charAt(0).toUpperCase() : 'S';
});

onMounted(() => {
    document.documentElement.classList.add('dark');
    window.addEventListener('scroll', handleScroll);
    loadStudent();
    if (!demoMode.value) {
        checkNotifications();
        checkAssignmentNotifications();
        checkDiscussNotifications();
        pollingInterval = setInterval(() => {
            checkNotifications();
            checkAssignmentNotifications();
            checkDiscussNotifications();
        }, 5000);
    }
});

watch(() => route.path, (path) => {
    if (path.startsWith('/student/assignments')) {
        checkAssignmentNotifications().then((latestTimestamp) => {
            if (latestTimestamp) {
                markAssignmentsRead(latestTimestamp);
            }
        });
    }
    if (path.startsWith('/student/announcements')) {
        markAllAnnouncementsRead();
    }
    if (path.startsWith('/student/discuss')) {
        markAllDiscussionsRead();
    }
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    if (pollingInterval) clearInterval(pollingInterval);
});
</script>

<style scoped>
/* Custom scrollbar hide if needed */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
