<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div class="bg-gray-900 w-full max-w-lg rounded-2xl border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        <div class="p-6 bg-black/50 border-b border-white/10 text-center relative overflow-hidden">
           <div class="absolute inset-0 bg-gradient-to-t from-yellow-900/20 to-transparent"></div>
           <div class="text-5xl mb-3 drop-shadow-md relative z-10">🛡️</div>
           <h2 class="text-2xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(234,179,8,0.8)] relative z-10">Character Profiling</h2>
           <p class="text-xs text-gray-400 font-bold tracking-widest uppercase mt-1 relative z-10">Lengkapi data pahlawanmu sebelum bertualang</p>
        </div>
        <div class="p-6 overflow-y-auto custom-scrollbar">
           <form @submit.prevent="submitProfile" class="space-y-5">
              <!-- Name (readonly) -->
              <div>
                 <label class="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Nama Pahlawan (Hero Name)</label>
                 <input type="text" :value="studentData?.full_name" readonly class="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white text-sm opacity-60 cursor-not-allowed font-medium">
              </div>
              
              <!-- NISN/Telepon -->
              <div>
                 <label class="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Kontak Telepon / NISN</label>
                 <input type="text" v-model="form.nisn" required class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition font-medium" placeholder="Masukkan nomor HP atau NISN aktif">
              </div>

              <!-- Sekolah -->
              <div class="relative">
                 <label class="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Nama Sekolah (Guild Asal)</label>
                 <input type="text" v-model="form.school" @input="searchSchool" required class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition font-medium" placeholder="Ketik nama sekolahmu...">
                 
                 <div v-if="schoolOptions.length > 0 && showSchoolDropdown" class="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                    <div v-for="school in schoolOptions" :key="school" @click="selectSchool(school)" class="px-4 py-3 hover:bg-yellow-500/20 hover:text-yellow-400 cursor-pointer text-sm text-gray-300 transition border-b border-gray-700/50 last:border-0 font-medium">
                       {{ school }}
                    </div>
                 </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                  <!-- Tingkat -->
                  <div>
                     <label class="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Grade (Level)</label>
                     <select v-model="form.grade_level" required class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition font-medium">
                        <option value="" disabled>Pilih Level</option>
                        <option v-for="i in 12" :key="i" :value="i">Kelas {{ i }}</option>
                     </select>
                  </div>

                  <!-- Kelas Name -->
                  <div>
                     <label class="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Kelas (Party)</label>
                     <input type="text" v-model="form.class_name" required class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition font-medium" placeholder="Contoh: A, B, atau 1">
                  </div>
              </div>

              <!-- Major -->
              <div>
                 <label class="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Jurusan (Role/Class)</label>
                 <input type="text" v-model="form.major" required class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition font-medium" placeholder="Contoh: TKJ, IPA, IPS, Umum">
              </div>

              <div class="pt-6">
                 <button type="submit" :disabled="isLoading" class="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-black uppercase tracking-widest py-4 rounded-xl hover:from-yellow-400 hover:to-amber-400 transition transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.4)] disabled:opacity-50 flex items-center justify-center gap-2">
                    <span v-if="isLoading" class="animate-spin text-xl">⏳</span>
                    {{ isLoading ? 'Menyimpan Profil...' : 'Mulai Petualangan ⚔️' }}
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  studentData: any;
}>();

const emit = defineEmits(['saved']);

const form = ref({
  nisn: '',
  school: '',
  grade_level: '',
  class_name: '',
  major: ''
});

const isLoading = ref(false);
const showSchoolDropdown = ref(false);
const schoolOptions = ref<string[]>([]);
let searchTimeout: any = null;

const searchSchool = async () => {
   const q = form.value.school;
   if(q.length < 3) {
      schoolOptions.value = [];
      showSchoolDropdown.value = false;
      return;
   }
   
   if(searchTimeout) clearTimeout(searchTimeout);
   
   searchTimeout = setTimeout(async () => {
       try {
           const res = await fetch(`https://api-sekolah-indonesia.vercel.app/sekolah/s?sekolah=${encodeURIComponent(q)}&perPage=50`);
           const data = await res.json();
           if(data && data.dataSekolah) {
               schoolOptions.value = data.dataSekolah.map((s: any) => s.sekolah).slice(0, 15);
               showSchoolDropdown.value = schoolOptions.value.length > 0;
           } else {
               schoolOptions.value = [];
               showSchoolDropdown.value = false;
           }
       } catch (e) {
           console.error("Failed to fetch schools", e);
           schoolOptions.value = [];
           showSchoolDropdown.value = false;
       }
   }, 500);
};

const selectSchool = (school: string) => {
   form.value.school = school;
   showSchoolDropdown.value = false;
};

const submitProfile = async () => {
    if(!form.value.nisn || !form.value.school || !form.value.grade_level) return;
    isLoading.value = true;
    try {
        const payload = {
            nisn: form.value.nisn,
            school: form.value.school,
            grade_level: Number(form.value.grade_level),
            class_name: form.value.class_name,
            major: form.value.major
        };
        emit('saved', payload);
    } catch(e) {
        console.error(e);
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>
