<template>
  <div>
    <!-- Badge Achievement Modal -->
    <div v-if="showBadgeModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="confetti-layer">
          <span
            v-for="piece in confettiPieces"
            :key="piece.id"
            class="confetti-piece"
            :style="{
              left: piece.left,
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              '--rotate-angle': piece.rotate
            }"
          ></span>
        </div>
      </div>
      <div class="relative w-full max-w-md bg-[#141414] border border-yellow-500/60 rounded-2xl p-6 text-center shadow-2xl">
        <div class="text-5xl mb-3">{{ activeBadge?.icon || '🏅' }}</div>
        <h3 class="text-2xl font-bold text-yellow-400 mb-2">Pencapaian Baru!</h3>
        <div class="text-lg font-semibold text-white mb-2">
          {{ activeBadge?.name || 'Badge Baru' }}
        </div>
        <p class="text-sm text-gray-300 mb-6">
          {{ activeBadge?.description || 'Terus tingkatkan pencapaianmu.' }}
        </p>
        <button
          type="button"
          class="bg-yellow-500 text-black font-bold px-6 py-2 rounded-full hover:bg-yellow-400 transition"
          @click="closeBadgeModal"
        >
          Lanjut
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 text-white">Loading Quiz...</div>

    <!-- Mode: Millionaire -->
    <div v-else-if="quiz?.style === 'millionaire'" class="millionaire-app min-h-screen bg-gradient-to-b from-blue-900 to-black text-white font-sans flex flex-col items-center justify-start md:justify-center relative overflow-hidden">
        <!-- Background Effects -->
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
        <div class="absolute inset-0 bg-radial-gradient from-blue-800/30 to-transparent pointer-events-none"></div>

        <!-- Result Screen -->
        <div v-if="gameState === 'result'" class="text-center z-10 w-full max-w-2xl p-8 bg-blue-900/80 border-2 border-yellow-500 rounded-xl shadow-2xl backdrop-blur-sm mt-10 md:mt-0">
             <h2 class="text-4xl font-bold mb-6 text-yellow-400 font-serif tracking-widest uppercase">Game Over</h2>
             <div class="mb-8">
                <div class="text-6xl font-extrabold text-white drop-shadow-lg mb-2">
                    Rp {{ formatCurrency(Math.floor((result?.score / 100) * questions.length) * 1000000) }}
                </div>
                <div class="text-xl text-blue-200">Total Hadiah ({{ Math.floor((result?.score / 100) * questions.length) }} Benar)</div>
             </div>

             <div class="text-2xl font-bold text-green-400 mb-6" v-if="result?.score > 75">🎉 LUAR BIASA! 🎉</div>
             <div class="text-xl text-gray-300 mb-6" v-else>Terima kasih telah bermain!</div>

             <div class="flex justify-center gap-4">
                <button @click="$router.push('/student')" class="hex-btn bg-gray-600 hover:bg-gray-500 p-3 rounded">Main Menu</button>
                <button @click="$router.push('/student/leaderboard')" class="hex-btn bg-yellow-600 hover:bg-yellow-500 p-3 rounded text-black font-bold">Leaderboard</button>
             </div>
        </div>

        <!-- Game Interface -->
        <div v-else class="w-full max-w-6xl flex flex-col md:flex-row h-screen md:h-auto md:py-10 z-10 relative overflow-hidden">

            <!-- Mobile Money Ladder (Collapsible/Drawer) -->
            <div class="md:hidden absolute top-0 right-0 z-50">
               <button @click="showMobileLadder = !showMobileLadder" class="bg-blue-900 border border-yellow-500 text-yellow-400 px-3 py-1 rounded-bl-lg text-xs font-bold shadow-lg">
                  {{ showMobileLadder ? 'Hide Money' : 'Show Money' }}
               </button>
               <div v-if="showMobileLadder" class="bg-blue-950/95 border-l border-b border-yellow-500 p-2 rounded-bl-xl shadow-2xl max-h-[50vh] overflow-y-auto w-48 transition-all">
                  <div class="text-[10px] text-gray-400 text-center mb-1 italic">*Uang ini hanya khayalan</div>
                  <div v-for="(q, i) in questions" :key="q.id"
                       class="flex justify-between items-center px-2 py-1 mb-0.5 text-[10px] font-bold rounded"
                       :class="{
                          'bg-yellow-500 text-black border border-white': (questions.length - 1 - i) === currentQuestionIndex,
                          'text-yellow-200': (questions.length - 1 - i) > currentQuestionIndex,
                          'text-gray-500': (questions.length - 1 - i) < currentQuestionIndex,
                          'text-white': (questions.length - 1 - i) % 5 === 4
                       }">
                      <span class="w-4 text-center">{{ questions.length - i }}</span>
                      <span class="flex-1 text-right">Rp {{ formatCurrency((questions.length - i) * 1000000) }}</span>
                  </div>
               </div>
            </div>

            <!-- Left: Main Game Area -->
            <div class="flex-1 flex flex-col px-2 pt-12 md:px-4 md:pt-4 pb-2 md:pb-4 h-full">
                 <!-- Header: Lifelines & Current Prize -->
                 <div class="flex justify-between items-start mb-6 shrink-0">
                     <!-- Lifelines -->
                     <div class="flex gap-2">
                         <button @click="useLifeline('5050')" :disabled="!lifelines.fiftyFifty || revealState !== 'waiting'" class="group flex flex-col items-center transform transition" :class="{ 'opacity-50 grayscale': !lifelines.fiftyFifty }">
                             <div class="w-10 h-8 md:w-14 md:h-10 border-2 border-yellow-500 rounded-full flex items-center justify-center bg-blue-950 text-yellow-500 font-bold text-xs shadow-lg hover:bg-yellow-500 hover:text-black transition">50:50</div>
                         </button>
                         <button @click="useLifeline('phone')" :disabled="!lifelines.phone || revealState !== 'waiting'" class="group flex flex-col items-center transform transition" :class="{ 'opacity-50 grayscale': !lifelines.phone }">
                             <div class="w-10 h-8 md:w-14 md:h-10 border-2 border-yellow-500 rounded-full flex items-center justify-center bg-blue-950 text-yellow-500 font-bold text-xs shadow-lg hover:bg-yellow-500 hover:text-black transition">☎️</div>
                         </button>
                         <button @click="useLifeline('audience')" :disabled="!lifelines.audience || revealState !== 'waiting'" class="group flex flex-col items-center transform transition" :class="{ 'opacity-50 grayscale': !lifelines.audience }">
                             <div class="w-10 h-8 md:w-14 md:h-10 border-2 border-yellow-500 rounded-full flex items-center justify-center bg-blue-950 text-yellow-500 font-bold text-xs shadow-lg hover:bg-yellow-500 hover:text-black transition">👥</div>
                         </button>
                     </div>

                     <!-- Current Level Indicator -->
                     <div class="text-right">
                        <div class="text-yellow-400 font-bold text-xl md:text-2xl drop-shadow-md">Rp {{ formatCurrency((currentQuestionIndex + 1) * 1000000) }}</div>
                        <div class="text-[10px] text-gray-400 italic md:hidden">*Uang Fiktif</div>
                     </div>
                 </div>

                 <!-- Modal for Lifelines -->
                 <div v-if="lifelineMessage" class="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click="lifelineMessage = null">
                     <div class="bg-blue-900 border-2 border-yellow-500 p-6 rounded-xl shadow-2xl max-w-sm text-center animate-bounce-in" @click.stop>
                         <h3 class="text-yellow-400 font-bold text-xl mb-4">{{ lifelineTitle }}</h3>
                         <p class="text-white text-lg mb-6 whitespace-pre-line">{{ lifelineMessage }}</p>
                         <button @click="lifelineMessage = null" class="bg-yellow-600 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-full">OK</button>
                     </div>
                 </div>

                 <!-- Question (Flex Grow to fill space but not overflow) -->
                 <div class="question-container mb-6 md:mb-4 relative group md:flex-1 flex items-center justify-center w-full min-h-0" data-tour="quiz">
                      <div class="w-full bg-gradient-to-b from-blue-900 to-blue-950 border-y-2 border-yellow-500/50 p-2 md:p-8 text-center md:h-full min-h-[40vh] md:min-h-0 max-h-[60vh] md:max-h-none flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(0,0,0,0.6)] rounded-lg overflow-y-auto">
                          <div class="space-y-4 w-full">
                            <h1 class="text-xl md:text-3xl font-semibold leading-relaxed tracking-wide text-white drop-shadow-md">
                              <MathRenderer :content="currentQuestion.question_text" />
                            </h1>
                            <img
                              v-if="currentQuestion.image_url"
                              :src="resolveStorageUrl(currentQuestion.image_url)"
                              alt="Question illustration"
                              class="mx-auto max-h-64 rounded border border-blue-800/40"
                            />
                          </div>
                      </div>
                 </div>

                 <!-- Options (Compact Grid) -->
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-12 md:gap-y-6 w-full max-w-4xl mx-auto shrink-0 pb-6">
                     <button v-for="(opt, idx) in currentOptions" :key="idx" @click="selectOption(opt)"
                        :disabled="revealState !== 'waiting' || opt.hidden"
                        v-show="!opt.hidden"
                        class="relative h-14 md:h-20 flex items-center px-4 transition-all duration-300 group transform active:scale-95"
                     >
                        <div class="absolute inset-x-0 h-[1px] bg-gray-500 top-1/2 -z-10 w-full group-hover:bg-yellow-400 transition-colors"></div>
                        <div class="flex-1 flex items-center h-full border-2 rounded-full bg-black/90 relative overflow-hidden transition-colors duration-200 z-10 w-full shadow-lg"
                           :class="getBoxClass(opt)">
                           <span class="text-yellow-500 font-bold text-xl w-8 md:w-12 text-center">{{ ['A','B','C','D'][idx] }}:</span>
                           <span class="text-white text-lg font-medium truncate pr-4 text-left flex-1">{{ opt.text }}</span>
                        </div>
                     </button>
                 </div>
            </div>

            <!-- Right: Money Ladder (Desktop) -->
            <div class="hidden md:flex flex-col w-64 ml-8 justify-center shrink-0 pr-4">
                <div class="bg-blue-950/90 p-1 rounded-lg border border-blue-800 shadow-2xl backdrop-blur">
                    <div class="text-xs text-center text-gray-500 mb-2 italic">*Uang ini hanya khayalan</div>
                    <div v-for="(q, i) in questions" :key="q.id"
                         class="flex justify-between items-center px-4 py-1.5 mb-1 text-sm font-bold rounded transition-all"
                         :class="{
                            'bg-yellow-500 text-black scale-105 shadow-lg border-2 border-white': (questions.length - 1 - i) === currentQuestionIndex,
                            'text-yellow-200': (questions.length - 1 - i) > currentQuestionIndex,
                            'text-gray-500': (questions.length - 1 - i) < currentQuestionIndex,
                            'text-white': (questions.length - 1 - i) % 5 === 4
                         }">
                        <span class="w-8 text-center">{{ questions.length - i }}</span>
                        <span class="flex-1 text-right tracking-wider">Rp {{ formatCurrency((questions.length - i) * 1000000) }}</span>
                    </div>
                </div>
            </div>

        </div>
    </div>


    <!-- Mode: Classic (Netflix Consistent Theme) -->
    <div v-else class="min-h-screen bg-[#141414] py-10 px-4 text-white font-sans">
        <div class="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">

            <!-- Result Card -->
            <div v-if="result" class="w-full bg-[#181818] rounded-md shadow-2xl border border-[#333] overflow-hidden text-center p-12">
                 <div class="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-[#E50914]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                 </div>
                 <h2 class="text-3xl font-bold text-white mb-2">Quiz Completed</h2>
                 <p class="text-[#B3B3B3] mb-8">You have finished this assignment.</p>

                 <div class="text-6xl font-extrabold text-[#E50914] mb-2">{{ result.score }}%</div>
                 <div class="text-sm text-gray-500 uppercase tracking-widest mb-8">Final Score</div>

                 <button @click="$router.push('/student')" class="bg-white text-black px-8 py-3 rounded hover:bg-gray-200 transition font-bold uppercase tracking-wide">
                    Back to Dashboard
                 </button>
            </div>

            <!-- Quiz Play Area -->
            <template v-else>
                <!-- Question Navigator -->
                <div class="w-full md:w-64 shrink-0 order-2 md:order-1">
                    <div class="bg-[#181818] rounded-md shadow-lg border border-[#333] p-6 sticky top-24">
                        <h3 class="font-bold text-[#B3B3B3] mb-4 text-sm uppercase tracking-wider">Navigator</h3>
                        <div class="grid grid-cols-5 gap-2">
                             <button
                                v-for="(q, idx) in questions"
                                :key="idx"
                                @click="jumpToQuestion(idx)"
                                class="w-10 h-10 rounded-sm flex items-center justify-center text-sm font-bold transition border"
                                :class="{
                                    'bg-[#E50914] text-white border-[#E50914]': idx === classicIndex,
                                    'bg-[#404040] text-gray-300 border-[#404040]': answers[q.id] && idx !== classicIndex,
                                    'bg-[#2F2F2F] text-[#B3B3B3] border-[#2F2F2F] hover:bg-[#404040]': !answers[q.id] && idx !== classicIndex
                                }"
                             >
                                {{ idx + 1 }}
                             </button>
                        </div>

                        <div class="mt-8 pt-6 border-t border-[#333]">
                             <button v-if="allAnswered" @click="submitClassic" class="mt-2 w-full bg-[#E50914] text-white py-3 rounded font-bold hover:bg-red-700 transition uppercase tracking-wide" :disabled="submitting">
                                {{ submitting ? 'Submitting...' : 'Submit All' }}
                             </button>
                        </div>
                    </div>
                </div>

                <!-- Main Question Card -->
                <div class="flex-1 order-1 md:order-2">
                     <div class="bg-[#181818] rounded-md shadow-lg p-8 mb-8 border border-[#333] min-h-[400px] flex flex-col relative">
                         <!-- Progress Bar -->
                         <div class="absolute top-0 left-0 right-0 h-1 bg-[#2F2F2F]">
                             <div class="h-full bg-[#E50914] transition-all duration-300" :style="{ width: ((classicIndex + 1) / questions.length) * 100 + '%' }"></div>
                         </div>

                         <div class="flex justify-between items-center mb-6 mt-2">
                             <h1 class="text-xl font-bold text-white">{{ quiz.title }}</h1>
                             <span class="text-sm font-medium text-[#B3B3B3]">Question {{ classicIndex + 1 }} / {{ questions.length }}</span>
                         </div>

                         <!-- Question Text -->
                         <div class="flex-1 mb-10">
                             <div class="space-y-4">
                                <div class="text-2xl text-gray-100 leading-relaxed font-light">
                                  <MathRenderer :content="currentClassicQuestion.question_text" />
                                </div>
                                <img
                                  v-if="currentClassicQuestion.image_url"
                                  :src="resolveStorageUrl(currentClassicQuestion.image_url)"
                                  alt="Question illustration"
                                  class="max-h-64 rounded border border-[#333]"
                                />
                             </div>
                         </div>

                         <!-- Options -->
                         <div class="space-y-3">
                             <label v-for="(opt, i) in currentClassicQuestion.finalOptions" :key="i"
                                    class="flex items-center gap-4 p-4 rounded border cursor-pointer transition group"
                                    :class="answers[currentClassicQuestion.id] === opt ? 'border-[#E50914] bg-[#E50914]/20' : 'border-[#333] hover:border-[#555] bg-[#2F2F2F] hover:bg-[#363636]'"
                             >
                                 <div class="relative flex items-center">
                                    <input type="radio" :name="currentClassicQuestion.id" :value="opt" v-model="answers[currentClassicQuestion.id]" class="peer sr-only" required>
                                    <div class="w-5 h-5 border-2 border-[#666] rounded-full peer-checked:border-[#E50914] peer-checked:bg-[#E50914] transition flex items-center justify-center">
                                        <div class="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                                    </div>
                                 </div>
                                 <span class="text-gray-200 font-medium text-lg">{{ opt }}</span>
                             </label>
                         </div>

                         <!-- Navigation Buttons -->
                         <div class="flex justify-between mt-10 pt-6 border-t border-[#333]">
                             <button
                                @click="classicIndex--"
                                :disabled="classicIndex === 0"
                                class="px-6 py-2 rounded font-medium transition text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                             >
                                ← Previous
                             </button>

                             <button
                                v-if="classicIndex < questions.length - 1"
                                @click="classicIndex++"
                                class="px-8 py-2 rounded font-bold bg-white text-black hover:bg-gray-200 transition flex items-center gap-2"
                             >
                                Next
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                             </button>
                             <button
                                v-else
                                @click="submitClassic"
                                class="px-8 py-2 rounded font-bold bg-[#E50914] text-white hover:bg-red-700 transition"
                                :disabled="submitting"
                             >
                                Finish
                             </button>
                         </div>

                     </div>
                </div>
            </template>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MathRenderer from '../components/MathRenderer.vue';
