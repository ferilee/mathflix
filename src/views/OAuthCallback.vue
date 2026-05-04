<template>
  <div class="min-h-screen bg-black flex items-center justify-center text-white">
    <div class="animate-pulse font-bold text-xl">Memproses Login...</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { setAuthToken, setStaffUser } from '../utils/auth';

const router = useRouter();
const route = useRoute();

onMounted(() => {
  const token = route.query.token as string;
  const userStr = route.query.user as string;

  if (token && userStr) {
    try {
      const user = JSON.parse(decodeURIComponent(userStr));
      
      // Redirect sesuai Role yang ditentukan Backend
      if (user.role === 'admin' || user.role === 'guru') {
        setStaffUser(user, token);
        router.push('/admin/dashboard');
      } else {
        localStorage.setItem('student', JSON.stringify(user));
        setAuthToken(token);
        router.push('/');
      }
    } catch (e) {
      alert('Format data user tidak valid');
      router.push('/login');
    }
  } else {
    // Tangani error
    alert('Login dengan Google Gagal atau data tidak lengkap');
    router.push('/login');
  }
});
</script>
