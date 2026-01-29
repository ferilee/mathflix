<template>
  <div class="min-h-screen bg-gray-900 text-white font-sans">
    <!-- Navbar -->
    <nav class="fixed top-0 z-50 w-full bg-gradient-to-b from-black/80 to-transparent transition-all duration-300" :class="{ 'bg-black': isScrolled }">
      <div class="px-4 md:px-12 py-4 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <router-link to="/student" class="text-2xl font-bold text-red-600 tracking-wider">MATHFLIX</router-link>
          <ul class="hidden md:flex gap-6 text-sm text-gray-300">
            <li>
              <router-link
                to="/student"
                class="transition"
                :class="isMenuDisabled('/student') ? 'text-gray-500 cursor-not-allowed' : 'hover:text-white'"
              >Home</router-link>
            </li>
            <li>
              <router-link
                to="/student/leaderboard"
                class="transition"
                :class="isMenuDisabled('/student/leaderboard') ? 'text-gray-500 cursor-not-allowed' : 'hover:text-white'"
              >Leaderboard</router-link>
            </li>
            <li>
              <router-link
                to="/student/my-list"
                class="transition"
                :class="isMenuDisabled('/student/my-list') ? 'text-gray-500 cursor-not-allowed' : 'hover:text-white'"
              >Daftar Saya</router-link>
            </li>
            <li>
                <router-link
                  to="/student/assignments"
                  class="transition relative"
                  :class="isMenuDisabled('/student/assignments') ? 'text-gray-500 cursor-not-allowed' : 'hover:text-white'"
                >
                    Tugas Saya
                    <span v-if="hasAssignmentNotification" class="absolute -top-1 -right-2 w-2 h-2 bg-red-600 rounded-full"></span>
                </router-link>
            </li>
            <li>
              <router-link
                to="/student/reflections"
                class="transition"
                :class="isMenuDisabled('/student/reflections') ? 'text-gray-500 cursor-not-allowed' : 'hover:text-white'"
              >Jurnal</router-link>
            </li>
            <li>
              <router-link
                to="/student/s-badges"
                class="transition"
                :class="isMenuDisabled('/student/s-badges') ? 'text-gray-500 cursor-not-allowed' : 'hover:text-white'"
              >Pencapaian</router-link>
            </li>
            <li>
                <router-link
                  to="/student/announcements"
                  class="transition relative"
                  :class="isMenuDisabled('/student/announcements') ? 'text-gray-500 cursor-not-allowed' : 'hover:text-white'"
                >
                    Pengumuman
                    <span v-if="hasNotification" class="absolute -top-1 -right-2 w-2 h-2 bg-red-600 rounded-full"></span>
                </router-link>
            </li>
            <li>
                <router-link
                  to="/student/discuss"
                  class="transition relative"
                  :class="isMenuDisabled('/student/discuss') ? 'text-gray-500 cursor-not-allowed' : 'hover:text-white'"
                >
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
                   <img :src="resolveStorageUrl(student.photo_profile)" alt="Profile" class="w-full h-full object-cover">
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

                 <router-link
                   to="/student/profile"
                   class="text-left px-4 py-3 hover:bg-gray-800/50 text-emerald-400 flex items-center gap-3 transition"
                   @click="showMenu = false"
                 >
                    <span class="text-lg">👤</span>
                    <span class="text-sm font-semibold">Profil Saya</span>
                 </router-link>

                 <button @click="showDevInfo = true; showMenu = false" class="text-left px-4 py-3 hover:bg-gray-800/50 text-indigo-400 flex items-center gap-3 transition">
                    <span class="text-lg">ℹ️</span>
                    <span class="text-sm font-semibold">Tentang Aplikasi</span>
                 </button>

                 <button v-if="demoMode" @click="resetDemoSession" class="text-left px-4 py-3 hover:bg-gray-800/50 text-yellow-400 flex items-center gap-3 transition">
                    <span class="text-lg">🧹</span>
                    <span class="text-sm font-semibold">Reset Demo</span>
                 </button>

                 <button v-if="student && !demoMode" @click="openPhotoModal" class="text-left px-4 py-3 hover:bg-gray-800/50 text-sky-400 flex items-center gap-3 transition">
                    <span class="text-lg">🖼️</span>
                    <span class="text-sm font-semibold">Ubah Foto Profil</span>
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
      <transition name="fade">
        <div
          v-if="toastMessage"
          class="fixed top-20 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-2 rounded-full text-xs font-bold shadow-lg z-[120]"
        >
          {{ toastMessage }}
        </div>
      </transition>
      <div
        v-if="accessStatus === 'grace'"
        class="mx-4 md:mx-12 mb-4 bg-amber-900/40 border border-amber-700 text-amber-200 px-4 py-3 rounded text-sm"
      >
        Akses siswa masih dalam masa tenggang.
        <span v-if="accessGraceUntil">Berlaku hingga {{ accessGraceUntil }}.</span>
      </div>
      <div
        v-if="accessStatus === 'blocked'"
        class="mx-4 md:mx-12 mb-4 bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded text-sm"
      >
        Akses sementara ditunda karena kuota berbayar belum dilunasi. Hubungi guru untuk mengaktifkan kembali.
      </div>
      <router-view v-if="accessStatus !== 'blocked' && !isGraceRestricted" />
      <div v-else-if="accessStatus === 'blocked'" class="mx-4 md:mx-12 mt-6">
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
          <div class="text-lg font-bold mb-2">Akses Ditunda</div>
          <p class="text-sm text-gray-300 mb-4">
            Akses Mathflix untuk siswa ini menunggu pembayaran guru. Silakan hubungi guru untuk melanjutkan.
          </p>
          <router-link to="/login" class="text-red-400 hover:text-red-300 text-sm font-semibold">Kembali ke Login</router-link>
        </div>
      </div>
      <div v-else-if="isGraceRestricted" class="mx-4 md:mx-12 mt-6">
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
          <div class="text-lg font-bold mb-2">Akses Terbatas</div>
          <p class="text-sm text-gray-300 mb-4">
            Selama masa tenggang, hanya Pengumuman, Leaderboard, dan Diskusi yang bisa diakses.
          </p>
          <div class="flex flex-wrap justify-center gap-3 text-sm">
            <router-link to="/student/announcements" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Pengumuman</router-link>
            <router-link to="/student/leaderboard" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Leaderboard</router-link>
            <router-link to="/student/discuss" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Diskusi</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Expandable Menu (FAB) -->
    <div class="md:hidden fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2">
      <transition name="fade">
        <div v-if="showMenu" class="flex flex-col gap-2 mb-2">
          <router-link
            to="/student/leaderboard"
            class="p-3 rounded-full shadow-lg flex items-center gap-2"
            :class="isMenuDisabled('/student/leaderboard') ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : 'bg-red-600 text-white'"
            @click="showMenu = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2h-6c-1.1 0-2 .9-2 2v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4c0-1.1-.9-2-2-2Z"/></svg>
            <span class="text-sm font-bold pr-2">Leaderboard</span>
          </router-link>
          <router-link
            to="/student/my-list"
            class="p-3 rounded-full shadow-lg flex items-center gap-2"
            :class="isMenuDisabled('/student/my-list') ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : 'bg-red-600 text-white'"
            @click="showMenu = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            <span class="text-sm font-bold pr-2">Daftar Saya</span>
          </router-link>
          <router-link
            to="/student/s-badges"
            class="p-3 rounded-full shadow-lg flex items-center gap-2"
            :class="isMenuDisabled('/student/s-badges') ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : 'bg-red-600 text-white'"
            @click="showMenu = false"
          >
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
      <router-link
        to="/student"
        class="flex flex-col items-center gap-1"
        :class="isMenuDisabled('/student') ? 'text-gray-600' : 'text-gray-400 hover:text-white'"
        active-class="text-red-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Home</span>
      </router-link>
      <router-link
        to="/student/assignments"
        class="flex flex-col items-center gap-1 relative"
        :class="isMenuDisabled('/student/assignments') ? 'text-gray-600' : 'text-gray-400 hover:text-white'"
        active-class="text-red-600"
      >
         <div class="relative">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
             <span v-if="hasAssignmentNotification" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-black"></span>
         </div>
         <span>Tugas</span>
      </router-link>
      <router-link
        to="/student/reflections"
        class="flex flex-col items-center gap-1"
        :class="isMenuDisabled('/student/reflections') ? 'text-gray-600' : 'text-gray-400 hover:text-white'"
        active-class="text-red-600"
      >
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
         <span>Jurnal</span>
      </router-link>
      <router-link
        to="/student/announcements"
        class="flex flex-col items-center gap-1 relative"
        :class="isMenuDisabled('/student/announcements') ? 'text-gray-600' : 'text-gray-400 hover:text-white'"
        active-class="text-red-600"
      >
         <div class="relative">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
             <span v-if="hasNotification" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-black"></span>
         </div>
         <span>Info</span>
      </router-link>
      <router-link
        to="/student/discuss"
        class="flex flex-col items-center gap-1 relative"
        :class="isMenuDisabled('/student/discuss') ? 'text-gray-600' : 'text-gray-400 hover:text-white'"
        active-class="text-red-600"
      >
         <div class="relative">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
             <span v-if="hasDiscussNotification" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-black"></span>
         </div>
         <span>Diskusi</span>
      </router-link>
    </div>

     <!-- Foto Profil Modal -->
     <transition name="fade">
       <div v-if="showPhotoModal" class="fixed inset-0 z-[130] flex items-center justify-center p-4">
         <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closePhotoModal"></div>
         <div class="relative w-full max-w-md rounded-2xl bg-slate-900 text-white shadow-2xl border border-white/10">
           <div class="p-6 border-b border-white/10 flex items-center justify-between">
             <div>
               <h3 class="text-lg font-bold">Ubah Foto Profil</h3>
               <p class="text-xs text-gray-400">Unggah foto profil untuk akun siswa.</p>
             </div>
             <button class="text-slate-400 hover:text-white" @click="closePhotoModal">✕</button>
           </div>
           <div class="p-6 space-y-4">
             <div class="flex items-center gap-4">
               <div class="w-20 h-20 rounded-xl bg-slate-800 overflow-hidden flex items-center justify-center">
                 <img v-if="photoPreview" :src="photoPreview" alt="Preview" class="w-full h-full object-cover">
                 <span v-else class="text-xs text-slate-500">Preview</span>
               </div>
               <div class="flex-1">
                 <input type="file" accept="image/*" @change="handlePhotoSelected" class="block w-full text-sm text-slate-300">
                 <p class="text-[11px] text-slate-500 mt-1">Maks 5MB (JPG/PNG/WEBP/GIF).</p>
               </div>
             </div>
             <div v-if="photoPreview" class="space-y-3">
               <div class="flex flex-wrap gap-2 text-xs">
                 <button
                   type="button"
                   class="px-3 py-1 rounded-full border"
                   :class="photoRatio === '1:1' ? 'bg-sky-500/20 border-sky-400 text-sky-200' : 'border-white/10 text-slate-300'"
                   @click="setPhotoRatio('1:1')"
                 >
                   1:1
                 </button>
                 <button
                   type="button"
                   class="px-3 py-1 rounded-full border"
                   :class="photoRatio === '4:3' ? 'bg-sky-500/20 border-sky-400 text-sky-200' : 'border-white/10 text-slate-300'"
                   @click="setPhotoRatio('4:3')"
                 >
                   4:3
                 </button>
               </div>
               <div>
                 <label class="text-[11px] text-slate-400">Zoom</label>
                 <input
                   type="range"
                   min="1"
                   max="3"
                   step="0.05"
                   v-model.number="photoZoom"
                   @input="refreshCropPreview"
                   class="w-full"
                 >
               </div>
               <p class="text-[10px] text-slate-500">Hasil akan otomatis dipotong sesuai rasio dan dikompres.</p>
             </div>
             <div v-if="photoError" class="text-xs text-rose-400">{{ photoError }}</div>
           </div>
           <div class="p-6 border-t border-white/10 flex items-center justify-end gap-3">
             <button class="px-4 py-2 rounded-full text-sm font-semibold bg-slate-800 hover:bg-slate-700" @click="closePhotoModal">Batal</button>
             <button
               class="px-5 py-2 rounded-full text-sm font-semibold bg-sky-500 hover:bg-sky-400 text-black disabled:opacity-60"
               :disabled="photoUploading || !photoFile"
               @click="uploadPhoto"
             >
               {{ photoUploading ? 'Mengunggah...' : 'Simpan Foto' }}
             </button>
           </div>
         </div>
       </div>
     </transition>

     <!-- Login Modal -->
     <LoginModal :is-open="showLoginModal" @close="showLoginModal = false" @logged-in="handleLoggedIn" />

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
import billingApi from '../api/billing';
import { isDemoMode, enableDemo, resetDemo, getDemoStudent } from '../utils/demo';
import { setAuthToken } from '../utils/auth';
import { resolveStorageUrl } from '../utils/storage';

