<template>
  <div class="px-4 md:px-12 py-8 max-w-4xl mx-auto min-h-screen text-white">
     <h1 class="text-3xl font-bold mb-8">Diskusi Kelas</h1>

     <!-- Create Post -->
     <div class="bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border border-gray-700">
        <textarea 
            v-model="newPostContent"
            placeholder="Apa yang ingin kamu diskusikan hari ini?"
            class="w-full bg-gray-900 text-white rounded p-3 mb-3 border border-gray-600 focus:border-red-600 focus:outline-none"
            rows="3"
        ></textarea>
        <div class="flex justify-end">
             <button 
                @click="createPost" 
                :disabled="!newPostContent.trim()" 
                class="bg-red-600 px-6 py-2 rounded-full font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
             >
                Posting
             </button>
        </div>
     </div>

     <!-- Feed -->
     <div class="space-y-6">
        <div v-if="loading" class="text-center py-8">Memuat diskusi...</div>
        
        <div 
          v-for="post in posts" 
          :key="post.id" 
          class="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
        >
           <!-- Post Header -->
           <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg">
                      {{ post.author_name.charAt(0) }}
                  </div>
                  <div>
                      <div class="font-bold flex items-center gap-2">
                          {{ post.author_name }}
                          <span v-if="post.author_role !== 'student'" class="bg-blue-600 text-[10px] px-2 py-0.5 rounded uppercase">Guru</span>
                      </div>
                      <div class="text-xs text-gray-400">{{ new Date(post.created_at).toLocaleString() }}</div>
                  </div>
              </div>
              <div v-if="post.is_locked" class="text-yellow-500 text-xs flex items-center gap-1 border border-yellow-500 px-2 py-1 rounded">
                 🔒 Terkunci
              </div>
           </div>

           <!-- Post Content -->
           <p class="text-gray-200 mb-6 whitespace-pre-line text-lg leading-relaxed">{{ post.content }}</p>

           <!-- Comments Section -->
           <div class="border-t border-gray-700 pt-4">
               <button 
                 @click="post.showComments = !post.showComments"
                 class="text-sm text-gray-400 hover:text-white flex items-center gap-2 mb-4"
               >
                 <span>{{ post.showComments ? '▼ Sembunyikan' : '▶ Lihat' }} {{ post.comments.length }} Komentar</span>
               </button>

               <div v-if="post.showComments" class="space-y-4 mb-4 transition-all">
                   <div v-for="comment in post.comments" :key="comment.id" class="flex gap-3">
                        <div class="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                            {{ comment.author_name.charAt(0) }}
                        </div>
                        <div class="bg-gray-700 rounded-lg p-3 flex-1">
                            <div class="flex justify-between items-center mb-1">
                                <span class="font-bold text-sm">
                                    {{ comment.author_name }}
                                    <span v-if="comment.author_role !== 'student'" class="text-blue-400 ml-1 text-xs">(Guru)</span>
                                </span>
                                <span class="text-[10px] text-gray-400">{{ new Date(comment.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
                            </div>
                            <p class="text-sm text-gray-300">{{ comment.content }}</p>
                        </div>
                   </div>
               </div>

               <!-- Comment Input (Always visible or only when open? Open is better UX usually, or separate. Let's keep input always visible for quick reply) -->
               <div v-if="!post.is_locked" class="flex gap-2">
                   <input 
                     v-model="post.newComment" 
                     placeholder="Tulis komentar..." 
                     class="flex-1 bg-gray-900 border border-gray-600 rounded-full px-4 py-2 text-sm focus:border-red-600 focus:outline-none"
                     @keyup.enter="createComment(post)"
                     @focus="post.showComments = true" 
                   >
                   <button 
                     @click="createComment(post)" 
                     class="bg-gray-700 p-2 rounded-full hover:bg-gray-600"
                   >
                     🚀
                   </button>
               </div>
               <div v-else class="text-center text-xs text-gray-500 py-2">
                   Komentar dinonaktifkan untuk postingan ini.
               </div>
           </div>
        </div>

        <div v-if="!loading && posts.length === 0" class="text-center text-gray-500 py-12">
            Belum ada diskusi. Jadilah yang pertama memposting!
        </div>
     </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';

const posts = ref<any[]>([]);
const newPostContent = ref('');
const loading = ref(true);
const student = ref<any>(null);

const timer = ref<any>(null);

const loadPosts = async () => {
    try {
        const { data } = await api.get('/discussions');
        // Merge data to preserve input states if possible, or just replace
        // Simple replace is safesty for now, input state is local to post object, wait...
        // If we replace posts, we lose 'newComment' inputs. 
        // Better strategy: Update existing or append new.
        // For simplicity in this iteration: Replace but try to preserve inputs? 
        // Actually, let's just replace. The "newComment" is on the post object. 
        // If user is typing, it might get wiped. 
        // Let's only update if we are not typing? Or better: map properly.
        
        const newPosts = data.map((p: any) => {
            const existing = posts.value.find(ep => ep.id === p.id);
            return { 
                ...p, 
                newComment: existing ? existing.newComment : '',
                showComments: existing ? existing.showComments : false
            };
        });
        posts.value = newPosts;
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
};

const createPost = async () => {
    if (!newPostContent.value.trim()) return;
    try {
        const { data } = await api.post('/discussions', {
            content: newPostContent.value,
            author_id: student.value.id || 'unknown',
            author_name: student.value.full_name || 'Siswa',
            author_role: 'student'
        });
        // Optimistic / Immediate update
        posts.value.unshift({ ...data, comments: [], newComment: '', showComments: true });
        newPostContent.value = '';
        // No need to reload immediately
    } catch (e) {
        alert('Gagal membuat postingan');
    }
};

const createComment = async (post: any) => {
    if (!post.newComment.trim()) return;
    try {
        const { data } = await api.post(`/discussions/${post.id}/comments`, {
            content: post.newComment,
            author_id: student.value.id || 'unknown',
            author_name: student.value.full_name || 'Siswa',
            author_role: 'student'
        });
        
        // Optimistic update
        if (!post.comments) post.comments = [];
        post.comments.push(data);
        post.newComment = '';
        post.showComments = true;
        
    } catch (e: any) {
        if (e.response && e.response.status === 403) {
             alert('Postingan ini terkunci.');
        } else {
             alert('Gagal mengirim komentar');
        }
    }
};

onMounted(() => {
    const s = localStorage.getItem('student');
    if (s) student.value = JSON.parse(s);
    loadPosts();
    // Auto refresh every 5s
    timer.value = setInterval(loadPosts, 5000);
});

import { onUnmounted } from 'vue';
onUnmounted(() => {
    if (timer.value) clearInterval(timer.value);
});
</script>
