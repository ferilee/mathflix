<template>
  <div class="min-h-screen bg-gray-900 text-white pb-20">
    <!-- Header / Hero -->
    <div class="relative h-64 w-full bg-gradient-to-r from-red-900 via-gray-900 to-black">
       <div class="absolute inset-0 bg-black/30"></div>
       <div class="relative z-10 p-6 md:p-12 flex flex-col justify-end h-full max-w-4xl mx-auto">
          <button @click="$router.back()" class="text-gray-300 hover:text-white mb-4 flex items-center gap-2">
            ← Kembali
          </button>
          
          <div class="flex flex-wrap gap-3 mb-2">
             <span class="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded uppercase tracking-wider">{{ material?.major_target || 'General' }}</span>
             
             <!-- Instructor Badge -->
             <div class="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-600">
                <div class="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold">I</div>
                <span class="text-xs text-gray-200">Instructor: <span class="text-white font-bold">{{ material?.teacher_name || 'Feri Dwi Hermawan' }}</span></span>
             </div>
          </div>
          
          <h1 class="text-4xl md:text-5xl font-bold">{{ material?.title }}</h1>
       </div>
    </div>

    <!-- Content Area -->
    <div class="max-w-4xl mx-auto p-6 md:p-12">
       <div v-if="loading" class="text-center py-10">Loading material...</div>
       
       <div v-else class="space-y-8">
          
          <!-- Progression Cards -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
             <button 
               v-for="(stage, index) in deltaStages" 
               :key="stage.key"
               @click="selectStage(index)"
               :disabled="index > currentUnlockedIndex"
               class="relative p-4 rounded-lg border transition-all duration-300 flex flex-col items-center text-center h-full justify-center gap-2"
               :class="{
                  'bg-indigo-600 border-indigo-400 text-white shadow-lg scale-105': activeStageIndex === index,
                  'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700': index <= currentUnlockedIndex && activeStageIndex !== index,
                  'bg-gray-900/50 border-gray-800 text-gray-600 cursor-not-allowed opacity-70': index > currentUnlockedIndex
               }"
             >
                <div class="font-bold text-xs uppercase tracking-wider">{{ stage.label.split('.')[1] }}</div>
                <div v-if="index > currentUnlockedIndex" class="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                   🔒
                </div>
                <div v-if="index < currentUnlockedIndex" class="absolute top-2 right-2 text-green-400 text-xs shadow-black drop-shadow-md">
                   ✓
                </div>
             </button>
          </div>

          <!-- Active Stage Content -->
          <div v-if="currentStageContent" class="bg-[#181818] text-white rounded-lg shadow-xl overflow-hidden min-h-[400px] flex flex-col border border-[#333]">
             
             <!-- Stage Header -->
             <div class="bg-[#141414] p-6 border-b border-[#333] flex justify-between items-center">
                 <div>
                    <h2 class="text-2xl font-bold text-[#E50914]">{{ deltaStages[activeStageIndex]?.label }}</h2>
                    <p class="text-gray-400 text-sm">{{ deltaStages[activeStageIndex]?.desc }}</p>
                 </div>
                 <div class="text-4xl opacity-20 text-white">
                    {{ deltaStages[activeStageIndex]?.icon }}
                 </div>
             </div>

             <!-- Content Body -->
             <div class="p-8 flex-1">
                 
                 <!-- Embedded Tool (Explore Stage) -->
                 <div v-if="deltaStages[activeStageIndex]?.key === 'explore' && material?.embedded_tool_url" class="mb-8">
                     <div class="bg-[#2F2F2F] p-2 rounded-lg border border-[#333]">
                        <div class="aspect-w-16 aspect-h-9 w-full h-[500px]">
                            <iframe 
                                :src="material.embedded_tool_url" 
                                width="100%" 
                                height="100%" 
                                style="border:0" 
                                allowfullscreen
                            ></iframe>
                        </div>
                        <div class="text-center text-xs text-gray-500 mt-2">
                            Interactive Simulation provided by {{ material.tool_type || 'External Tool' }}
                        </div>
                     </div>
                 </div>

                 <div class="prose prose-invert max-w-none text-gray-300">
                    <MathRenderer :content="currentStageContent" />
                 </div>
                 
                 <div v-if="!currentStageContent || currentStageContent === '<p><br></p>'" class="text-center text-gray-500 py-10 italic">
                    Konten untuk tahapan ini belum tersedia.
                 </div>
             </div>

             <!-- Stage Footer / Navigation -->
             <div class="bg-[#141414] p-6 border-t border-[#333] flex justify-end">
                <button 
                  v-if="activeStageIndex === currentUnlockedIndex && activeStageIndex < 4"
                  @click="unlockNextStage"
                  class="bg-[#E50914] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 hover:scale-105 transition flex items-center gap-2"
                >
                  Selesaikan & Lanjut ➜
                </button>
                <button 
                  v-else-if="activeStageIndex === 4"
                  @click="$router.push('/student')"
                  class="bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-700 hover:scale-105 transition"
                >
                  Selesai Belajar 🎉
                </button>
                 <button 
                  v-else
                  @click="selectStage(activeStageIndex + 1)"
                  class="text-[#E50914] font-bold hover:underline hover:text-red-400"
                >
                  Lanjut ke Tahap Berikutnya →
                </button>
             </div>
          </div>

       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';