const router = useRouter();
const route = useRoute();
const isScrolled = ref(false);
const student = ref<any>(null);
const showMenu = ref(false);
const showDevInfo = ref(false);
const showLoginModal = ref(false);
const showPhotoModal = ref(false);
const photoFile = ref<File | null>(null);
const photoPreview = ref<string>('');
const photoImage = ref<HTMLImageElement | null>(null);
const photoBlob = ref<Blob | null>(null);
const photoRatio = ref<'1:1' | '4:3'>('1:1');
const photoZoom = ref(1);
const photoUploading = ref(false);
const photoError = ref('');
const hasNotification = ref(false);
const hasAssignmentNotification = ref(false);
const hasDiscussNotification = ref(false);
const accessStatus = ref<'ok' | 'grace' | 'blocked'>('ok');
const accessGraceUntil = ref<string | null>(null);
let pollingInterval: any = null;
const ACCESS_POLL_INTERVAL = 2000;
const demoMode = ref(isDemoMode());
const STUDENT_UPDATED_EVENT = 'student-updated';

const openPhotoModal = () => {
  showMenu.value = false;
  photoError.value = '';
  photoFile.value = null;
  photoImage.value = null;
  photoBlob.value = null;
  photoRatio.value = '1:1';
  photoZoom.value = 1;
  if (photoPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(photoPreview.value);
  }
  photoPreview.value = student.value?.photo_profile
    ? resolveStorageUrl(student.value.photo_profile)
    : '';
  showPhotoModal.value = true;
};

