<template>
  <div class="space-y-6">
    <div v-if="isAdmin" class="bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-lg shadow-black/40">
      <div class="mb-4">
        <h2 class="text-xl font-bold text-white admin-title">Pengaturan Pembayaran</h2>
        <p class="text-sm text-slate-400">URL pembayaran yang akan dibuka saat guru mengkonfirmasi tagihan.</p>
      </div>
      <form @submit.prevent="save" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">URL Pembayaran</label>
          <input
            v-model="paymentUrl"
            type="url"
            placeholder="https://payment.example.com"
            class="w-full border border-white/10 rounded-lg px-4 py-3 bg-black/40 text-white"
            required
          />
        </div>
        <div class="flex items-center gap-3">
          <button type="submit" class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-bold">
            Simpan
          </button>
          <span v-if="message" class="text-xs text-emerald-400">{{ message }}</span>
        </div>
      </form>
    </div>

    <div v-if="isGuru" class="bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-lg shadow-black/40">
      <div class="mb-4">
        <h2 class="text-xl font-bold text-white admin-title">Ubah Password</h2>
        <p class="text-sm text-slate-400">Gunakan password baru minimal 6 karakter.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="currentPassword"
          type="password"
          placeholder="Password Saat Ini"
          class="w-full border border-white/10 rounded-lg px-4 py-3 bg-black/40 text-white"
        />
        <input
          v-model="newPassword"
          type="password"
          placeholder="Password Baru"
          class="w-full border border-white/10 rounded-lg px-4 py-3 bg-black/40 text-white"
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Konfirmasi Password"
          class="w-full border border-white/10 rounded-lg px-4 py-3 bg-black/40 text-white"
        />
      </div>
      <div class="mt-4 flex items-center gap-3">
        <button
          type="button"
          class="bg-emerald-500 text-black px-6 py-2 rounded hover:bg-emerald-400 font-bold disabled:opacity-60"
          :disabled="passwordLoading"
          @click="handleChangePassword"
        >
          {{ passwordLoading ? 'Menyimpan...' : 'Simpan Password' }}
        </button>
        <span v-if="passwordSuccess" class="text-xs text-emerald-400">{{ passwordSuccess }}</span>
      </div>
      <div v-if="passwordError" class="text-xs text-rose-400 mt-2">{{ passwordError }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchBillingSettings, saveBillingSettings } from '../utils/billing';
import { useDialog } from '../utils/dialog';
import { getStaffUser } from '../utils/auth';
import api from '../api';

const paymentUrl = ref('');
const message = ref('');
const dialog = useDialog();
const staffUser = ref(getStaffUser());
const isGuru = ref(staffUser.value?.role === 'guru');
const isAdmin = ref(staffUser.value?.role === 'admin');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const passwordLoading = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');

const load = async () => {
  try {
    const data = await fetchBillingSettings();
    paymentUrl.value = data?.payment_url || '';
  } catch {
    paymentUrl.value = '';
  }
};

const save = async () => {
  try {
    await saveBillingSettings({ payment_url: paymentUrl.value });
    message.value = 'Tersimpan.';
    setTimeout(() => (message.value = ''), 2000);
  } catch (e: any) {
    await dialog.alert(e?.response?.data?.error || e?.message || 'Gagal menyimpan pengaturan.');
  }
};

const handleChangePassword = async () => {
  passwordError.value = '';
  passwordSuccess.value = '';
  if (!staffUser.value?.nip) {
    passwordError.value = 'Data guru tidak ditemukan.';
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
    await api.post('/auth/guru/change-password', {
      nip: staffUser.value.nip,
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
        await api.post('/auth/guru/set-password', {
          nip: staffUser.value.nip,
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

onMounted(load);
</script>