import MathRenderer from '../components/MathRenderer.vue';

const route = useRoute();
const materialId = route.params.id as string;
const material = ref<any>(null);
const loading = ref(true);

const deltaStages = [
    { key: 'discover', label: '1. DISCOVER', desc: 'Menemukan Konsep', icon: '🔍' },
    { key: 'explore', label: '2. EXPLORE', desc: 'Eksplorasi Mendalam', icon: '🧭' },
    { key: 'launch', label: '3. LAUNCH', desc: 'Aplikasi Nyata', icon: '🚀' },
    { key: 'transform', label: '4. TRANSFORM', desc: 'Refleksi Diri', icon: '🔄' },
    { key: 'assess', label: '5. ASSESS', desc: 'Evaluasi Pemahaman', icon: '📊' },
];

const parsedContent = ref<Record<string, string>>({});
const activeStageIndex = ref(0);
const currentUnlockedIndex = ref(0);

const currentStageContent = computed(() => {
    const stage = deltaStages[activeStageIndex.value];
    if (!stage) return '';
    const key = stage.key;
    return parsedContent.value[key] || '';
});

const fetchMaterial = async () => {
  try {
    const { data } = await api.get(`/materials/${materialId}`);
    material.value = data;
    parseContent(data.content);
    loadProgress();
  } catch (e) {
    console.error("Failed to load material", e);
  } finally {
    loading.value = false;
  }
};

const parseContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    deltaStages.forEach(stage => {
        const section = doc.querySelector(`div[data-stage="${stage.key}"]`);
        if (section) {
            // Remove the header we added in MaterialForm if present, to avoid double headers
            // Actually, we want to strip the outer div wrapper mostly.
            // But let's keep it simple: take innerHTML.
            // However, the innerHTML includes the H3 header we injected. Let's try to strip it if possible or just render detailed content.
            // Our MaterialForm saves: <div ...><h3 ...>...</h3> content </div>
            // We might want to remove that H3 since we have our own header now.
            const h3 = section.querySelector('h3');
            if (h3) h3.remove();
            parsedContent.value[stage.key] = section.innerHTML;
        }
    });

    // Fallback if legacy content (no delta tags)
    const hasData = Object.values(parsedContent.value).some(v => v.length > 0);
    if (!hasData && html) {
        parsedContent.value['discover'] = html;
        parsedContent.value['explore'] = '<p>Konten legacy ditampilkan di tahap Discover.</p>';
    }
};

const getProgressKey = () => {
    const studentData = localStorage.getItem('student');
    if (!studentData) return null;
    const student = JSON.parse(studentData);
    return `progress_${student.id || student.nisn}_${materialId}`;
};

const loadProgress = () => {
    const key = getProgressKey();
    if (!key) return; // Anonymous users (if allowed) start at 0

    const saved = localStorage.getItem(key);
    if (saved) {
        currentUnlockedIndex.value = parseInt(saved);
        activeStageIndex.value = headerProgress(parseInt(saved)); 
    }
};

const headerProgress = (max: number) => {
   return max < 4 ? max : 0; 
}

const selectStage = (index: number) => {
    if (index <= currentUnlockedIndex.value) {
        activeStageIndex.value = index;
    }
};

const unlockNextStage = () => {
    if (activeStageIndex.value < 4) {
        const next = activeStageIndex.value + 1;
        if (next > currentUnlockedIndex.value) {
            currentUnlockedIndex.value = next;
            
            const key = getProgressKey();
            if (key) {
                localStorage.setItem(key, next.toString());
            }
        }
        activeStageIndex.value = next;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

onMounted(fetchMaterial);
</script>

<style>
/* Override default math renderer styles if needed */
</style>
