<template>
  <div class="bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-lg shadow-black/40">
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchBillingSettings, saveBillingSettings } from '../utils/billing';
import { useDialog } from '../utils/dialog';

const paymentUrl = ref('');
const message = ref('');
const dialog = useDialog();

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

onMounted(load);
</script>