import api from '../api';
import { isDemoMode, getDemoQuizById } from '../utils/demo';
import { resolveStorageUrl } from '../utils/storage';
import { useDialog } from '../utils/dialog';

const route = useRoute();
const quizId = route.params.id;
const dialog = useDialog();

// Helper: Shuffle
const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Common State
const loading = ref(true);
const quiz = ref<any>(null);
const questions = ref<any[]>([]);
const result = ref<any>(null);
const submitting = ref(false);
const quizStart = ref<number | null>(null);
const demoMode = isDemoMode();

// Classic State
const classicIndex = ref(0);
const answers = ref<Record<string, any>>({});
const currentClassicQuestion = computed(() => questions.value[classicIndex.value] || { id: '' });
const allAnswered = computed(() => {
    return questions.value.length > 0 && questions.value.every(q => q.id && answers.value[q.id]);
});

// Millionaire State
const gameState = ref('playing');
const currentQuestionIndex = ref(0);
const userAnswers = ref<any[]>([]);
const revealState = ref('waiting');
const selectedAnswer = ref<string | null>(null);
const lifelines = ref({ fiftyFifty: true, phone: true, audience: true });
const tempOptions = ref<any[]>([]);
const lifelineMessage = ref<string | null>(null);
const lifelineTitle = ref('');
const showMobileLadder = ref(false);
const showBadgeModal = ref(false);
const activeBadge = ref<any | null>(null);
const pendingBadges = ref<any[]>([]);
const confettiPieces = ref<Array<{ id: number; left: string; delay: string; duration: string; size: string; color: string; rotate: string }>>([]);

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || {});
const currentOptions = computed(() => tempOptions.value);
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1);

