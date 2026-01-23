<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Kelola Pengumuman</h1>

    <!-- Create Form -->
    <div class="bg-white dark:bg-slate-800 p-6 rounded shadow mb-8 transition-colors">
      <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Buat Pengumuman Baru</h2>
      <form @submit.prevent="createAnnouncement" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Judul</label>
          <input
            v-model="form.title"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 dark:bg-slate-700 dark:text-white dark:border-slate-600"
          >
        </div>
        <div>
           <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Isi Pengumuman</label>
           <textarea
             v-model="form.content"
             rows="3"
             required
             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 dark:bg-slate-700 dark:text-white dark:border-slate-600"
           ></textarea>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center gap-3">
            <input id="pin" type="checkbox" v-model="form.is_pinned" class="rounded border-gray-300">
            <label for="pin" class="text-sm text-gray-700 dark:text-gray-300">Pin pengumuman</label>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Label Prioritas</label>
            <select v-model="form.priority" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 dark:bg-slate-700 dark:text-white dark:border-slate-600">
              <option value="normal">Normal</option>
              <option value="important">Penting</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>
        </div>

        <div class="bg-slate-50 dark:bg-slate-900/40 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-3 mb-3">
            <input id="target_all" type="checkbox" v-model="form.target_all" class="rounded border-gray-300">
            <label for="target_all" class="text-sm text-gray-700 dark:text-gray-300">Kirim ke semua siswa</label>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4" :class="form.target_all ? 'opacity-50 pointer-events-none' : ''">
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400">Grade</label>
              <div class="mt-2 flex flex-wrap gap-2">
                <label v-for="grade in grades" :key="grade" class="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded">
                  <input type="checkbox" class="mr-1" :value="grade" v-model="form.target_grades">
                  {{ grade }}
                </label>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400">Jurusan</label>
              <div class="mt-2 flex flex-wrap gap-2">
                <label v-for="major in majors" :key="major" class="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded">
                  <input type="checkbox" class="mr-1" :value="major" v-model="form.target_majors">
                  {{ major }}
                </label>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400">Kelas</label>
              <div class="mt-2 flex flex-wrap gap-2">
                <label v-for="cohort in cohorts" :key="cohort.id" class="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded">
                  <input type="checkbox" class="mr-1" :value="cohort.id" v-model="form.target_cohorts">
                  {{ cohort.name }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-slate-50 dark:bg-slate-900/40 rounded-lg p-4 border border-slate-200 dark:border-slate-700 space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Lampiran (image/pdf/file)</label>
            <input type="file" multiple @change="handleFileUpload" class="mt-2 block w-full text-sm">
          </div>
          <div class="flex flex-col md:flex-row gap-2">
            <input v-model="linkLabel" class="flex-1 rounded-md border-gray-300 shadow-sm border p-2 dark:bg-slate-700 dark:text-white dark:border-slate-600" placeholder="Label link (opsional)">
            <input v-model="linkUrl" class="flex-[2] rounded-md border-gray-300 shadow-sm border p-2 dark:bg-slate-700 dark:text-white dark:border-slate-600" placeholder="https://...">
            <button type="button" @click="addLink" class="bg-slate-800 text-white px-4 py-2 rounded">Tambah Link</button>
          </div>
          <div v-if="form.attachments.length" class="space-y-2">
            <div v-for="(att, idx) in form.attachments" :key="idx" class="flex items-center justify-between text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-2">
              <div class="flex items-center gap-2">
                <span v-if="att.type === 'image'">🖼️</span>
                <span v-else-if="att.type === 'pdf'">📄</span>
                <span v-else-if="att.type === 'link'">🔗</span>
                <span v-else>📎</span>
                <span>{{ att.name || att.url }}</span>
              </div>
              <button type="button" @click="removeAttachment(idx)" class="text-red-500">Hapus</button>
            </div>
          </div>
        </div>
        <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Publish</button>
      </form>
    </div>

    <!-- List -->
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-6 transition-colors overflow-hidden">
       <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
         <thead class="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Judul</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Isi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Target</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dibaca</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tanggal</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
            </tr>
         </thead>
         <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
            <template v-for="item in announcements" :key="item.id">
            <tr>
               <td class="px-6 py-4 whitespace-nowrap font-medium">
                 <div class="flex items-center gap-2">
                   <span>{{ item.title }}</span>
                   <span v-if="item.is_pinned" class="text-[10px] px-2 py-0.5 rounded bg-yellow-200 text-yellow-800">PIN</span>
                   <span v-if="item.priority && item.priority !== 'normal'" class="text-[10px] px-2 py-0.5 rounded" :class="priorityClass(item.priority)">
                     {{ item.priority === 'important' ? 'Penting' : 'Deadline' }}
                   </span>
                 </div>
               </td>
               <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                 <div class="truncate">{{ item.content }}</div>
                 <div v-if="item.attachments && item.attachments.length" class="text-[10px] text-gray-400 mt-2">
                   {{ item.attachments.length }} lampiran
                 </div>
               </td>
               <td class="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                 <div v-if="item.target_all" class="font-semibold">Semua siswa</div>
                 <div v-else class="space-y-1">
                   <div v-if="item.target_grades?.length">Grade: {{ item.target_grades.join(', ') }}</div>
                   <div v-if="item.target_majors?.length">Jurusan: {{ item.target_majors.join(', ') }}</div>
                   <div v-if="item.target_cohorts?.length">Kelas: {{ resolveCohortNames(item.target_cohorts).join(', ') }}</div>
                 </div>
               </td>
               <td class="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                 <div v-if="item.read_stats">
                   {{ item.read_stats.read_count }} / {{ item.read_stats.eligible_count }} ({{ item.read_stats.read_percent }}%)
                   <button @click="toggleReaders(item)" class="block text-indigo-500 mt-1">Detail</button>
                 </div>
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ new Date(item.created_at).toLocaleDateString() }}
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="deleteAnnouncement(item.id)" class="text-red-600 hover:text-red-900 dark:hover:text-red-400">Hapus</button>
               </td>
            </tr>
            <tr v-if="activeReadersId === item.id" class="bg-slate-50 dark:bg-slate-900/40">
               <td colspan="6" class="px-6 py-4">
                 <div class="text-xs text-gray-500 dark:text-gray-400 mb-2">Status baca siswa</div>
                 <div class="max-h-64 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded">
                   <div v-if="readersLoading" class="p-4 text-xs text-gray-500">Memuat...</div>
                   <div v-else>
                     <div v-for="reader in readers" :key="reader.student_id" class="flex items-center justify-between p-2 border-b border-slate-200 dark:border-slate-700 text-xs">
                       <div>
                         <div class="font-semibold text-gray-700 dark:text-gray-200">{{ reader.full_name }} ({{ reader.nisn }})</div>
                         <div class="text-[10px] text-gray-400">{{ reader.major }} · Grade {{ reader.grade_level }}</div>
                       </div>
                       <div :class="reader.has_read ? 'text-emerald-600' : 'text-gray-500'">
                         {{ reader.has_read ? 'Dibaca' : 'Belum' }}
                       </div>
                     </div>
                   </div>
                 </div>
               </td>
            </tr>
            </template>
            <tr v-if="announcements.length === 0">
               <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Belum ada pengumuman</td>
            </tr>
         </tbody>
       </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';

