<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Moderasi Diskusi</h1>

    <!-- Create Post (As Teacher) -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6 transition-colors">
       <h2 class="font-bold mb-4">Buat Pengumuman / Diskusi Baru</h2>
       <textarea
         v-model="newPostContent"
         class="w-full border p-3 rounded mb-2 dark:bg-slate-700 dark:text-white dark:border-slate-600"
         rows="3"
         placeholder="Tulis sesuatu sebagai Guru..."
       ></textarea>
       <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
           <div>
               <label class="text-xs text-gray-500 dark:text-gray-400">Kategori</label>
               <select v-model="newPostCategory" class="w-full border rounded px-3 py-2 text-sm dark:bg-slate-700 dark:text-white dark:border-slate-600">
                   <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
               </select>
           </div>
           <div class="md:col-span-2">
               <label class="text-xs text-gray-500 dark:text-gray-400">Tag (pisahkan dengan koma)</label>
               <input v-model="newPostTags" class="w-full border rounded px-3 py-2 text-sm dark:bg-slate-700 dark:text-white dark:border-slate-600" placeholder="misal: aljabar, remedial">
           </div>
       </div>
       <div class="flex justify-end">
           <button @click="createPost" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Posting</button>
       </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mt-6 transition-colors">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">Filter Kategori</label>
                <select v-model="filterCategory" class="w-full border rounded px-3 py-2 text-sm dark:bg-slate-700 dark:text-white dark:border-slate-600">
                    <option value="Semua">Semua</option>
                    <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
            </div>
            <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">Filter Tag</label>
                <input v-model="filterTag" class="w-full border rounded px-3 py-2 text-sm dark:bg-slate-700 dark:text-white dark:border-slate-600" placeholder="contoh: kuis">
            </div>
            <div class="flex items-end">
                <button @click="resetFilters" class="w-full bg-slate-100 dark:bg-slate-700 dark:text-white px-3 py-2 rounded">Reset Filter</button>
            </div>
        </div>
    </div>

    <!-- Feed -->
    <div class="space-y-6 mt-6">
       <div v-for="post in filteredPosts" :key="post.id" class="bg-white dark:bg-slate-800 p-6 rounded shadow border dark:border-slate-700 transition-colors" :class="{'border-l-4 border-l-indigo-600': post.author_role !== 'student'}">
           <div class="flex justify-between items-start mb-4">
               <div>
                   <h3 class="font-bold text-lg text-gray-800 dark:text-white">
                       {{ post.author_name }}
                       <span class="text-xs bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded ml-2">{{ post.author_role }}</span>
                       <span class="text-xs bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded ml-2">{{ post.category || 'Umum' }}</span>
                       <span v-if="post.solved_comment_id" class="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded ml-2">Solved</span>
                       <span v-if="post.has_unread" class="text-xs bg-yellow-300 text-black px-2 py-1 rounded ml-2">Baru</span>
                   </h3>
                   <span class="text-xs text-gray-400">{{ new Date(post.created_at).toLocaleString() }}</span>
               </div>
               <div class="flex gap-2">
                   <button
                     @click="toggleLock(post)"
                     class="text-xs px-3 py-1 rounded border"
                     :class="post.is_locked ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600'"
                   >
                     {{ post.is_locked ? 'Unlock' : 'Lock' }}
                   </button>
                   <button @click="deletePost(post.id)" class="text-xs px-3 py-1 rounded bg-red-100 text-red-600 border border-red-200 hover:bg-red-200 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
                       Hapus
                   </button>
               </div>
           </div>

           <p class="text-gray-800 dark:text-gray-200 mb-3 whitespace-pre-line">
              <span v-for="(part, idx) in splitMentions(post.content)" :key="idx" :class="part.isMention ? 'text-indigo-600 dark:text-yellow-300 font-semibold' : ''">
                  {{ part.text }}
              </span>
           </p>

           <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-2 mb-4">
              <span v-for="tag in post.tags" :key="tag" class="text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-2 py-1 rounded">#{{ tag }}</span>
           </div>

           <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
              <button @click="toggleLike(post)" class="flex items-center gap-2 hover:text-gray-800 dark:hover:text-white">
                  <span>{{ post.liked_by_me ? '👍' : '🤍' }}</span>
                  <span>{{ post.likes_count || 0 }}</span>
              </button>
              <span>{{ post.comments.length }} Komentar</span>
           </div>

           <!-- Comments -->
           <div class="bg-gray-50 dark:bg-slate-900 p-4 rounded text-sm relative transition-colors">
               <h4 class="font-bold mb-2 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Komentar</h4>
               <div v-for="comment in post.comments" :key="comment.id" class="mb-3 border-b dark:border-gray-700 pb-2 last:border-0 hover:bg-gray-100 dark:hover:bg-slate-800 p-2 rounded group transition-colors">
                  <div class="flex justify-between items-start">
                      <div class="dark:text-gray-300">
                          <span class="font-bold text-gray-900 dark:text-white">{{ comment.author_name }}</span>:
                          <span>
                            <span v-for="(part, idx) in splitMentions(comment.content)" :key="idx" :class="part.isMention ? 'text-indigo-600 dark:text-yellow-300 font-semibold' : ''">
                                {{ part.text }}
                            </span>
                          </span>
                          <div class="text-[10px] text-gray-400">{{ new Date(comment.created_at).toLocaleString() }}</div>
                          <div v-if="comment.id === post.solved_comment_id" class="text-[10px] text-emerald-600 dark:text-emerald-300 uppercase mt-1">Jawaban Terbaik</div>
                      </div>
                      <div class="flex items-center gap-2">
                          <button @click="toggleSolved(post, comment)" class="text-xs px-2 py-1 rounded border dark:border-slate-700">
                              {{ comment.id === post.solved_comment_id ? 'Batalkan' : 'Tandai Jawaban' }}
                          </button>
                          <button @click="deleteComment(comment.id)" class="text-red-500 opacity-0 group-hover:opacity-100 text-xs">✕</button>
                      </div>
                  </div>
               </div>

               <!-- Reply as Admin -->
               <div class="flex gap-2 mt-4">
                   <input v-model="post.newComment" placeholder="Balas sebagai Guru..." class="flex-1 border p-2 rounded dark:bg-slate-700 dark:text-white dark:border-slate-600">
                   <button @click="createComment(post)" class="bg-indigo-600 text-white px-4 py-2 rounded text-xs hover:bg-indigo-700">Kirim</button>
               </div>
           </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import api from '../api';

