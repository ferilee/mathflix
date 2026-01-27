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
            @click="role = 'guru'"
            :class="[
              'flex-1 py-2 text-sm font-bold rounded-md transition-all',
              role === 'guru' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
            ]"
          >
            Guru
          </button>
          <button
            @click="role = 'admin'"
            :class="[
              'flex-1 py-2 text-sm font-bold rounded-md transition-all',
              role === 'admin' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
            ]"
          >
            Admin
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="px-8 pb-8 space-y-4">
          <div v-if="role === 'student'">
            <div class="relative">
              <input
                id="nisn"
                v-model="nisn"
                type="text"
                class="peer w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:outline-none transition-all placeholder-transparent"
                placeholder="NISN"
                required
              />
              <label
                for="nisn"
                class="absolute left-4 top-4 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-red-400 peer-placeholder-shown:text-gray-500 bg-gray-900 px-1"
              >
                NISN
              </label>
            </div>
            <p class="text-[10px] text-gray-500 mt-2">Login awal cukup dengan NISN. Setelah 5x login, sistem akan meminta password.</p>

            <div v-if="studentPasswordPrompted" class="mt-4">
              <div class="relative">
                <input
                  id="student_password"
                  v-model="studentPassword"
                  type="password"
                  class="peer w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:outline-none transition-all placeholder-transparent"
                  placeholder="Password"
                />
                <label
                  for="student_password"
                  class="absolute left-4 top-4 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-red-400 peer-placeholder-shown:text-gray-500 bg-gray-900 px-1"
                >
                  Password
                </label>
              </div>
              <p class="text-[10px] text-gray-500 mt-2">Masukkan password untuk melanjutkan.</p>
            </div>
          </div>

          <div v-else-if="role === 'guru'" class="space-y-4">
            <div>
              <div class="relative">
                <input
                  id="nip"
                  v-model="nip"
                  type="text"
                  class="peer w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:outline-none transition-all placeholder-transparent"
                  placeholder="Nomor Induk (NIP)"
                  required
                />
                <label
                  for="nip"
                  class="absolute left-4 top-4 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-red-400 peer-placeholder-shown:text-gray-500 bg-gray-900 px-1"
                >
                  Nomor Induk (NIP)
                </label>
              </div>
              <p class="text-[10px] text-gray-500 mt-2">Masukkan NIP yang sudah terdaftar admin.</p>
            </div>
            <p class="text-[10px] text-gray-500 mt-2">Login awal cukup dengan NIP. Setelah 5x login, sistem akan meminta password.</p>
            <div v-if="guruPasswordPrompted">
              <div class="relative">
                <input
                  id="guru_password"
                  v-model="guruPassword"
                  type="password"
                  class="peer w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:outline-none transition-all placeholder-transparent"
                  placeholder="Password"
                />
                <label
                  for="guru_password"
                  class="absolute left-4 top-4 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-red-400 peer-placeholder-shown:text-gray-500 bg-gray-900 px-1"
                >
                  Password
                </label>
              </div>
              <p class="text-[10px] text-gray-500 mt-2">Masukkan password untuk melanjutkan.</p>
            </div>
            <div class="flex items-center justify-between text-xs text-gray-400">
              <span>Belum punya akun?</span>
              <button
                type="button"
                class="text-red-400 hover:text-red-300 font-semibold"
                @click="openRegister"
              >
                Daftar
              </button>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div>
              <div class="relative">
                <input
                  id="admin_username"
                  v-model="username"
                  type="text"
                  class="peer w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:outline-none transition-all placeholder-transparent"
                  placeholder="Username / Email"
                  required
                />
                <label
                  for="admin_username"
                  class="absolute left-4 top-4 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-red-400 peer-placeholder-shown:text-gray-500 bg-gray-900 px-1"
                >
                  Username / Email
                </label>
              </div>
              <p class="text-[10px] text-gray-500 mt-2">Akun admin hanya untuk pengelola sistem.</p>
            </div>
            <div>
              <div class="relative">
                <input
                  id="admin_password"
                  v-model="password"
                  type="password"
                  class="peer w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:outline-none transition-all placeholder-transparent"
                  placeholder="Password"
                  required
                />
                <label
                  for="admin_password"
                  class="absolute left-4 top-4 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-red-400 peer-placeholder-shown:text-gray-500 bg-gray-900 px-1"
                >
                  Password
                </label>
              </div>
              <p class="text-[10px] text-gray-500 mt-2">Gunakan password admin yang sudah ditentukan.</p>
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
            {{ role === 'student'
              ? 'Belum punya NISN? Hubungi Guru Admin.'
              : role === 'guru'
                ? 'Akses guru menggunakan NIP terdaftar.'
                : 'Akses khusus administrator.' }}
          </p>
        </div>
      </div>
    </div>
  </Transition>

  <Transition name="modal">
    <div v-if="passwordStage === 'set-password'" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="w-full max-w-md bg-gray-900 border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden relative">
        <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-rose-500"></div>
        <button
          @click="resetPasswordStage"
          class="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div class="p-8">
          <p class="text-xs uppercase tracking-[0.2em] text-red-400">
            {{ passwordRole === 'guru' ? 'Aktivasi Akun Guru' : 'Aktivasi Akun Siswa' }}
          </p>
          <h2 class="text-2xl font-bold text-white mt-2">Buat Password Baru</h2>
          <p class="text-sm text-gray-400 mt-2">Password ini akan digunakan untuk login berikutnya.</p>

          <form @submit.prevent="handleSetPassword" class="mt-6 space-y-4">
            <div class="relative">
              <input
                v-model="newPassword"
                type="password"
                class="peer w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:outline-none transition-all placeholder-transparent"
                placeholder="Password Baru"
                required
              />
              <label
                class="absolute left-4 top-4 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-red-400 peer-placeholder-shown:text-gray-500 bg-gray-900 px-1"
              >
                Password Baru
              </label>
            </div>
            <div class="relative">
              <input
                v-model="confirmPassword"
                type="password"
                class="peer w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:outline-none transition-all placeholder-transparent"
                placeholder="Konfirmasi Password"
                required
              />
              <label
                class="absolute left-4 top-4 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-red-400 peer-placeholder-shown:text-gray-500 bg-gray-900 px-1"
              >
                Konfirmasi Password
              </label>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-red-600 text-white font-black py-3 rounded-xl hover:bg-red-700 transition disabled:opacity-50"
            >
              SIMPAN PASSWORD
            </button>

            <div v-if="studentPasswordError" class="bg-red-900/40 border border-red-500/50 text-red-200 p-3 rounded-xl text-xs text-center">
              {{ studentPasswordError }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>

  <Transition name="modal">
    <div v-if="showRegister" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="w-full max-w-md bg-gray-900 border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden relative">
        <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-rose-500"></div>
        <button
          @click="closeRegister"
          class="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div class="p-8">
          <p class="text-xs uppercase tracking-[0.2em] text-red-400">Pendaftaran Guru</p>
          <h2 class="text-2xl font-bold text-white mt-2">Daftarkan Akun Guru</h2>
          <p class="text-sm text-gray-400 mt-2">Akun akan aktif setelah dikonfirmasi admin.</p>

          <form @submit.prevent="submitRegister" class="mt-6 space-y-4">
            <div class="relative">
              <input
                v-model="registerForm.nip"
                type="text"
                class="peer w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:outline-none transition-all placeholder-transparent"
                placeholder="Nomor Induk (NIP)"
                required
              />
              <label
                class="absolute left-4 top-4 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-red-400 peer-placeholder-shown:text-gray-500 bg-gray-900 px-1"
              >
                Nomor Induk (NIP)
              </label>
            </div>
            <div class="relative">
              <input
                v-model="registerForm.full_name"
                type="text"
                class="peer w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:outline-none transition-all placeholder-transparent"
                placeholder="Nama Lengkap"
                required
              />
              <label
                class="absolute left-4 top-4 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-red-400 peer-placeholder-shown:text-gray-500 bg-gray-900 px-1"
              >
                Nama Lengkap
              </label>
            </div>
            <div class="relative">
              <input
                v-model="registerForm.school"
                type="text"
                class="peer w-full bg-gray-800 border-2 border-gray-700 rounded-xl p-4 text-white focus:border-red-500 focus:outline-none transition-all placeholder-transparent"
                placeholder="Asal Sekolah"
                required
              />
              <label
                class="absolute left-4 top-4 text-xs font-bold text-gray-500 uppercase tracking-widest transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2 peer-focus:text-[10px] peer-focus:text-red-400 peer-placeholder-shown:text-gray-500 bg-gray-900 px-1"
              >
                Asal Sekolah
              </label>
            </div>

            <button
              type="submit"
              :disabled="registerLoading"
              class="w-full bg-red-600 text-white font-black py-3 rounded-xl hover:bg-red-700 transition disabled:opacity-50"
            >
              {{ registerLoading ? 'MENGIRIM...' : 'KIRIM PERMINTAAN' }}
            </button>

            <div v-if="registerError" class="bg-red-900/40 border border-red-500/50 text-red-200 p-3 rounded-xl text-xs text-center">
              {{ registerError }}
            </div>
            <div v-if="registerSuccess" class="bg-emerald-900/40 border border-emerald-500/50 text-emerald-200 p-3 rounded-xl text-xs text-center">
              {{ registerSuccess }}
            </div>
          </form>
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
import { setStaffUser } from '../utils/auth';
import { findTeacherByNip } from '../utils/teachers';
import { createTeacherRequest } from '../utils/teacherRequests';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close', 'logged-in']);

const router = useRouter();
const role = ref<'student' | 'guru' | 'admin'>('student');
const nisn = ref('');
const nip = ref('');
const username = ref('');
const password = ref('');
const passwordStage = ref<'login' | 'set-password'>('login');
const passwordRole = ref<'student' | 'guru' | null>(null);
const pendingAccount = ref<any | null>(null);
const studentPassword = ref('');
const guruPassword = ref('');
const studentPasswordPrompted = ref(false);
const guruPasswordPrompted = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');
const studentPasswordError = ref('');
const loading = ref(false);
const error = ref('');
const showRegister = ref(false);
const registerForm = ref({
  nip: '',
  full_name: '',
  school: '',
});
const registerLoading = ref(false);
const registerError = ref('');
const registerSuccess = ref('');

// Reset fields when role changes
watch(role, () => {
  error.value = '';
  nisn.value = '';
  nip.value = '';
  username.value = '';
  password.value = '';
  passwordStage.value = 'login';
  passwordRole.value = null;
  pendingAccount.value = null;
  studentPassword.value = '';
  guruPassword.value = '';
  studentPasswordPrompted.value = false;
  guruPasswordPrompted.value = false;
  newPassword.value = '';
  confirmPassword.value = '';
  studentPasswordError.value = '';
});

watch(
  () => props.isOpen,
  (open) => {
    if (!open) {
      resetPasswordStage();
      error.value = '';
      studentPassword.value = '';
      guruPassword.value = '';
      studentPasswordPrompted.value = false;
      guruPasswordPrompted.value = false;
      newPassword.value = '';
      confirmPassword.value = '';
      studentPasswordError.value = '';
    }
  }
);

const resetPasswordStage = () => {
  passwordStage.value = 'login';
  passwordRole.value = null;
  pendingAccount.value = null;
  newPassword.value = '';
  confirmPassword.value = '';
  studentPasswordError.value = '';
};

const openRegister = () => {
  registerError.value = '';
  registerSuccess.value = '';
  registerForm.value = { nip: nip.value.trim(), full_name: '', school: '' };
  showRegister.value = true;
};

const closeRegister = () => {
  showRegister.value = false;
};

const submitRegister = async () => {
  registerLoading.value = true;
  registerError.value = '';
  registerSuccess.value = '';
  try {
    const nipValue = registerForm.value.nip.trim();
    const fullNameValue = registerForm.value.full_name.trim();
    const schoolValue = registerForm.value.school.trim();

    if (!nipValue || !fullNameValue || !schoolValue) {
      registerError.value = 'Semua field wajib diisi.';
      return;
    }

    const existing = await findTeacherByNip(nipValue, { status: 'any' });
    if (existing?.status === 'approved') {
      registerError.value = 'NIP sudah terdaftar. Silakan login.';
      return;
    }
    if (existing?.status === 'pending') {
      registerError.value = 'Permintaan dengan NIP ini sudah dikirim.';
      return;
    }

    await createTeacherRequest({
      nip: nipValue,
      full_name: fullNameValue,
      school: schoolValue,
    });

    registerSuccess.value = 'Permintaan terkirim. Tunggu konfirmasi admin.';
    registerForm.value = { nip: '', full_name: '', school: '' };
  } catch (e: any) {
    registerError.value = e?.response?.data?.error || e?.message || 'Gagal mengirim permintaan.';
  } finally {
    registerLoading.value = false;
  }
};

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    if (role.value === 'student') {
      const nisnValue = nisn.value.trim();
      if (!nisnValue) {
        error.value = 'Lengkapi NISN.';
        return;
      }
      const { data } = await api.post('/auth/student/login', {
        nisn: nisnValue,
        password: studentPassword.value.trim() || undefined,
      });

      if (isDemoMode()) {
        resetDemo();
      }
      localStorage.setItem('student', JSON.stringify(data.user));
      emit('logged-in', data.user);
      emit('close');
      router.push('/student');
    } else if (role.value === 'guru') {
      const nipValue = nip.value.trim();

      if (!nipValue) {
        error.value = 'Lengkapi NIP.';
        return;
      }
      const { data } = await api.post('/auth/guru/login', {
        nip: nipValue,
        password: guruPassword.value.trim() || undefined,
      });
      if (isDemoMode()) {
        resetDemo();
      }
      setStaffUser(data.user);
      emit('logged-in', data.user);
      emit('close');
      router.push('/admin/dashboard');
    } else {
      const usernameValue = username.value.trim();
      const passwordValue = password.value.trim();
      const { data } = await api.post('/auth/admin/login', {
        username: usernameValue,
        password: passwordValue,
      });
      if (isDemoMode()) {
        resetDemo();
      }
      setStaffUser(data.user);
      emit('logged-in', data.user);
      emit('close');
      router.push('/admin/dashboard');
    }
  } catch (e: any) {
    const response = e?.response;
    const code = response?.data?.code;
    if (response?.status === 409 && (code === 'PASSWORD_NOT_SET' || code === 'PASSWORD_SETUP_REQUIRED')) {
      pendingAccount.value = response?.data?.user || null;
      passwordRole.value = role.value === 'guru' ? 'guru' : 'student';
      passwordStage.value = 'set-password';
      studentPassword.value = '';
      guruPassword.value = '';
      studentPasswordPrompted.value = false;
      guruPasswordPrompted.value = false;
      error.value = '';
      return;
    }
    if (code === 'PASSWORD_REQUIRED') {
      error.value = 'Masukkan password untuk melanjutkan.';
      if (role.value === 'student') {
        studentPasswordPrompted.value = true;
      }
      if (role.value === 'guru') {
        guruPasswordPrompted.value = true;
      }
      return;
    }
    if (code === 'STATUS_PENDING') {
      error.value = 'Akun guru masih menunggu konfirmasi admin.';
      return;
    }
    if (code === 'STATUS_REJECTED') {
      error.value = 'Permintaan guru ditolak. Hubungi admin untuk bantuan.';
      return;
    }
    if (code === 'NOT_FOUND') {
      error.value = role.value === 'guru' ? 'NIP tidak ditemukan.' : 'NISN tidak ditemukan.';
      return;
    }
    if (response?.data?.error) {
      error.value = response.data.error;
      return;
    }
    const detail = e?.message || 'Terjadi kesalahan koneksi.';
    error.value = `Gagal login: ${detail}`;
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handleSetPassword = async () => {
  studentPasswordError.value = '';
  const nisnValue = nisn.value.trim();
  const nipValue = nip.value.trim();
  const passwordValue = newPassword.value.trim();
  const confirmValue = confirmPassword.value.trim();

  if (!pendingAccount.value) {
    studentPasswordError.value = 'Akun tidak ditemukan. Silakan ulangi login.';
    return;
  }
  if (!passwordValue || !confirmValue) {
    studentPasswordError.value = 'Semua field wajib diisi.';
    return;
  }
  if (passwordValue.length < 6) {
    studentPasswordError.value = 'Password minimal 6 karakter.';
    return;
  }
  if (passwordValue !== confirmValue) {
    studentPasswordError.value = 'Konfirmasi password tidak cocok.';
    return;
  }

  try {
    let response: any = null;
    if (passwordRole.value === 'guru') {
      response = await api.post('/auth/guru/set-password', {
        nip: pendingAccount.value.nip || nipValue,
        password: passwordValue,
      });
    } else {
      response = await api.post('/auth/student/set-password', {
        nisn: pendingAccount.value.nisn || nisnValue,
        password: passwordValue,
      });
    }

    if (isDemoMode()) {
      resetDemo();
    }

    const user = response?.data?.user;
    if (passwordRole.value === 'guru') {
      setStaffUser(user);
      emit('logged-in', user);
      resetPasswordStage();
      emit('close');
      router.push('/admin/dashboard');
      return;
    }

    localStorage.setItem('student', JSON.stringify(user));
    emit('logged-in', user);
    resetPasswordStage();
    emit('close');
    router.push('/student');
  } catch (e: any) {
    studentPasswordError.value = e?.response?.data?.error || e?.message || 'Gagal menyimpan password.';
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