const closePhotoModal = () => {
  showPhotoModal.value = false;
  photoError.value = '';
  photoFile.value = null;
  photoImage.value = null;
  photoBlob.value = null;
  if (photoPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(photoPreview.value);
  }
  photoPreview.value = '';
};

const setPhotoRatio = (ratio: '1:1' | '4:3') => {
  photoRatio.value = ratio;
  refreshCropPreview();
};

const refreshCropPreview = async () => {
  if (!photoImage.value) return;
  const ratio = photoRatio.value === '4:3' ? 4 / 3 : 1;
  const outputWidth = ratio === 1 ? 512 : 640;
  const outputHeight = ratio === 1 ? 512 : 480;
  const img = photoImage.value;

  const imageRatio = img.width / img.height;
  let baseCropWidth = img.width;
  let baseCropHeight = img.height;
  if (imageRatio > ratio) {
    baseCropHeight = img.height;
    baseCropWidth = img.height * ratio;
  } else {
    baseCropWidth = img.width;
    baseCropHeight = img.width / ratio;
  }
  const zoom = Math.max(1, Math.min(3, photoZoom.value || 1));
  const cropWidth = baseCropWidth / zoom;
  const cropHeight = baseCropHeight / zoom;
  const cropX = (img.width - cropWidth) / 2;
  const cropY = (img.height - cropHeight) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, outputWidth, outputHeight);
  photoPreview.value = canvas.toDataURL('image/jpeg', 0.85);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.8)
  );
  photoBlob.value = blob;
};

