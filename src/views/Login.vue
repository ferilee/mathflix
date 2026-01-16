<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-red-600 tracking-wider">MATHFLIX</h1>
        <p class="text-gray-400 mt-2">Masuk untuk mulai belajar</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
           <label class="block text-sm font-medium text-gray-400 mb-2">NISN</label>
           <input 
             v-model="nisn" 
             type="text" 
             class="w-full bg-gray-700 border border-gray-600 rounded p-3 text-white focus:border-red-500 focus:outline-none placeholder-gray-500"
             placeholder="Masukkan NISN Anda (ex: 12345)"
             required
           />
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 transition transform hover:scale-105"
        >
          {{ loading ? 'Memeriksa...' : 'Masuk' }}
        </button>

        <div v-if="error" class="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded text-sm text-center">
            {{ error }}
        </div>
      </form>
      
      <div class="mt-6 text-center text-sm text-gray-500">
         Belum punya NISN? Hubungi Guru Admin.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../api';

const nisn = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();
const route = useRoute();

const handleLogin = async () => {
    loading.value = true;
    error.value = '';
    
    try {
        // Simple Auth: Check if student exists by fetching all and finding NISN
        // (In production, use a real POST /login endpoint)
        const { data } = await api.get('/students');
        const student = data.find((s: any) => s.nisn === nisn.value);

        if (student) {
            localStorage.setItem('student', JSON.stringify(student));
            
            // Redirect to intended page or dashboard
            const redirect = route.query.redirect as string || '/student';
            router.push(redirect);
        } else {
            error.value = 'NISN tidak ditemukan.';
        }
    } catch (e) {
        error.value = 'Terjadi kesalahan koneksi.';
        console.error(e);
    } finally {
        loading.value = false;
    }
};
</script>
