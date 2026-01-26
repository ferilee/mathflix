<template>
  <div>

      <!-- Hero Section -->
    <div class="relative h-[80vh] w-full" data-tour="hero">
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop');">
        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
      </div>

      <div class="relative z-10 flex flex-col justify-center h-full px-4 md:px-12 max-w-2xl space-y-4">
        <span class="text-red-500 font-bold tracking-widest uppercase">Featured Topic</span>
        <h1 class="text-5xl md:text-7xl font-extrabold text-white leading-tight">
          {{ featuredMaterial?.title || 'Selamat Datang' }}
        </h1>
        <p class="text-lg text-gray-300 line-clamp-3">
            {{ featuredMaterial?.description || stripHtml(featuredMaterial?.content || '') }}
        </p>

        <div class="flex gap-4 pt-4" v-if="featuredMaterial">
          <button @click="openMaterial(featuredMaterial.id)" class="flex items-center gap-2 bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 transition">
            <span>▶</span> Mulai Belajar
          </button>
          <button @click="addToMyList(featuredMaterial)" class="flex items-center gap-2 bg-gray-600/70 text-white px-6 py-2 rounded font-bold hover:bg-gray-600 transition backdrop-blur-sm">
            <span>+</span> Daftar Saya
          </button>
        </div>
      </div>
    </div>

    <!-- Content Rows -->
    <div class="-mt-32 relative z-20 space-y-12 px-4 md:px-12 pb-20">

      <!-- Materials Row -->
      <section data-tour="materials">
        <h3 class="text-xl font-semibold text-white mb-4 pl-1 hover:text-gray-300 cursor-pointer">Materi Populer</h3>
        <div class="group relative">
           <div class="flex gap-4 overflow-x-auto overflow-y-visible py-6 scrollbar-hide scroll-smooth">
              <div
                v-for="material in materials"
                :key="material.id"
                class="flex-none w-64 aspect-video bg-gray-900 rounded-lg overflow-hidden ring-1 ring-white/10 hover:ring-2 hover:ring-red-600 hover:scale-110 transition-all duration-300 cursor-pointer relative group/card shadow-2xl"
                @click="openMaterial(material.id)"
              >
                <!-- Background Image or Gradient -->
                <div
                   class="h-full w-full flex items-center justify-center relative shadow-inner"
                   :style="`background-image: url('${material.image_url ? resolveStorageUrl(material.image_url) : '/material-placeholder.png'}'); background-size: cover; background-position: center;`"
                >
                  <!-- Overlay for title -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex items-end p-4 group-hover/card:via-black/10 transition-all duration-300">
                     <h4 class="text-xs md:text-sm font-bold text-white drop-shadow-lg leading-tight">{{ material.title }}</h4>
                  </div>
                  <!-- Logo/Badge Overlay (Netflix style) -->
                  <div class="absolute top-2 left-2 w-5 h-5 bg-red-600 rounded-sm flex items-center justify-center shadow-lg transform -rotate-12 group-hover/card:rotate-0 transition-transform">
                    <span class="text-[9px] text-white font-black italic">M</span>
                  </div>
                </div>

                <!-- Hover Info -->
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                   <div class="transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
                      <p class="text-[10px] text-green-400 font-bold mb-1">98% Match</p>
                      <div class="flex items-center gap-2 mb-2">
                        <span class="px-1.5 py-0.5 border border-gray-400 text-[9px] text-gray-300 rounded uppercase tracking-tighter">{{ material.major_target || 'Umum' }}</span>
                      </div>
                      <div class="flex gap-2">
                        <button class="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 shadow-lg text-xs">▶</button>
                        <button @click.stop="addToMyList(material)" class="w-7 h-7 rounded-full border border-gray-400 text-white flex items-center justify-center hover:border-white hover:bg-gray-700/50 backdrop-blur-sm transition shadow-lg text-xs">+</button>
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </section>

      <!-- Recommendations Row -->
      <section v-if="recommendations.length > 0" data-tour="recommendations">
         <div class="flex items-center justify-between mb-4 px-1">
            <h3 class="text-xl font-semibold text-white hover:text-gray-300 cursor-pointer transition">Rekomendasi Untukmu</h3>
            <span class="text-xs text-gray-400 font-bold uppercase tracking-widest">Berdasarkan kuis terakhir</span>
         </div>
         <div class="flex gap-4 overflow-x-auto overflow-y-visible py-6 scrollbar-hide scroll-smooth">
             <div
               v-for="rec in recommendations"
               :key="rec.material_id"
               class="flex-none w-64 aspect-video bg-gray-900 rounded-lg overflow-hidden ring-1 ring-white/10 hover:ring-2 hover:ring-emerald-500 hover:scale-110 transition-all duration-300 cursor-pointer relative group/card shadow-2xl"
               @click="openMaterial(rec.material_id)"
             >
                <div
                   class="h-full w-full flex items-center justify-center relative shadow-inner"
                   :style="`background-image: url('${rec.image_url ? resolveStorageUrl(rec.image_url) : '/material-placeholder.png'}'); background-size: cover; background-position: center;`"
                >
                  <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex items-end p-4 group-hover/card:via-black/10 transition-all duration-300">
                     <h4 class="text-xs md:text-sm font-bold text-white drop-shadow-lg leading-tight">{{ rec.title }}</h4>
                  </div>
                  <div class="absolute top-2 left-2 bg-emerald-500 text-black text-[9px] font-black px-2 py-0.5 rounded shadow-lg tracking-widest">
                    REK
                  </div>
                </div>
                <div class="absolute inset-0 bg-black/70 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                   <div class="text-[10px] text-emerald-300 font-bold mb-2">{{ rec.reason }}</div>
                   <div class="flex gap-2">
                     <button class="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 shadow-lg text-xs">▶</button>
                     <button @click.stop="addToMyList(rec)" class="w-7 h-7 rounded-full border border-gray-400 text-white flex items-center justify-center hover:border-white hover:bg-gray-700/50 backdrop-blur-sm transition shadow-lg text-xs">+</button>
                   </div>
                </div>
             </div>
         </div>
      </section>

      <!-- Quizzes Row -->
      <section data-tour="quizzes">
         <div class="flex items-center justify-between mb-4 px-1">
            <h3 class="text-xl font-semibold text-white hover:text-gray-300 cursor-pointer transition">Kuis & Tantangan</h3>
            <span class="text-xs text-indigo-400 font-bold hover:underline cursor-pointer uppercase tracking-widest">Lihat Semua</span>
         </div>
         <div class="flex gap-4 overflow-x-auto overflow-y-visible py-6 scrollbar-hide scroll-smooth">
             <div
               v-for="quiz in quizzes"
               :key="quiz.id"
               class="flex-none w-64 aspect-video bg-gray-900 rounded-lg overflow-hidden ring-1 ring-white/10 hover:ring-2 hover:ring-indigo-500 hover:scale-110 transition-all duration-300 cursor-pointer relative group/card shadow-2xl"
               @click="openQuiz(quiz.id)"
             >
                <!-- Background Image or Gradient -->
                <div
                   class="h-full w-full flex items-center justify-center relative shadow-inner"
                   :style="`background-image: url('${quiz.image_url ? resolveStorageUrl(quiz.image_url) : '/quiz-placeholder.png'}'); background-size: cover; background-position: center;`"
                >
                  <!-- Overlay for title -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex items-end p-4 group-hover/card:via-black/20 transition-all duration-300">
                     <h4 class="text-xs md:text-sm font-bold text-white drop-shadow-lg leading-tight">{{ quiz.title }}</h4>
                  </div>
                   <!-- Logo/Badge Overlay (Netflix style) -->
                   <div class="absolute top-2 left-2 w-5 h-5 bg-indigo-600 rounded-sm flex items-center justify-center shadow-lg transform rotate-6 group-hover/card:rotate-0 transition-transform">
                    <span class="text-[9px] text-white font-black italic">Q</span>
                  </div>
                </div>
                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-center">
                   <div class="transform scale-90 group-hover/card:scale-100 transition-transform duration-300">
                      <p class="text-[10px] text-indigo-400 font-black mb-1 tracking-widest uppercase">Target Score</p>
                      <p class="text-2xl font-black text-white mb-3">{{ quiz.passing_score }}</p>
                      <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-1.5 px-4 rounded shadow-xl text-[10px] uppercase tracking-tighter flex items-center justify-center gap-2">
                         <span>⚡</span> Kerjakan
                      </button>
                   </div>
                </div>
             </div>
         </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';

