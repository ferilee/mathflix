<template>
  <div class="min-h-screen bg-black flex items-center justify-center">
    <div class="text-center animate-pulse">
      <h1 class="text-4xl font-black text-red-600 mb-4 tracking-tighter">MATHFLIX</h1>
      <p class="text-gray-500">Redirecting to login...</p>
    </div>
    
    <!-- Using the Modal directly here for full-page experience on this route -->
    <LoginModal :is-open="true" @close="handleClose" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import LoginModal from '../components/LoginModal.vue';

const router = useRouter();

const handleClose = () => {
  router.push('/student');
};
</script>
