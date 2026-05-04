<template>
  <div class="px-4 md:px-12 py-8">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-white">Profil Siswa</h1>
        <p class="text-sm text-slate-400">Kelola foto profil dan informasi dasar akun.</p>
      </div>

      <div class="bg-gradient-to-br from-slate-900 to-black border-2 border-slate-700 rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <!-- Background decoration -->
        <div class="absolute right-0 top-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-rose-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div class="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
          <div class="relative w-32 h-32 rounded-full border-4 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
            <img v-if="student?.photo_profile" :src="resolveStorageUrl(student.photo_profile)" alt="Profile" class="w-full h-full object-cover relative z-10">
            <span v-else class="text-4xl text-slate-500 font-black relative z-10">?</span>
            <div class="absolute bottom-0 w-full h-8 bg-black/80 backdrop-blur-md flex items-center justify-center z-20">
               <span class="text-xs font-bold text-indigo-300 uppercase tracking-widest drop-shadow-md">LVL. {{ student?.level || 1 }}</span>
            </div>
          </div>
          
          <div class="flex-1 space-y-4">
            <div>
               <div class="text-3xl font-black text-white drop-shadow-md tracking-wider flex items-center gap-3">
                  {{ student?.full_name || 'Unknown Hero' }}
                  <span v-if="student?.status === 'Need Healing' || student?.status === 'DEBUFF'" class="text-[10px] bg-purple-900/80 text-purple-300 px-2 py-1 rounded border border-purple-500 uppercase tracking-widest">[DEBUFF]</span>
               </div>
               <div class="text-sm font-mono text-indigo-300 uppercase tracking-widest mt-1">Class: {{ student?.major || 'Novice' }}</div>
            </div>
            
            <div class="space-y-3 mt-4 bg-black/40 p-4 rounded-xl border border-slate-800/50">
               <!-- HP Bar (Health/Kehadiran) -->
               <div>
                  <div class="flex justify-between text-xs font-bold mb-1">
                     <span class="text-rose-400 uppercase tracking-widest">❤️ HP (Kehadiran)</span>
                     <span class="text-rose-300">{{ student?.hp ?? 100 }}/100</span>
                  </div>
                  <div class="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                     <div class="h-full bg-gradient-to-r from-rose-700 to-rose-400 transition-all duration-1000" :style="`width: ${student?.hp ?? 100}%`"></div>
                  </div>
               </div>

               <!-- XP Bar (Experience/Nilai) -->
               <div>
                  <div class="flex justify-between text-xs font-bold mb-1">
                     <span class="text-blue-400 uppercase tracking-widest">🌟 XP (Experience)</span>
                     <span class="text-blue-300">{{ student?.xp ?? 0 }} XP</span>
                  </div>
                  <div class="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                     <div class="h-full bg-gradient-to-r from-blue-700 to-blue-400 transition-all duration-1000" :style="`width: ${Math.min(((student?.xp ?? 0) % 1000) / 10, 100)}%`"></div>
                  </div>
               </div>

               <!-- AP Bar (Activity Points) -->
               <div>
                  <div class="flex justify-between text-xs font-bold mb-1">
                     <span class="text-emerald-400 uppercase tracking-widest">⚡ AP (Activity)</span>
                     <span class="text-emerald-300">{{ student?.ap ?? 0 }} AP</span>
                  </div>
                  <div class="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                     <div class="h-full bg-gradient-to-r from-emerald-700 to-emerald-400 transition-all duration-1000" :style="`width: ${Math.min(((student?.ap ?? 0) % 500) / 5, 100)}%`"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 class="text-lg font-bold text-white mb-2">Foto Profil</h2>
        <p class="text-xs text-slate-400 mb-4">Upload foto, atur crop, lalu simpan.</p>

        <div class="flex flex-col md:flex-row gap-6">
          <div class="w-40 h-40 rounded-2xl bg-slate-800 overflow-hidden flex items-center justify-center">
            <img v-if="photoPreview" :src="photoPreview" alt="Preview" class="w-full h-full object-cover">
            <span v-else class="text-xs text-slate-500">Preview</span>
          </div>
          <div class="flex-1 space-y-4">
            <input type="file" accept="image/*" @change="handlePhotoSelected" class="block w-full text-sm text-slate-300">
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
            <p class="text-[11px] text-slate-500">Maks 5MB. Hasil otomatis dikompres.</p>
            <div v-if="photoError" class="text-xs text-rose-400">{{ photoError }}</div>
            <div class="flex items-center gap-3">
              <button
                class="px-4 py-2 rounded-full text-sm font-semibold bg-slate-800 hover:bg-slate-700"
                type="button"
                @click="resetPhotoState"
              >
                Reset
              </button>
              <button
                class="px-5 py-2 rounded-full text-sm font-semibold bg-sky-500 hover:bg-sky-400 text-black disabled:opacity-60"
                :disabled="photoUploading || !photoFile"
                type="button"
                @click="uploadPhoto"
              >
                {{ photoUploading ? 'Mengunggah...' : 'Simpan Foto' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 class="text-lg font-bold text-white mb-2">Ubah Password</h2>
        <p class="text-xs text-slate-400 mb-4">Gunakan password baru minimal 6 karakter.</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            v-model="currentPassword"
            type="password"
            placeholder="Password Saat Ini"
            class="border border-slate-700 rounded-lg px-4 py-3 bg-slate-900 text-white"
          />
          <input
            v-model="newPassword"
            type="password"
            placeholder="Password Baru"
            class="border border-slate-700 rounded-lg px-4 py-3 bg-slate-900 text-white"
          />
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Konfirmasi Password Baru"
            class="border border-slate-700 rounded-lg px-4 py-3 bg-slate-900 text-white"
          />
        </div>
        <div class="mt-4 flex items-center gap-3">
          <button
            type="button"
            class="px-5 py-2 rounded-full text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-black disabled:opacity-60"
            :disabled="passwordLoading"
            @click="handleChangePassword"
          >
            {{ passwordLoading ? 'Menyimpan...' : 'Simpan Password' }}
          </button>
          <span v-if="passwordSuccess" class="text-xs text-emerald-300">{{ passwordSuccess }}</span>
        </div>
        <div v-if="passwordError" class="text-xs text-rose-400 mt-2">{{ passwordError }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';
import { resolveStorageUrl } from '../utils/storage';
import { useDialog } from '../utils/dialog';

const student = ref<any>(null);
const photoFile = ref<File | null>(null);
const photoPreview = ref<string>('');
const photoImage = ref<HTMLImageElement | null>(null);
const photoBlob = ref<Blob | null>(null);
const photoRatio = ref<'1:1' | '4:3'>('1:1');
const photoZoom = ref(1);
const photoUploading = ref(false);
const photoError = ref('');
const STUDENT_UPDATED_EVENT = 'student-updated';
const dialog = useDialog();
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const passwordLoading = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');

const loadStudent = async () => {
  const saved = localStorage.getItem('student');
  student.value = saved ? JSON.parse(saved) : null;
  if (student.value?.id) {
    try {
      const { data } = await api.get(`/students/${student.value.id}`);
      if (data) {
        student.value = { ...student.value, ...data };
        localStorage.setItem('student', JSON.stringify(student.value));
      }
    } catch {
      // ignore refresh errors
    }
  }
};

const resetPhotoState = () => {
  photoFile.value = null;
  photoImage.value = null;
  photoBlob.value = null;
  photoError.value = '';
  if (photoPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(photoPreview.value);
  }
  photoPreview.value = student.value?.photo_profile
    ? resolveStorageUrl(student.value.photo_profile)
    : '';
  photoRatio.value = '1:1';
  photoZoom.value = 1;
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
  const file = input.files.item(0);
  if (!file) return;
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
    window.dispatchEvent(new Event(STUDENT_UPDATED_EVENT));
    resetPhotoState();
  } catch (e: any) {
    photoError.value = e?.response?.data?.error || e?.message || 'Gagal mengunggah foto.';
  } finally {
    photoUploading.value = false;
  }
};

const handleChangePassword = async () => {
  passwordError.value = '';
  passwordSuccess.value = '';
  if (!student.value?.nisn) {
    passwordError.value = 'Data siswa tidak ditemukan.';
    return;
  }
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    passwordError.value = 'Semua field wajib diisi.';
    return;
  }
  if (newPassword.value.length < 6) {
    passwordError.value = 'Password baru minimal 6 karakter.';
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Konfirmasi password tidak cocok.';
    return;
  }
  passwordLoading.value = true;
  try {
    await api.post('/auth/student/change-password', {
      nisn: student.value.nisn,
      current_password: currentPassword.value,
      new_password: newPassword.value,
    });
    passwordSuccess.value = 'Password berhasil diubah.';
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (e: any) {
    const code = e?.response?.data?.code;
    if (e?.response?.status === 404 || code === 'PASSWORD_NOT_SET') {
      try {
        await api.post('/auth/student/set-password', {
          nisn: student.value.nisn,
          password: newPassword.value,
        });
        passwordSuccess.value = 'Password berhasil diubah.';
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
        passwordLoading.value = false;
        return;
      } catch (fallbackError: any) {
        await dialog.alert(
          fallbackError?.response?.data?.error ||
            fallbackError?.message ||
            'Gagal mengubah password.',
          'Ubah Password',
        );
      }
    } else {
      await dialog.alert(
        e?.response?.data?.error || e?.message || 'Gagal mengubah password.',
        'Ubah Password',
      );
    }
  } finally {
    passwordLoading.value = false;
  }
};

onMounted(async () => {
  await loadStudent();
  resetPhotoState();
});
</script>
