<template>
  <Transition name="dialog-fade">
    <div v-if="state.open" class="fixed inset-0 z-[200] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="handleCancel"></div>
      <div
        :class="[
          'relative w-[92%] max-w-md rounded-2xl text-white shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden dialog-panel',
          panelClass,
          borderClass
        ]"
      >
        <div :class="['absolute inset-x-0 top-0 h-1', topBarClass]"></div>
        <div class="p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p :class="['text-xs uppercase tracking-[0.2em]', eyebrowClass]">{{ eyebrowText }}</p>
              <h3 class="text-xl font-semibold mt-2">{{ state.title }}</h3>
              <p class="text-sm text-slate-300 mt-3 whitespace-pre-line">{{ state.message }}</p>
            </div>
            <button class="text-slate-400 hover:text-white" @click="handleCancel">✕</button>
          </div>
          <div v-if="state.mode === 'prompt'" class="mt-4">
            <input
              v-model="state.inputValue"
              type="text"
              class="w-full rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/60"
              :placeholder="state.inputPlaceholder"
            />
          </div>
          <div class="mt-6 flex items-center justify-end gap-3">
            <button
              v-if="state.mode !== 'alert'"
              type="button"
              class="px-4 py-2 rounded-full text-sm font-semibold bg-slate-800 hover:bg-slate-700"
              @click="handleCancel"
            >
              {{ state.cancelLabel }}
            </button>
            <button
              type="button"
              :class="['px-5 py-2 rounded-full text-sm font-semibold shadow-[0_10px_20px_rgba(15,23,42,0.25)]', ctaClass]"
              @click="handleConfirm"
            >
              {{ state.confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDialogState, confirmDialog, cancelDialog } from '../utils/dialog';

const state = useDialogState();

const panelClass = computed(() => {
  switch (state.variant) {
    case 'success':
      return 'bg-gradient-to-br from-emerald-900 via-slate-950 to-black';
    case 'warning':
      return 'bg-gradient-to-br from-amber-900 via-slate-950 to-black';
    case 'danger':
      return 'bg-gradient-to-br from-rose-900 via-slate-950 to-black';
    default:
      return 'bg-gradient-to-br from-slate-900 via-slate-950 to-black';
  }
});

const borderClass = computed(() => {
  switch (state.variant) {
    case 'success':
      return 'border border-emerald-500/30';
    case 'warning':
      return 'border border-amber-500/30';
    case 'danger':
      return 'border border-rose-500/30';
    default:
      return 'border border-blue-500/30';
  }
});

const topBarClass = computed(() => {
  switch (state.variant) {
    case 'success':
      return 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400';
    case 'warning':
      return 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400';
    case 'danger':
      return 'bg-gradient-to-r from-rose-500 via-red-600 to-rose-400';
    default:
      return 'bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400';
  }
});

const eyebrowClass = computed(() => {
  switch (state.variant) {
    case 'success':
      return 'text-emerald-300';
    case 'warning':
      return 'text-amber-300';
    case 'danger':
      return 'text-rose-300';
    default:
      return 'text-sky-300';
  }
});

const ctaClass = computed(() => {
  switch (state.variant) {
    case 'success':
      return 'bg-emerald-500 hover:bg-emerald-400 text-black';
    case 'warning':
      return 'bg-amber-400 hover:bg-amber-300 text-black';
    case 'danger':
      return 'bg-rose-600 hover:bg-rose-500 text-white';
    default:
      return 'bg-sky-500 hover:bg-sky-400 text-black';
  }
});

const eyebrowText = computed(() => {
  switch (state.variant) {
    case 'success':
      return 'Berhasil';
    case 'warning':
      return 'Peringatan';
    case 'danger':
      return 'Perhatian';
    default:
      return 'Informasi';
  }
});

const handleConfirm = () => {
  confirmDialog();
};

const handleCancel = () => {
  cancelDialog();
};
</script>

<style scoped>
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 220ms ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-panel {
  animation: dialog-pop 260ms ease;
}

@keyframes dialog-pop {
  0% {
    transform: translateY(10px) scale(0.98);
    opacity: 0.85;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>
