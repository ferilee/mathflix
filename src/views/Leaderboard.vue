<template>
  <div class="max-w-5xl mx-auto p-4 md:p-6 text-white min-h-[80vh]">
    <h1 class="text-4xl md:text-5xl font-extrabold text-[#ffed4a] mb-10 text-center uppercase tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]" style="-webkit-text-stroke: 1px #b45309;">
       🏆 Heroes Ranking
    </h1>

    <div v-if="loading" class="text-center py-10 text-2xl font-black animate-pulse text-yellow-400 drop-shadow-md">Loading Heroes...</div>

    <div v-else class="space-y-8">
      
      <!-- The Scholar (Highest XP) - Large Top Card -->
      <div v-if="theScholar" class="relative rounded-[2rem] bg-gradient-to-b from-[#ffed4a] to-[#ffc107] border-t-4 border-white/50 border-b-[8px] border-[#d39e00] shadow-xl p-8 overflow-hidden transform transition hover:scale-[1.02]">
        <div class="absolute top-0 left-0 right-0 h-1/3 bg-white/30 rounded-t-[2rem] blur-[1px]"></div>
        <div class="absolute -right-4 -bottom-10 opacity-30 text-[200px] drop-shadow-xl z-0 pointer-events-none">🧙‍♂️</div>

        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div class="flex items-center gap-6 mb-6 md:mb-0">
             <div class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border-4 border-[#ffed4a] flex items-center justify-center font-black text-6xl text-[#d39e00] shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                 {{ getInitial(theScholar.student_name) }}
             </div>
             <div>
                <div class="text-4xl md:text-5xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style="-webkit-text-stroke: 1px #b45309;">
                   {{ getDisplayName(theScholar.student_name) }}
                </div>
                <div class="text-2xl md:text-3xl text-[#fff8b3] font-black uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mt-2" style="-webkit-text-stroke: 1px #854d0e;">
                   Lvl {{ theScholar.level }} • {{ theScholar.xp }} XP
                </div>
             </div>
          </div>
          <div class="text-center flex flex-col items-center bg-black/10 px-6 py-4 rounded-3xl border border-white/20 backdrop-blur-sm">
             <span class="text-6xl md:text-7xl drop-shadow-lg mb-2">🌟</span>
             <h2 class="text-2xl md:text-3xl font-black text-white uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style="-webkit-text-stroke: 1px #d39e00;">
                THE SCHOLAR
             </h2>
          </div>
        </div>
      </div>

      <!-- 3 Columns for the other heroes -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- The Underworld (Orange Card) -->
          <div v-if="theUnderworld.length > 0" class="relative rounded-[2rem] bg-gradient-to-b from-[#fb923c] to-[#f97316] border-t-4 border-white/50 border-b-[8px] border-[#c2410c] shadow-xl p-6 overflow-hidden transform transition hover:-translate-y-1">
            <div class="absolute top-0 left-0 right-0 h-1/3 bg-white/30 rounded-t-[2rem] blur-[1px]"></div>
            <div class="absolute -right-4 -bottom-4 opacity-30 text-[120px] z-0 pointer-events-none">☠️</div>
            <div class="relative z-10 flex flex-col items-center text-center h-full">
               <div class="text-7xl filter drop-shadow-md mb-2">☠️</div>
               <h2 class="text-2xl font-black text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-4" style="-webkit-text-stroke: 1px #c2410c;">
                  UNDERWORLD
               </h2>
               <div class="flex flex-col gap-2 w-full max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                  <div v-for="student in theUnderworld" :key="student.id" class="bg-white/20 rounded-full py-2 px-4 flex justify-between items-center text-sm font-bold shadow-sm backdrop-blur-sm border border-white/30">
                     <span class="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] truncate max-w-[120px]">{{ getDisplayName(student.student_name) }}</span>
                     <span class="text-[#ffedd5] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{{ student.hp }} HP</span>
                  </div>
               </div>
            </div>
          </div>
          
          <!-- The Tactician (Cyan Card) -->
          <div v-if="theTactician" class="relative rounded-[2rem] bg-gradient-to-b from-[#4fd1c5] to-[#06b6d4] border-t-4 border-white/50 border-b-[8px] border-[#0891b2] shadow-xl p-6 overflow-hidden transform transition hover:-translate-y-1">
            <div class="absolute top-0 left-0 right-0 h-1/3 bg-white/30 rounded-t-[2rem] blur-[1px]"></div>
            <div class="absolute -right-4 -bottom-4 opacity-30 text-[120px] z-0 pointer-events-none">🧝‍♂️</div>
            <div class="relative z-10 flex flex-col items-center text-center">
               <div class="text-7xl filter drop-shadow-md mb-2">🧝‍♂️</div>
               <h2 class="text-2xl font-black text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-6" style="-webkit-text-stroke: 1px #0891b2;">
                  TACTICIAN
               </h2>
               <div class="w-24 h-24 rounded-full bg-white border-4 border-[#4fd1c5] flex items-center justify-center font-black text-5xl text-[#0891b2] shadow-[0_4px_10px_rgba(0,0,0,0.3)] mb-4">
                   {{ getInitial(theTactician.student_name) }}
               </div>
               <div class="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style="-webkit-text-stroke: 1px #164e63;">
                  {{ getDisplayName(theTactician.student_name) }}
               </div>
               <div class="text-2xl text-[#cffafe] font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mt-2" style="-webkit-text-stroke: 1px #0891b2;">
                  {{ theTactician.ap }} AP
               </div>
            </div>
          </div>
          
          <!-- The Immortals (Purple Card) -->
          <div v-if="theImmortals.length > 0" class="relative rounded-[2rem] bg-gradient-to-b from-[#d946ef] to-[#a855f7] border-t-4 border-white/50 border-b-[8px] border-[#7e22ce] shadow-xl p-6 overflow-hidden transform transition hover:-translate-y-1">
            <div class="absolute top-0 left-0 right-0 h-1/3 bg-white/30 rounded-t-[2rem] blur-[1px]"></div>
            <div class="absolute -right-4 -bottom-4 opacity-30 text-[120px] z-0 pointer-events-none">🛡️</div>
            <div class="relative z-10 flex flex-col items-center text-center h-full">
               <div class="text-7xl filter drop-shadow-md mb-2">🛡️</div>
               <h2 class="text-2xl font-black text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-6" style="-webkit-text-stroke: 1px #7e22ce;">
                  IMMORTALS
               </h2>
               <div class="flex flex-wrap gap-4 justify-center mt-2">
                  <div v-for="student in theImmortals.slice(0, 4)" :key="student.id" class="flex flex-col items-center">
                      <div class="w-16 h-16 rounded-full bg-white border-4 border-[#d946ef] flex items-center justify-center font-black text-3xl text-[#7e22ce] shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                          {{ getInitial(student.student_name) }}
                      </div>
                      <div class="text-sm font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mt-2 truncate max-w-[70px]">{{ getDisplayName(student.student_name).split(' ')[0] }}</div>
                  </div>
                  <div v-if="theImmortals.length > 4" class="w-16 h-16 rounded-full bg-white/20 border-4 border-white flex items-center justify-center font-black text-2xl text-white shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                     +{{ theImmortals.length - 4 }}
                  </div>
               </div>
            </div>
          </div>
          
      </div>

      <!-- General Ranking -->
      <div class="mt-12 bg-slate-900/80 rounded-[2rem] border-4 border-slate-700 shadow-[0_8px_0_#334155] overflow-hidden backdrop-blur-sm pb-2">
        <h3 class="bg-gradient-to-b from-slate-700 to-slate-800 p-5 font-black text-white text-2xl uppercase tracking-widest border-b-[4px] border-slate-900 text-center shadow-inner drop-shadow-md">
            Guild Members (Overall Rank)
        </h3>
        <div class="grid grid-cols-12 bg-black/60 p-4 font-black text-slate-400 text-sm tracking-wider border-b border-slate-800/50">
           <div class="col-span-2 text-center">RANK</div>
           <div class="col-span-6">CHARACTER</div>
           <div class="col-span-4 text-right">STATS</div>
        </div>

        <div
         v-for="(entry, index) in leaderboard"
         :key="entry.id"
         class="grid grid-cols-12 p-4 border-b border-slate-800/50 items-center hover:bg-slate-800/80 transition"
        >
           <div class="col-span-2 text-center font-black text-3xl" :class="index === 0 ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-600' : 'text-slate-500'">
               {{ index + 1 }}
           </div>
           <div class="col-span-6 flex items-center gap-4">
               <div class="w-12 h-12 rounded-2xl bg-slate-700 flex items-center justify-center font-black text-xl shadow-inner border-b-2 border-slate-900">
                   {{ getInitial(entry.student_name) }}
               </div>
               <div>
                  <div class="font-black text-xl text-white">{{ getDisplayName(entry.student_name) }}</div>
                  <div class="text-sm text-slate-400 font-black">Lvl. {{ entry.level }}</div>
               </div>
           </div>
           <div class="col-span-4 text-right">
              <div class="font-black text-blue-400 text-2xl drop-shadow-sm">{{ entry.xp }} XP</div>
              <div class="text-xs text-slate-400 font-bold mt-1">❤️ {{ entry.hp }} | ⚡ {{ entry.ap }}</div>
           </div>
        </div>

        <div v-if="leaderboard.length === 0" class="p-10 text-center text-slate-500 font-black text-xl uppercase tracking-widest">
           No heroes have joined the realm yet.
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import billingApi from '../api/billing';

const leaderboard = ref<any[]>([]);
const loading = ref(true);

const getDisplayName = (name: string | null | undefined) => {
  return name && name.trim() ? name : 'Hero';
};

const getInitial = (name: string | null | undefined) => {
  const display = getDisplayName(name);
  return display.charAt(0).toUpperCase();
};

const loadData = async () => {
  loading.value = true;
  try {
    const studentInfoStr = localStorage.getItem('student');
    const teacherId = studentInfoStr ? JSON.parse(studentInfoStr).teacher_id : null;
    
    // In demo mode or if no student is logged in, you might mock this or fetch global.
    const res = await billingApi.get('/billing/leaderboard', {
      params: teacherId ? { teacher_id: teacherId } : {}
    });
    
    leaderboard.value = res.data;
  } catch (e) {
    console.error('Failed to load leaderboard', e);
    // Mock Data for demonstration if API fails or empty
    if(leaderboard.value.length === 0) {
      leaderboard.value = [
        { id: 1, student_name: 'Arthur Pendragon', hp: 100, xp: 4500, ap: 320, level: 12, status: 'active' },
        { id: 2, student_name: 'Merlin', hp: 90, xp: 4200, ap: 500, level: 11, status: 'active' },
        { id: 3, student_name: 'Lancelot', hp: 100, xp: 4000, ap: 250, level: 10, status: 'active' },
        { id: 4, student_name: 'Gawain', hp: 40, xp: 1200, ap: 50, level: 3, status: 'Need Healing' },
      ].sort((a, b) => b.xp - a.xp);
    }
  } finally {
    loading.value = false;
  }
};

const theScholar = computed(() => {
  if (leaderboard.value.length === 0) return null;
  // Highest XP
  return [...leaderboard.value].sort((a, b) => b.xp - a.xp)[0];
});

const theTactician = computed(() => {
  if (leaderboard.value.length === 0) return null;
  // Highest AP
  return [...leaderboard.value].sort((a, b) => b.ap - a.ap)[0];
});

const theImmortals = computed(() => {
  // 100 HP
  return leaderboard.value.filter(s => s.hp >= 100);
});

const theUnderworld = computed(() => {
  // HP < 50 or status Need Healing
  return leaderboard.value.filter(s => s.hp < 50 || s.status === 'Need Healing' || s.status === 'DEBUFF');
});

onMounted(() => {
  loadData();
});
</script>