const announcements = ref<any[]>([]);
const form = ref({
  title: '',
  content: '',
  target_all: true,
  target_grades: [] as number[],
  target_majors: [] as string[],
  target_cohorts: [] as string[],
  attachments: [] as Array<{ type: string; url: string; name?: string; size?: number }>,
  is_pinned: false,
  priority: 'normal',
});
const grades = ref<number[]>([]);
const majors = ref<string[]>([]);
const cohorts = ref<any[]>([]);
const linkLabel = ref('');
const linkUrl = ref('');
const activeReadersId = ref<string | null>(null);
const readers = ref<any[]>([]);
const readersLoading = ref(false);

const loadData = async () => {
   try {
     const { data } = await api.get('/announcements');
     announcements.value = data;
   } catch (e) {
     console.error("Failed to load announcements", e);
   }
};

const createAnnouncement = async () => {
    try {
        await api.post('/announcements', form.value);
        form.value = {
          title: '',
          content: '',
          target_all: true,
          target_grades: [],
          target_majors: [],
          target_cohorts: [],
          attachments: [],
          is_pinned: false,
          priority: 'normal',
        };
        linkLabel.value = '';
        linkUrl.value = '';
        await loadData();
        alert('Pengumuman berhasil dibuat');
    } catch (e) {
        alert('Gagal membuat pengumuman');
    }
};

const deleteAnnouncement = async (id: string) => {
    if (!confirm('Hapus pengumuman ini?')) return;
    try {
        await api.delete(`/announcements/${id}`);
        await loadData();
    } catch (e) {
        alert('Gagal menghapus');
    }
};

const loadTargets = async () => {
  try {
    const [studentRes, cohortRes] = await Promise.all([
      api.get('/students', { params: { limit: 5000 } }),
      api.get('/cohorts')
    ]);
    const studentList = studentRes.data?.data || studentRes.data || [];
    const uniqueMajors = new Set<string>();
    const uniqueGrades = new Set<number>();
    studentList.forEach((s: any) => {
      if (s.major) uniqueMajors.add(s.major);
      if (s.grade_level) uniqueGrades.add(Number(s.grade_level));
    });
    majors.value = Array.from(uniqueMajors).sort();
    grades.value = Array.from(uniqueGrades).sort((a, b) => a - b);
    cohorts.value = cohortRes.data || [];
  } catch (e) {
    console.error('Failed to load targets', e);
  }
};

const resolveCohortNames = (ids: string[]) => {
  return cohorts.value.filter((c: any) => ids.includes(c.id)).map((c: any) => c.name);
};

const priorityClass = (priority: string) => {
  if (priority === 'important') return 'bg-red-200 text-red-700';
  if (priority === 'deadline') return 'bg-yellow-200 text-yellow-800';
  return 'bg-gray-200 text-gray-700';
};

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  const files = Array.from(input.files);
  for (const file of files) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const type = file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'file';
      form.value.attachments.push({
        type,
        url: data.url,
        name: file.name,
        size: file.size,
      });
    } catch (e) {
      alert(`Gagal upload ${file.name}`);
    }
  }
  input.value = '';
};

const addLink = () => {
  if (!linkUrl.value.trim()) return;
  form.value.attachments.push({
    type: 'link',
    url: linkUrl.value.trim(),
    name: linkLabel.value.trim() || linkUrl.value.trim(),
  });
  linkLabel.value = '';
  linkUrl.value = '';
};

const removeAttachment = (idx: number) => {
  form.value.attachments.splice(idx, 1);
};

const toggleReaders = async (item: any) => {
  if (activeReadersId.value === item.id) {
    activeReadersId.value = null;
    readers.value = [];
    return;
  }
  activeReadersId.value = item.id;
  readersLoading.value = true;
  try {
    const { data } = await api.get(`/announcements/${item.id}/readers`);
    readers.value = data;
  } catch (e) {
    readers.value = [];
  } finally {
    readersLoading.value = false;
  }
};

onMounted(() => {
  loadData();
  loadTargets();
});
</script>
