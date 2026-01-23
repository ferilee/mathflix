<template>
  <div v-if="active" class="fixed inset-0 z-[200]">
    <div class="absolute inset-0 bg-black/60" @click="skip"></div>
    <div
      class="absolute max-w-xs bg-white text-gray-900 rounded-lg shadow-xl p-4 border border-gray-200"
      :style="{ top: `${position.top}px`, left: `${position.left}px` }"
    >
      <div class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Demo Tour</div>
      <div class="text-lg font-bold mb-1">{{ step.title }}</div>
      <div class="text-sm text-gray-600 mb-3">{{ step.body }}</div>
      <div class="flex justify-between items-center text-xs">
        <button @click="skip" class="text-gray-500 hover:text-gray-700">Skip</button>
        <div class="flex items-center gap-2">
          <span class="text-gray-400">{{ currentIndex + 1 }}/{{ steps.length }}</span>
          <button
            @click="next"
            class="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
          >
            {{ currentIndex === steps.length - 1 ? 'Finish' : 'Next' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { isDemoMode } from "../utils/demo";

const router = useRouter();
const route = useRoute();
const TOUR_KEY = "demo_tour_done";

type TourStep = {
  route: string;
  selector: string;
  title: string;
  body: string;
};

const steps: TourStep[] = [
  {
    route: "/student",
    selector: '[data-tour="hero"]',
    title: "Dashboard",
    body: "Ini beranda utama. Di sini kamu lihat ringkasan materi unggulan.",
  },
  {
    route: "/student",
    selector: '[data-tour="materials"]',
    title: "Materi Populer",
    body: "Gulir kartu materi untuk mulai belajar.",
  },
  {
    route: "/student",
    selector: '[data-tour="recommendations"]',
    title: "Rekomendasi",
    body: "Sistem akan merekomendasikan materi sesuai progres.",
  },
  {
    route: "/student",
    selector: '[data-tour="quizzes"]',
    title: "Kuis",
    body: "Kerjakan kuis untuk menguji pemahaman.",
  },
];

const currentIndex = ref(0);
const active = ref(false);
const position = ref({ top: 80, left: 20 });

const step = computed<TourStep>(() => steps[currentIndex.value] ?? steps[0]!);

const computePosition = () => {
  const currentStep = step.value;
  if (!currentStep) {
    position.value = { top: 80, left: 20 };
    return;
  }
  const target = document.querySelector(currentStep.selector) as HTMLElement | null;
  if (!target) {
    position.value = { top: 80, left: 20 };
    return;
  }
  const rect = target.getBoundingClientRect();
  const top = Math.min(window.innerHeight - 240, Math.max(20, rect.top + window.scrollY - 10));
  const left = Math.min(window.innerWidth - 320, Math.max(20, rect.left + window.scrollX));
  position.value = { top, left };
};

const goToStep = async (index: number) => {
  if (index < 0 || index >= steps.length) return;
  const targetStep = steps[index] ?? steps[0];
  if (!targetStep) return;
  if (route.path !== targetStep.route) {
    await router.push(targetStep.route);
  }
  currentIndex.value = index;
  await nextTick();
  setTimeout(() => {
    const currentStep = step.value;
    if (!currentStep) {
      finish();
      return;
    }
    const target = document.querySelector(currentStep.selector);
    if (!target) {
      if (currentIndex.value < steps.length - 1) {
        next();
      } else {
        finish();
      }
      return;
    }
    computePosition();
  }, 50);
};

const next = async () => {
  if (currentIndex.value === steps.length - 1) {
    finish();
    return;
  }
  await goToStep(currentIndex.value + 1);
};

const finish = () => {
  localStorage.setItem(TOUR_KEY, "true");
  active.value = false;
};

const skip = () => {
  localStorage.setItem(TOUR_KEY, "true");
  active.value = false;
};

const start = async () => {
  active.value = true;
  if (route.path !== "/student") {
    await router.push("/student");
  }
  await goToStep(0);
};

watch(
  () => route.path,
  async () => {
    if (!active.value) return;
    await nextTick();
    setTimeout(computePosition, 50);
  }
);

onMounted(() => {
  if (!isDemoMode()) return;
  if (localStorage.getItem(TOUR_KEY) === "true") return;
  start();
  window.addEventListener("resize", computePosition);
  window.addEventListener("scroll", computePosition, true);
});

onUnmounted(() => {
  window.removeEventListener("resize", computePosition);
  window.removeEventListener("scroll", computePosition, true);
});
</script>