const handlePhotoSelected = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const file = input.files[0];
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    photoError.value = 'Format file harus JPG/PNG/WEBP/GIF.';
    return;
  }
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    photoError.value = 'Ukuran file maksimal 5MB.';
    return;
  }
  photoFile.value = file;
  photoError.value = '';
  if (photoPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(photoPreview.value);
  }
  const objectUrl = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    photoImage.value = img;
    refreshCropPreview();
  };
  img.src = objectUrl;
};

const uploadPhoto = async () => {
  if (!student.value?.id || !photoFile.value) return;
  photoUploading.value = true;
  photoError.value = '';
  try {
    let fileToUpload: File = photoFile.value;
    if (photoBlob.value) {
      fileToUpload = new File([photoBlob.value], `profile-${student.value.id}.jpg`, {
        type: 'image/jpeg',
      });
    }
    const formData = new FormData();
    formData.append('file', fileToUpload);
    const { data } = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const photoUrl = data?.url;
    if (!photoUrl) throw new Error('URL upload tidak ditemukan.');
    const { data: updated } = await api.put(`/students/${student.value.id}`, {
      photo_profile: photoUrl,
    });
    const nextStudent = updated?.data || updated || {};
    student.value = { ...student.value, ...nextStudent, photo_profile: photoUrl };
    localStorage.setItem('student', JSON.stringify(student.value));
    closePhotoModal();
  } catch (e: any) {
    photoError.value = e?.response?.data?.error || e?.message || 'Gagal mengunggah foto.';
  } finally {
    photoUploading.value = false;
  }
};

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

