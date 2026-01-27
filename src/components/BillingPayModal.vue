<template>
  <div v-if="isOpen" class="fixed inset-0 z-[120] flex items-center justify-center">
    <div class="absolute inset-0 bg-black/70" @click="emitClose"></div>
    <div class="relative w-[92%] max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-white">Pembayaran Akses Siswa</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">Pilih siswa yang ingin diaktifkan aksesnya.</p>
        </div>
        <button
          type="button"
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          @click="emitClose"
        >
          ✕
        </button>
      </div>

      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div class="bg-slate-50 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
          <div class="text-slate-500 dark:text-slate-400">Siswa dipilih</div>
          <div class="text-lg font-bold text-slate-800 dark:text-white">{{ selectedIds.length }}</div>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
          <div class="text-slate-500 dark:text-slate-400">Harga per kelas</div>
          <div class="text-lg font-bold text-slate-800 dark:text-white">{{ formatRupiah(pricePerClass) }}</div>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
          <div class="text-slate-500 dark:text-slate-400">Total tagihan</div>
          <div class="text-lg font-bold text-slate-800 dark:text-white">{{ formatRupiah(totalAmount) }}</div>
        </div>
      </div>

      <div class="mt-3 text-xs text-slate-500 dark:text-slate-400">
        1 kelas = {{ studentsPerClass }} siswa. Total kelas ditagihkan dihitung otomatis.
      </div>

      <div class="mt-4 flex flex-wrap items-center gap-3 text-xs">
        <button
          type="button"
          class="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          @click="selectAllUnpaid"
        >
          Pilih Semua Belum Bayar
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          @click="clearSelection"
        >
          Bersihkan Pilihan
        </button>
      </div>

      <div class="mt-4 max-h-[320px] overflow-auto border border-slate-200 dark:border-slate-700 rounded-xl">
        <div
          v-for="student in students"
          :key="student.id"
          class="flex items-center justify-between gap-4 px-4 py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
        >
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              class="accent-indigo-600"
              :value="student.id"
              :checked="selectedIds.includes(student.id)"
              @change="toggleSelection(student.id)"
            />
            <div>
              <div class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ student.full_name }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ student.nisn || 'Tanpa NISN' }}</div>
            </div>
          </label>
          <span
            class="text-xs font-bold px-2 py-1 rounded"
            :class="student.access.badgeClass"
          >
            {{ student.access.label }}
          </span>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="px-4 py-2 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          @click="emitClose"
        >
          Batal
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded bg-amber-500 text-black font-bold hover:bg-amber-400 disabled:opacity-60"
          :disabled="selectedIds.length === 0 || isLoading"
          @click="emitConfirm"
        >
          {{ isLoading ? 'Memproses...' : 'Bayar Sekarang' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface StudentAccessInfo {
  label: string;
  badgeClass: string;
}

interface BillingStudentItem {
  id: string;
  nisn?: string;
  full_name: string;
  access: StudentAccessInfo;
}

const props = defineProps<{
  isOpen: boolean;
  students: BillingStudentItem[];
  selectedIds: string[];
  pricePerClass: number;
  studentsPerClass: number;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:selectedIds', value: string[]): void;
  (e: 'confirm'): void;
  (e: 'close'): void;
}>();

const totalAmount = computed(() => {
  const classCount = Math.ceil(props.selectedIds.length / props.studentsPerClass);
  return classCount * props.pricePerClass;
});

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
};

const emitClose = () => emit('close');

const toggleSelection = (studentId: string) => {
  const selected = new Set(props.selectedIds);
  if (selected.has(studentId)) {
    selected.delete(studentId);
  } else {
    selected.add(studentId);
  }
  emit('update:selectedIds', Array.from(selected));
};

const selectAllUnpaid = () => {
  const unpaidIds = props.students
    .filter((student) => student.access.label !== 'Gratis' && student.access.label !== 'Berbayar')
    .map((student) => student.id);
  emit('update:selectedIds', unpaidIds);
};

const clearSelection = () => emit('update:selectedIds', []);

const emitConfirm = () => emit('confirm');
</script>