const posts = ref<any[]>([]);
const newPostContent = ref('');
const newPostCategory = ref('Umum');
const newPostTags = ref('');
const filterCategory = ref('Semua');
const filterTag = ref('');

const timer = ref<any>(null);
const adminUserId = 'admin';
const categories = ['Umum', 'Materi', 'Tugas', 'Kuis'];

const filteredPosts = computed(() => {
    const tagFilter = filterTag.value.trim().toLowerCase();
    return posts.value.filter((post) => {
        const category = post.category || 'Umum';
        if (filterCategory.value !== 'Semua' && category !== filterCategory.value) return false;
        if (!tagFilter) return true;
        return (post.tags || []).some((tag: string) => tag.toLowerCase().includes(tagFilter));
    });
});

const splitMentions = (text: string) => {
    const content = text || '';
    const regex = /(@[A-Za-z0-9_.-]+)/g;
    const parts: Array<{ text: string; isMention: boolean }> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ text: content.slice(lastIndex, match.index), isMention: false });
        }
        parts.push({ text: match[0], isMention: true });
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) {
        parts.push({ text: content.slice(lastIndex), isMention: false });
    }
    return parts.length ? parts : [{ text: content, isMention: false }];
};

const parseTags = (raw: string) => {
    return raw
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 8);
};

const resetFilters = () => {
    filterCategory.value = 'Semua';
    filterTag.value = '';
};

const loadPosts = async () => {
    try {
        const { data } = await api.get('/discussions', { params: { user_id: adminUserId } });
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
        author_role: 'guru',
        category: newPostCategory.value,
        tags: parseTags(newPostTags.value)
    });
    // Optimistic
    posts.value.unshift({ ...data, comments: [], newComment: '' });
    newPostContent.value = '';
    newPostTags.value = '';
    newPostCategory.value = 'Umum';
};

const toggleLike = async (post: any) => {
    try {
        const { data } = await api.post(`/discussions/${post.id}/like`, { user_id: adminUserId });
        const delta = data.liked ? 1 : -1;
        post.liked_by_me = data.liked;
        post.likes_count = Math.max(0, (post.likes_count || 0) + delta);
    } catch (e) {
        // ignore
    }
};

const toggleSolved = async (post: any, comment: any) => {
    try {
        const nextId = post.solved_comment_id === comment.id ? null : comment.id;
        await api.patch(`/discussions/${post.id}/solved`, { solved_comment_id: nextId });
        post.solved_comment_id = nextId;
    } catch (e) {
        // ignore
    }
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

onMounted(() => {
    loadPosts();
    timer.value = setInterval(loadPosts, 5000);
});

onUnmounted(() => {
    if (timer.value) clearInterval(timer.value);
});
</script>