const handleStudentUpdated = () => {
    loadStudent();
};

const formatAccessDate = (dateInput?: string | null) => {
    if (!dateInput) return null;
    try {
        return new Date(dateInput).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    } catch {
        return null;
    }
};

const resolveAccessStatus = (payload?: any) => {
    const statusRaw = payload?.status || payload?.access_status || payload?.billing_status;
    if (statusRaw === 'blocked') return 'blocked';
    if (statusRaw === 'grace') return 'grace';
    return 'ok';
};

const checkAccessStatus = async () => {
    if (demoMode.value || !student.value?.id) return;
    try {
        const { data } = await billingApi.get('/billing/access', { params: { student_id: student.value.id } });
        const statusPayload = data?.data || data;
        accessStatus.value = resolveAccessStatus(statusPayload);
        accessGraceUntil.value = formatAccessDate(statusPayload?.grace_until);
    } catch (e) {
        const fallbackStatus = resolveAccessStatus(student.value);
        accessStatus.value = fallbackStatus;
        accessGraceUntil.value = formatAccessDate(student.value?.grace_until);
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
    setAuthToken(null);
    localStorage.removeItem('student');
    router.push('/login');
};

const resetDemoSession = () => {
    resetDemo();
    demoMode.value = false;
    setAuthToken(null);
    student.value = null;
    showMenu.value = false;
    router.push('/login');
};

const handleLoggedIn = (payload?: any) => {
    if (payload?.role === 'admin' || payload?.role === 'guru') return;
    student.value = payload || null;
    showMenu.value = false;
    if (!demoMode.value) {
        checkNotifications();
        checkAssignmentNotifications();
        checkDiscussNotifications();
        checkAccessStatus();
    }
};

const initials = computed(() => {
    return student.value?.full_name ? student.value.full_name.charAt(0).toUpperCase() : 'S';
});

const graceAllowedPrefixes = ['/student/announcements', '/student/leaderboard', '/student/discuss'];
const isGraceRestricted = computed(() => {
    if (accessStatus.value !== 'grace') return false;
    return !graceAllowedPrefixes.some((prefix) => route.path.startsWith(prefix));
});

const toastMessage = ref('');
let toastTimeout: number | undefined;

const showToast = (message: string) => {
    toastMessage.value = message;
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    toastTimeout = window.setTimeout(() => {
        toastMessage.value = '';
    }, 2000);
};

const isMenuDisabled = (path: string) => {
    if (accessStatus.value !== 'grace') return false;
    return !graceAllowedPrefixes.some((prefix) => path.startsWith(prefix));
};

onMounted(() => {
    document.documentElement.classList.add('dark');
    window.addEventListener('scroll', handleScroll);
    window.addEventListener(STUDENT_UPDATED_EVENT, handleStudentUpdated);
    loadStudent();
    if (!demoMode.value) {
        checkNotifications();
        checkAssignmentNotifications();
        checkDiscussNotifications();
        checkAccessStatus();
        pollingInterval = setInterval(() => {
            checkNotifications();
            checkAssignmentNotifications();
            checkDiscussNotifications();
            checkAccessStatus();
        }, ACCESS_POLL_INTERVAL);
    }
});

watch(() => route.path, (path) => {
    if (accessStatus.value === 'grace' && !graceAllowedPrefixes.some((prefix) => path.startsWith(prefix))) {
        showToast('Akses terbatas');
        router.push('/student/announcements');
        return;
    }
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
    window.removeEventListener(STUDENT_UPDATED_EVENT, handleStudentUpdated);
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
