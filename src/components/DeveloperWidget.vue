<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <!-- Backdrop -->
       <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="$emit('close')"></div>

       <!-- Modal Card -->
       <div class="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all scale-100 overflow-hidden">
          <!-- Close Button -->
          <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-500 hover:text-white">
             ✕
          </button>

          <!-- Content -->
          <div class="flex flex-col items-center text-center relative z-10">
             <div class="w-full px-8 pt-8 pb-6 bg-gradient-to-b from-red-600/20 to-transparent">
                <h2 class="text-2xl font-black text-red-600 tracking-tight italic">MATHFLIX</h2>
                <p class="text-xs text-gray-400 mt-1">Developer Profile</p>
             </div>
             <!-- Avatar with Ring -->
             <div class="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-red-500 to-orange-500 -mt-6 mb-6 shadow-xl">
                 <div class="w-full h-full rounded-full bg-gray-900 p-1">
                    <img :src="resolveStorageUrl('/uploads/ferilee.jpg')" alt="Dev" class="w-full h-full rounded-full object-cover">
                 </div>
             </div>

             <!-- Info -->
             <h3 class="font-bold text-white text-2xl mb-1">Feri Dwi Hermawan</h3>
             <p class="text-sm text-red-400 font-semibold mb-6 uppercase tracking-wider">Pengajar & Pengembang</p>

             <p class="text-gray-300 text-sm mb-6 leading-relaxed px-6">
               Mengembangkan teknologi pembelajaran adaptif untuk memajukan pendidikan vokasi di Indonesia.
             </p>

             <!-- Contacts -->
             <div class="space-y-3 w-full px-8 pb-8">
                <a href="https://t.me/ferilee" target="_blank" class="flex items-center justify-center gap-3 w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-500 transition hover:-translate-y-1 shadow-md">
                   <!-- Telegram Icon -->
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/></svg>
                   Hubungi di Telegram
                </a>
                <a href="https://wa.me/6285174244128" target="_blank" class="flex items-center justify-center gap-3 w-full bg-emerald-500 text-white py-3 rounded-lg font-bold hover:bg-emerald-400 transition hover:-translate-y-1 shadow-md">
                   <!-- WhatsApp Icon -->
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                   Hubungi di WhatsApp
                </a>
             </div>
          </div>
       </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { resolveStorageUrl } from '../utils/storage';

defineProps<{
    isOpen: boolean
}>();

const emit = defineEmits(['close']);

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
