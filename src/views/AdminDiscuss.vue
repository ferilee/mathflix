<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Moderasi Diskusi</h1>

    <!-- Create Post (As Teacher) -->
    <div class="bg-white p-6 rounded shadow mb-8">
       <h2 class="font-bold mb-4">Buat Pengumuman / Diskusi Baru</h2>
       <textarea 
         v-model="newPostContent"
         class="w-full border p-3 rounded mb-2"
         rows="3"
         placeholder="Tulis sesuatu sebagai Guru..."
       ></textarea>
       <div class="flex justify-end">
           <button @click="createPost" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Posting</button>
       </div>
    </div>

    <!-- Feed -->
    <div class="space-y-6">
       <div v-for="post in posts" :key="post.id" class="bg-white p-6 rounded shadow border" :class="{'border-l-4 border-l-indigo-600': post.author_role !== 'student'}">
           <div class="flex justify-between items-start mb-4">
               <div>
                   <h3 class="font-bold text-lg">
                       {{ post.author_name }} 
                       <span class="text-xs bg-gray-200 px-2 py-1 rounded ml-2">{{ post.author_role }}</span>
                   </h3>
                   <span class="text-xs text-gray-400">{{ new Date(post.created_at).toLocaleString() }}</span>
               </div>
               <div class="flex gap-2">
                   <button 
                     @click="toggleLock(post)" 
                     class="text-xs px-3 py-1 rounded border"
                     :class="post.is_locked ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-gray-100 text-gray-600'"
                   >
                     {{ post.is_locked ? 'Unlock' : 'Lock' }}
                   </button>
                   <button @click="deletePost(post.id)" class="text-xs px-3 py-1 rounded bg-red-100 text-red-600 border border-red-200 hover:bg-red-200">
                       Hapus
                   </button>
               </div>
           </div>

           <p class="text-gray-800 mb-4 whitespace-pre-line">{{ post.content }}</p>

           <!-- Comments -->
           <div class="bg-gray-50 p-4 rounded text-sm relative">
               <h4 class="font-bold mb-2 text-gray-500 text-xs uppercase tracking-wider">Komentar</h4>
               <div v-for="comment in post.comments" :key="comment.id" class="mb-3 border-b pb-2 last:border-0 hover:bg-gray-100 p-2 rounded group">
                  <div class="flex justify-between items-start">
                      <div>
                          <span class="font-bold">{{ comment.author_name }}</span>: {{ comment.content }}
                          <div class="text-[10px] text-gray-400">{{ new Date(comment.created_at).toLocaleString() }}</div>
                      </div>
                      <button @click="deleteComment(comment.id)" class="text-red-500 opacity-0 group-hover:opacity-100 text-xs">✕</button>
                  </div>
               </div>

               <!-- Reply as Admin -->
               <div class="flex gap-2 mt-4">
                   <input v-model="post.newComment" placeholder="Balas sebagai Guru..." class="flex-1 border p-2 rounded">
                   <button @click="createComment(post)" class="bg-indigo-600 text-white px-4 py-2 rounded text-xs">Kirim</button>
               </div>
           </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';

const posts = ref<any[]>([]);
const newPostContent = ref('');

const timer = ref<any>(null);

const loadPosts = async () => {
    try {
        const { data } = await api.get('/discussions');
        // Preserve input states
        const newPosts = data.map((p: any) => {
            const existing = posts.value.find(ep => ep.id === p.id);
            return { 
                ...p, 
                newComment: existing ? existing.newComment : '' 
            };
        });
        posts.value = newPosts;
    } catch (e) {
        console.error(e);
    }
};

const createPost = async () => {
    if (!newPostContent.value.trim()) return;
    const { data } = await api.post('/discussions', {
        content: newPostContent.value,
        author_id: 'admin',
        author_name: 'Feri Dwi Hermawan', 
        author_role: 'guru'
    });
    // Optimistic
    posts.value.unshift({ ...data, comments: [], newComment: '' });
    newPostContent.value = '';
};

const createComment = async (post: any) => {
    if (!post.newComment.trim()) return;
    const { data } = await api.post(`/discussions/${post.id}/comments`, {
        content: post.newComment,
        author_id: 'admin',
        author_name: 'Feri Dwi Hermawan',
        author_role: 'guru'
    });
    // Optimistic
    if (!post.comments) post.comments = [];
    post.comments.push(data);
    post.newComment = '';
};

const toggleLock = async (post: any) => {
    // Optimistic
    post.is_locked = !post.is_locked;
    await api.patch(`/discussions/${post.id}/lock`, {
        is_locked: post.is_locked
    });
    // Background refresh optional, but nice to have
};

const deletePost = async (id: string) => {
    if(!confirm('Hapus diskusi ini?')) return;
    // Optimistic
    posts.value = posts.value.filter(p => p.id !== id);
    await api.delete(`/discussions/${id}`);
};

const deleteComment = async (id: string) => {
    if(!confirm('Hapus komentar?')) return;
    // Hard to do optimistic without parent post ID or deep search, so just reload for delete
    // OR we could scan
    await api.delete(`/discussions/comments/${id}`);
    loadPosts();
};

import { onUnmounted } from 'vue';

onMounted(() => {
    loadPosts();
    timer.value = setInterval(loadPosts, 5000);
});

onUnmounted(() => {
    if (timer.value) clearInterval(timer.value);
});
</script>
