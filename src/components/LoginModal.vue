<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        class="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden relative"
        @click.stop
      >
        <!-- Close Button -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <!-- Header -->
        <div class="p-8 text-center bg-gradient-to-b from-red-600/20 to-transparent">
          <h1 class="text-4xl font-black text-red-600 tracking-tighter mb-2 italic">MATHFLIX</h1>
          <p class="text-gray-400 text-sm">Streaming Learning Experience</p>
        </div>

        <!-- Role Toggle -->
        <div class="px-8 flex p-1 bg-gray-800/50 rounded-lg mx-8 mb-6">
          <button
            @click="role = 'student'"
            :class="[
              'flex-1 py-2 text-sm font-bold rounded-md transition-all',
              role === 'student' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
            ]"
          >
            Siswa
          </button>
          <button
            @click="role = 'admin'"
            :class="[
              'flex-1 py-2 text-sm font-bold rounded-md transition-all',
              role === 'admin' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
            ]"
          >
            Guru / Admin
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="px-8 pb-8 space-y-4">
          <div v-if="role === 'student'">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">NISN</label>
            <input
              v-model="nisn"
              type="text"
              class="w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:outline-none transition-all placeholder-gray-600"
              placeholder="Masukkan NISN Anda"
              required
            />
          </div>

          <div v-else class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Username / Email</label>
              <input
                v-model="username"
                type="text"
                class="w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:outline-none transition-all placeholder-gray-600"
                placeholder="ferilee"
                required
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
              <input
                v-model="password"
                type="password"
                class="w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:outline-none transition-all placeholder-gray-600"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-red-600 text-white font-black py-4 rounded-xl hover:bg-red-700 transition transform hover:scale-[1.02] active:scale-95 shadow-xl disabled:opacity-50 disabled:transform-none"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              MEMERIKSA...
            </span>
            <span v-else>MASUK</span>
          </button>

          <button
            v-if="role === 'student'"
            type="button"
            @click="handleDemo"
            class="w-full bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-700 transition"
          >
            Coba Demo
          </button>

          <div v-if="error" class="bg-red-900/40 border border-red-500/50 text-red-200 p-3 rounded-xl text-xs text-center animate-pulse">
            {{ error }}
          </div>
        </form>

        <div class="px-8 pb-8 text-center">
          <p class="text-gray-500 text-xs">
            {{ role === 'student' ? 'Belum punya NISN? Hubungi Guru Admin.' : 'Akses khusus staf dan administrator.' }}
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import { enableDemo, isDemoMode, resetDemo } from '../utils/demo';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'logged-in']);

const router = useRouter();
const role = ref<'student' | 'admin'>('student');
const nisn = ref('');
const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

// Reset fields when role changes
watch(role, () => {
  error.value = '';
  nisn.value = '';
  username.value = '';
  password.value = '';
});

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    if (role.value === 'student') {
      const nisnValue = nisn.value.trim();
      const { data } = await api.get('/students', {
        params: { search: nisnValue, limit: 50 },
      });
      const students = Array.isArray(data) ? data : data?.data || [];
      const student = students.find((s: any) => String(s.nisn) === nisnValue);

      if (student) {
        if (isDemoMode()) {
          resetDemo();
        }
        localStorage.setItem('student', JSON.stringify(student));
        emit('logged-in', student);
        emit('close');
        router.push('/student');
      } else {
        error.value = 'NISN tidak ditemukan.';
      }
  } else {
      // Admin Login (Hardcoded for now as per project state or check for admin endpoint)
      const runtimeConfig = (window as any).APP_CONFIG || {};
      const adminUser = runtimeConfig.ADMIN_USERNAME || import.meta.env.VITE_ADMIN_USERNAME || 'ferilee';
      const adminPass = runtimeConfig.ADMIN_PASSWORD || import.meta.env.VITE_ADMIN_PASSWORD || 'F3r!-lee';
      const usernameValue = username.value.trim();
      const passwordValue = password.value.trim();
      const acceptedPasswords = new Set([adminPass]);

      if (usernameValue === adminUser && acceptedPasswords.has(passwordValue)) {
        if (isDemoMode()) {
          resetDemo();
        }
        localStorage.setItem('admin_user', JSON.stringify({ username: usernameValue, role: 'admin' }));
        emit('logged-in', { username: usernameValue, role: 'admin' });
        emit('close');
        router.push('/admin/dashboard');
      } else {
        error.value = 'Username atau Password salah.';
      }
    }
  } catch (e: any) {
    const detail = e?.response?.data?.error || e?.message || 'Terjadi kesalahan koneksi.';
    error.value = `Gagal login: ${detail}`;
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handleDemo = () => {
  enableDemo();
  emit('close');
  router.push('/student');
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .w-full,
.modal-leave-active .w-full {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .w-full,
.modal-leave-to .w-full {
  transform: scale(0.9) translateY(20px);
}
</style>