// Helper
const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
};

const getStudentId = () => {
    const saved = localStorage.getItem('student');
    if (!saved) return null;
    try {
        const parsed = JSON.parse(saved);
        return parsed?.id || null;
    } catch {
        return null;
    }
};

const buildConfetti = () => {
    const colors = ['#facc15', '#f97316', '#22c55e', '#38bdf8', '#a855f7', '#ef4444'];
    confettiPieces.value = Array.from({ length: 36 }, (_, idx) => {
        const size = 6 + Math.floor(Math.random() * 6);
        const left = Math.floor(Math.random() * 100);
        const delay = Math.random() * 0.4;
        const duration = 1.8 + Math.random() * 1.2;
        const rotate = `${Math.floor(Math.random() * 360)}deg`;
        const color = colors[idx % colors.length] || '#facc15';
        return {
            id: idx,
            left: `${left}%`,
            delay: `${delay}s`,
            duration: `${duration}s`,
            size: `${size}px`,
            color,
            rotate
        };
    });
};

const playApplause = () => {
    try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const burst = (time: number, gain: number) => {
            const bufferSize = ctx.sampleRate * 0.2;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
            }
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(gain, time);
            gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
            source.connect(gainNode);
            gainNode.connect(ctx.destination);
            source.start(time);
        };

        const now = ctx.currentTime;
        const pattern = [0, 0.08, 0.16, 0.32, 0.45, 0.6, 0.72];
        pattern.forEach((offset, i) => burst(now + offset, 0.3 - i * 0.03));
        setTimeout(() => ctx.close(), 1200);
    } catch (e) {
        console.error('Failed to play applause', e);
    }
};

