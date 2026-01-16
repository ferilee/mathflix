<template>
  <div>
      <!-- Hero Section -->
    <div class="relative h-[80vh] w-full">
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
      <section>
        <h3 class="text-xl font-semibold text-white mb-4 pl-1 hover:text-gray-300 cursor-pointer">Materi Populer</h3>
        <div class="group relative">
           <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
             <div 
               v-for="material in materials" 
               :key="material.id"
               class="flex-none w-64 aspect-video bg-gray-800 rounded-md overflow-hidden hover:scale-105 transition duration-300 cursor-pointer relative group/card"
               @click="openMaterial(material.id)"
             >
                <!-- Placeholder Image -->
                <div class="h-full w-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4">
                  <h4 class="text-lg font-bold text-center">{{ material.title }}</h4>
                </div>
                
                <!-- Hover Info -->
                <div class="absolute inset-0 bg-black/80 opacity-0 group-hover/card:opacity-100 transition flex flex-col justify-end p-4">
                   <p class="text-xs text-green-400 font-bold mb-1">98% Match</p>
                   <p class="text-xs text-gray-300">{{ material.major_target }}</p>
                   <div class="flex gap-2 mt-2">
                     <button class="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200">▶</button>
                     <button @click.stop="addToMyList(material)" class="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-white hover:bg-gray-700 transition">+</button>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </section>

      <!-- Quizzes Row -->
      <section>
         <h3 class="text-xl font-semibold text-white mb-4 pl-1 hover:text-gray-300 cursor-pointer">Kuis Terbaru</h3>
         <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
             <div 
               v-for="quiz in quizzes" 
               :key="quiz.id"
               class="flex-none w-64 aspect-video bg-gray-800 rounded-md overflow-hidden hover:scale-105 transition duration-300 cursor-pointer relative group/card"
               @click="openQuiz(quiz.id)"
             >
                <div class="h-full w-full bg-gradient-to-br from-red-900 to-orange-900 flex items-center justify-center p-4">
                  <h4 class="text-lg font-bold text-center">{{ quiz.title }}</h4>
                </div>
                <div class="absolute inset-0 bg-black/80 opacity-0 group-hover/card:opacity-100 transition flex flex-col justify-end p-4">
                   <p class="text-xs text-red-500 font-bold mb-1">KKM: {{ quiz.passing_score }}</p>
                   <button class="mt-2 w-full bg-red-600 py-1 rounded text-xs font-bold hover:bg-red-700">Kerjakan Kuis</button>
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

const router = useRouter();
const materials = ref<any[]>([]);
const quizzes = ref<any[]>([]);
const featuredMaterial = ref<any>(null);

const stripHtml = (html: string) => {
   const tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

const openMaterial = (id: string) => {
    const student = localStorage.getItem('student');
    if (!student) {
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
    const [matRes, quizRes] = await Promise.all([
      api.get('/materials'),
      api.get('/quizzes')
    ]);
    materials.value = matRes.data;
    quizzes.value = quizRes.data;
    
    // Find featured
    featuredMaterial.value = materials.value.find((m: any) => m.is_featured) || materials.value[0];
  } catch (e) {
    console.error("Failed to load dashboard data", e);
  }
};

const addToMyList = (material: any) => {
  const studentData = localStorage.getItem('student');
  if (!studentData) {
      if (confirm('Anda harus login untuk menyimpan materi. Login sekarang?')) {
          router.push('/login');
      }
      return;
  }
  
  const student = JSON.parse(studentData);
  const key = `myList_${student.id || student.nisn}`; // Use unique ID/NISN
  
  const saved = localStorage.getItem(key);
  let list = saved ? JSON.parse(saved) : [];
  
  if (!list.find((m: any) => m.id === material.id)) {
    list.push(material);
    localStorage.setItem(key, JSON.stringify(list));
    alert('Berhasil ditambahkan ke Daftar Saya!');
  } else {
    alert('Materi ini sudah ada di Daftar Saya.');
  }
};

onMounted(fetchData);
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