import { useRouter } from 'vue-router';
import { resolveStorageUrl } from '../utils/storage';
import { isDemoMode, getDemoMaterials, getDemoQuizzes, getDemoStudent, getDemoRecommendations } from '../utils/demo';
import { useDialog } from '../utils/dialog';

const router = useRouter();
const materials = ref<any[]>([]);
const quizzes = ref<any[]>([]);
const featuredMaterial = ref<any>(null);
const student = ref<any>(null);
const recommendations = ref<any[]>([]);
const demoMode = isDemoMode();
const dialog = useDialog();



const stripHtml = (html: string) => {
   const tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

const isMaterialAllowed = (material: any) => {
    if (!student.value) return false;
    const targetGrade = material?.target_grade;
    const targetMajor = material?.major_target;
    const matchesGrade = targetGrade === null || targetGrade === undefined || Number(targetGrade) === Number(student.value.grade_level);
    const matchesMajor = !targetMajor || targetMajor === 'Semua' || targetMajor === student.value.major;
    return matchesGrade && matchesMajor;
};

const openMaterial = (id: string) => {
    if (!student.value) {
        // Redirect to login with return path
        router.push(`/login?redirect=/student/material/${id}`);
    } else {
        router.push(`/student/material/${id}`);
    }
};

const openQuiz = (id: string) => {
    const student = localStorage.getItem('student');
    if (!student) {
         router.push(`/login?redirect=/student/quiz/${id}`);
    } else {
         router.push(`/student/quiz/${id}`);
    }
};

const fetchData = async () => {
  try {
    if (demoMode) {
      student.value = getDemoStudent();
      materials.value = getDemoMaterials();
      quizzes.value = getDemoQuizzes();
      featuredMaterial.value = materials.value[0] || null;
      return;
    }
    const [matRes, quizRes] = await Promise.all([
      api.get('/materials'),
      api.get('/quizzes')
    ]);
    const allMaterials = Array.isArray(matRes.data) ? matRes.data : matRes.data?.data || [];
    materials.value = student.value ? allMaterials.filter(isMaterialAllowed) : allMaterials;
    quizzes.value = quizRes.data;

    // Find featured
    featuredMaterial.value = materials.value.find((m: any) => m.is_featured) || materials.value[0];
  } catch (e) {
    console.error("Failed to load dashboard data", e);
  }
};

const fetchRecommendations = async () => {
  if (demoMode) {
    recommendations.value = getDemoRecommendations();
    return;
  }
  if (!student.value?.id) return;
  try {
    const { data } = await api.get(`/students/${student.value.id}/recommendations`);
    recommendations.value = Array.isArray(data?.recommendations) ? data.recommendations : [];
  } catch (e) {
    console.error("Failed to load recommendations", e);
  }
};

const addToMyList = (material: any) => {
  const studentData = localStorage.getItem('student');
  if (!studentData) {
      dialog.confirm('Anda harus login untuk menyimpan materi. Login sekarang?', 'Login Diperlukan')
        .then((ok) => {
          if (ok) router.push('/login');
        });
      return;
  }

  const student = JSON.parse(studentData);
  const key = `myList_${student.id || student.nisn}`; // Use unique ID/NISN

  const saved = localStorage.getItem(key);
  let list = saved ? JSON.parse(saved) : [];
  const materialId = material.id || material.material_id;

  if (!materialId) {
    void dialog.alert('Materi tidak valid untuk disimpan.');
    return;
  }

  if (!list.find((m: any) => m.id === materialId)) {
    list.push({ ...material, id: materialId });
    localStorage.setItem(key, JSON.stringify(list));
    void dialog.alert('Berhasil ditambahkan ke Daftar Saya!');
  } else {
    void dialog.alert('Materi ini sudah ada di Daftar Saya.');
  }
};

const intervalId = ref<any>(null);

onMounted(() => {
    const saved = localStorage.getItem('student');
    if (saved) {
        student.value = JSON.parse(saved);
    }
    fetchData();
    fetchRecommendations();
    // Poll every 5 seconds for live updates
    if (!demoMode) {
        intervalId.value = setInterval(fetchData, 5000);
    }
});

import { onUnmounted } from 'vue';
onUnmounted(() => {
    if (intervalId.value) clearInterval(intervalId.value);
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