const showNextBadge = () => {
    if (pendingBadges.value.length === 0) return;
    activeBadge.value = pendingBadges.value.shift() || null;
    buildConfetti();
    showBadgeModal.value = true;
    playApplause();
};

const closeBadgeModal = () => {
    showBadgeModal.value = false;
    activeBadge.value = null;
    if (pendingBadges.value.length > 0) {
        setTimeout(showNextBadge, 150);
    }
};

const checkNewBadges = async (studentId: string) => {
    try {
        const { data } = await api.post('/badges/check', {}, {
            headers: { 'X-Student-ID': studentId }
        });
        const newBadges = Array.isArray(data?.new_badges) ? data.new_badges : [];
        if (newBadges.length > 0) {
            pendingBadges.value = [...pendingBadges.value, ...newBadges];
            if (!showBadgeModal.value) {
                showNextBadge();
            }
        }
    } catch (e) {
        console.error('Failed to check badges', e);
    }
};

// Init
const fetchQuiz = async () => {
  try {
    if (demoMode) {
        const demoQuiz = getDemoQuizById(String(quizId));
        if (demoQuiz) {
            quiz.value = demoQuiz;
            let qList = demoQuiz.questions || [];
            if (qList.length > 0) {
                qList = shuffleArray([...qList]);
                qList.forEach((q: any) => {
                    let opts = q.options;
                    if (typeof opts === 'string') opts = JSON.parse(opts);
                    q.finalOptions = shuffleArray([...opts]);
                });
            }
            questions.value = qList;
            if (demoQuiz.style === 'millionaire' && questions.value.length > 0) {
                prepareMillionaireQuestion(0);
            }
            quizStart.value = Date.now();
        }
        loading.value = false;
        return;
    }
    const studentId = getStudentId();
    const { data } = await api.get(`/quizzes/${quizId}`, {
        headers: studentId ? { 'X-Student-ID': studentId } : undefined
    });
    quiz.value = data;
    quizStart.value = Date.now();

    // Fetch Questions
    let qList = [];
    if (data.questions) {
      qList = data.questions;
    } else {
       const qIds = await api.get(`/quizzes/${quizId}/questions`);
       qList = qIds.data;
    }

    // Process Randomization
    if (qList.length > 0) {
        // Shuffle questions
        qList = shuffleArray([...qList]);

        // Shuffle options and store as 'finalOptions' property to persist order
        qList.forEach((q: any) => {
            let opts = q.options;
            if (typeof opts === 'string') opts = JSON.parse(opts);
            q.finalOptions = shuffleArray([...opts]);
        });
    }

    questions.value = qList;

    if (data.style === 'millionaire' && qList.length > 0) {
        prepareMillionaireQuestion(0);
    }

  } catch (e) {
    console.error("Error loading quiz", e);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchQuiz);

// --- Classic Methods ---
const jumpToQuestion = (idx: number) => {
    classicIndex.value = idx;
};

const submitClassic = async () => {
    submitting.value = true;
    try {
        const formattedAnswers = Object.keys(answers.value).map(k => ({
            question_id: k,
            user_answer: answers.value[k]
        }));
        if (demoMode) {
            const correct = formattedAnswers.filter((ans) => {
                const q = questions.value.find((q) => q.id === ans.question_id);
                return q && q.correct_answer === ans.user_answer;
            }).length;
            const score = questions.value.length > 0 ? Math.round((correct / questions.value.length) * 100) : 0;
            result.value = { score, total_questions: questions.value.length, correct_answers: correct };
            return;
        }

        const studentId = getStudentId();
        if (!studentId) {
            await dialog.alert('Silakan login ulang untuk mengirim jawaban.');
            return;
        }

        const { data } = await api.post('/quizzes/submit-quiz', {
            student_id: studentId,
            quiz_id: quizId,
            answers: formattedAnswers
        });
        result.value = data;
        await logQuizActivity(studentId);
        await checkNewBadges(studentId);
    } catch (e) {
        await dialog.alert("Gagal mengirim jawaban");
    } finally {
        submitting.value = false;
    }
};

// --- Millionaire Methods ---
const prepareMillionaireQuestion = (idx: number) => {
    const q = questions.value[idx];
    if (!q) return;

    let opts = q.finalOptions || q.options; // Use shuffled
    if (typeof opts === 'string') opts = JSON.parse(opts);

    tempOptions.value = opts.map((o: string) => ({ text: o, hidden: false }));
    revealState.value = 'waiting';
    selectedAnswer.value = null;

    // Only reset lifelines on first question? No, init them once.
    if (idx === 0) {
        lifelines.value = { fiftyFifty: true, phone: true, audience: true };
    }
};

const selectOption = (opt: any) => {
    if (revealState.value !== 'waiting') return;
    selectedAnswer.value = opt.text;
    revealState.value = 'locked';

    // Immediate check
    const isCorrect = opt.text === currentQuestion.value.correct_answer;

    setTimeout(() => {
        revealState.value = 'revealed';

        setTimeout(() => {
            if (isCorrect) {
                // Correct: Save and Move Next
                userAnswers.value.push({
                    question_id: currentQuestion.value.id,
                    user_answer: opt.text
                });
                nextQuestion();
            } else {
                // Wrong: Game Over
                // We do NOT add the wrong answer to userAnswers if we want to follow strict "last obtained" logic?
                // Actually, submitting the wrong answer is fine, backend counts correct ones.
                // But generally "last obtained" implies we revert to previous state.
                // However, the score is based on Correct Count. So adding a wrong answer doesn't increase score.
                // We will add it for record.
                userAnswers.value.push({
                    question_id: currentQuestion.value.id,
                    user_answer: opt.text
                });
                submitGame();
            }
        }, 2000); // Show result for 2s before moving/ending
    }, 2000); // Lock suspense for 2s
};

const nextQuestion = () => {
    if (isLastQuestion.value) {
        submitGame();
    } else {
        currentQuestionIndex.value++;
        prepareMillionaireQuestion(currentQuestionIndex.value);
    }
};

const submitGame = async () => {
    loading.value = true;
    try {
        if (demoMode) {
            const correct = userAnswers.value.filter((ans: any) => {
                const q = questions.value.find((q) => q.id === ans.question_id);
                return q && q.correct_answer === ans.user_answer;
            }).length;
            const score = questions.value.length > 0 ? Math.round((correct / questions.value.length) * 100) : 0;
            result.value = { score, total_questions: questions.value.length, correct_answers: correct };
            gameState.value = 'result';
            return;
        }

        const studentId = getStudentId();
        if (!studentId) {
            await dialog.alert('Silakan login ulang untuk mengirim jawaban.');
            return;
        }
        const { data } = await api.post('/quizzes/submit-quiz', {
            student_id: studentId,
            quiz_id: quizId,
            answers: userAnswers.value
        });
        result.value = data;
        gameState.value = 'result';
        await logQuizActivity(studentId);
        await checkNewBadges(studentId);
    } catch (e) {
        console.error(e);
        await dialog.alert("Submission Error");
    } finally {
        loading.value = false;
    }
};

const logQuizActivity = async (studentId: string) => {
    if (!quiz.value?.material_id || !quizStart.value) return;
    const endedAt = Date.now();
    const durationSeconds = Math.round((endedAt - quizStart.value) / 1000);
    if (durationSeconds < 5) return;
    try {
        await api.post('/activity', {
            student_id: studentId,
            material_id: quiz.value.material_id,
            started_at: quizStart.value,
            ended_at: endedAt,
            duration_seconds: durationSeconds
        });
    } catch (e) {
        console.error("Failed to log quiz activity", e);
    }
};

const useLifeline = (type: string) => {
    if (revealState.value !== 'waiting') return;

    if (type === '5050' && lifelines.value.fiftyFifty) {
        const correct = currentQuestion.value.correct_answer;
        const wrongIndices: number[] = [];
        tempOptions.value.forEach((o, i) => { if (o.text !== correct) wrongIndices.push(i); });

        wrongIndices.sort(() => Math.random() - 0.5);

        // Helper to safely hide option
        const hideOption = (idx: number | undefined) => {
            if (idx !== undefined && tempOptions.value[idx]) {
                tempOptions.value[idx].hidden = true;
            }
        };

        if (wrongIndices.length >= 2) {
             hideOption(wrongIndices[0]);
             hideOption(wrongIndices[1]);
        } else if (wrongIndices.length === 1) {
             hideOption(wrongIndices[0]);
        }
        lifelines.value.fiftyFifty = false;

    } else if (type === 'phone' && lifelines.value.phone) {
        const correct = currentQuestion.value.correct_answer;
        lifelineTitle.value = "☎️ Phone A Friend";
        // 80% chance friend is right
        const friendSays = Math.random() < 0.8 ? correct : tempOptions.value.find(o => o.text !== correct)?.text;

        lifelineMessage.value = `Temanmu berbisik: \n"Aku cukup yakin jawabannya adalah... ${friendSays}"`;
        lifelines.value.phone = false;

    } else if (type === 'audience' && lifelines.value.audience) {
        const correct = currentQuestion.value.correct_answer;
        const opts = tempOptions.value.filter(o => !o.hidden);

        // Distribute 100%
        let remaining = 100;
        let stats = opts.map(o => ({ text: o.text, pct: 0 }));

        // Correct gets majority
        const correctIdx = stats.findIndex(s => s.text === correct);
        if (correctIdx !== -1 && stats[correctIdx]) {
             const val = Math.floor(Math.random() * 40) + 40; // 40-80%
             stats[correctIdx].pct = val;
             remaining -= val;
        }

        // Randomize rest
        stats.forEach((s, i) => {
             if (i !== correctIdx) {
                 const val = Math.floor(Math.random() * remaining);
                 s.pct = val;
                 remaining -= val;
             }
        });
        // Add leftovers to one random
        if (stats.length > 0) {
            const randomIdx = Math.floor(Math.random() * stats.length);
            if (stats[randomIdx]) {
                stats[randomIdx].pct += remaining;
            }
        }

        lifelineTitle.value = "👥 Ask The Audience";
        lifelineMessage.value = stats.map(s => `${s.text}: ${s.pct}%`).join('\n');
        lifelines.value.audience = false;
    }
};

const getBoxClass = (opt: any) => {
    let base = "border-gray-500 hover:border-yellow-400 group-hover:border-yellow-300";
    if (selectedAnswer.value === opt.text) {
        base = "bg-orange-600 border-yellow-200 shadow-[0_0_15px_rgba(255,165,0,0.6)]";
        if (revealState.value === 'revealed') {
             if (opt.text === currentQuestion.value.correct_answer) {
                 base = "bg-green-600 border-white shadow-[0_0_20px_rgba(0,255,0,0.8)] animate-pulse";
             } else {
                 base = "bg-red-600 border-red-300";
             }
        }
    } else if (revealState.value === 'revealed' && opt.text === currentQuestion.value.correct_answer) {
         base = "bg-green-700 border-white shadow-[0_0_10px_rgba(0,255,0,0.5)]";
    }
    return base;
};
</script>

<style scoped>
.millionaire-app {
    /* Scoped styles mainly for Millionaire mode */
}

.confetti-layer {
    position: absolute;
    inset: 0;
    overflow: hidden;
}

.confetti-piece {
    position: absolute;
    top: -12px;
    border-radius: 2px;
    opacity: 0.9;
    animation-name: confetti-fall;
    animation-timing-function: ease-out;
    animation-iteration-count: 1;
}

@keyframes confetti-fall {
    0% {
        transform: translateY(-10px) rotate(var(--rotate-angle));
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    100% {
        transform: translateY(110vh) rotate(calc(var(--rotate-angle) + 360deg));
        opacity: 0;
    }
}
</style>
