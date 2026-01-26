<template>
  <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Bank Soal</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Kelola soal global dengan tag kesulitan.</p>
      </div>
      <button
        @click="showForm = !showForm"
        class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-bold shadow transition"
      >
        {{ showForm ? 'Tutup Form' : 'Tambah Soal' }}
      </button>
    </div>

    <div v-if="showForm" class="bg-gray-50 dark:bg-slate-700 p-4 rounded border dark:border-gray-600">
      <h3 class="font-bold mb-4 text-gray-800 dark:text-white">Soal Baru</h3>
      <form @submit.prevent="createQuestion" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea v-model="form.question_text" rows="3" placeholder="Teks soal" class="md:col-span-2 border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600" required></textarea>
        <select v-model="form.material_id" class="border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600">
          <option value="">Global (Semua Materi)</option>
          <option v-for="m in materials" :key="m.id" :value="m.id">{{ m.title }}</option>
        </select>
        <select v-model="form.difficulty" class="border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600">
          <option value="easy">Mudah</option>
          <option value="medium">Sedang</option>
          <option value="hard">Sulit</option>
        </select>
        <select v-model="form.question_type" class="border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600">
          <option value="multiple_choice">Pilihan Ganda</option>
          <option value="true_false">Benar / Salah</option>
          <option value="short_answer">Jawaban Singkat</option>
        </select>
        <input v-model="form.tags" type="text" placeholder="Tag (pisahkan dengan koma)" class="border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600" />
        <textarea v-model="form.options" rows="2" placeholder="Opsi (pisahkan dengan koma)" class="md:col-span-2 border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600" required></textarea>
        <input v-model="form.image_url" type="text" placeholder="Image URL (opsional)" class="md:col-span-2 border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600" />
        <input v-model="form.correct_answer" type="text" placeholder="Jawaban benar" class="md:col-span-2 border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600" required />
        <div class="md:col-span-2 flex justify-end">
          <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-bold">Simpan</button>
        </div>
      </form>
    </div>

    <div class="bg-gray-50 dark:bg-slate-700 p-4 rounded border dark:border-gray-600">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-gray-800 dark:text-white">Import Soal (JSON / CSV)</h3>
        <div class="flex gap-2 text-xs">
          <button
            type="button"
            @click="importMode = 'json'"
            :class="importMode === 'json' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'"
            class="px-3 py-1 rounded border"
          >
            JSON
          </button>
          <button
            type="button"
            @click="importMode = 'csv'"
            :class="importMode === 'csv' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'"
            class="px-3 py-1 rounded border"
          >
            CSV
          </button>
        </div>
      </div>

      <div class="text-xs text-gray-600 dark:text-gray-300 mb-3 space-y-1">
        <div v-if="importMode === 'json'">JSON array, LaTeX pakai `\\` (contoh: `$\\frac{1}{3}$`).</div>
        <div v-else>CSV kolom: `question_text,question_type,options,correct_answer,difficulty,tags,material_id,image_url`.</div>
        <div v-if="importMode === 'csv'">Gunakan `|` untuk memisahkan opsi/tag agar LaTeX aman dari koma.</div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          v-model="importText"
          rows="6"
          class="border p-2 rounded bg-white dark:bg-slate-800 dark:text-white dark:border-gray-600"
          placeholder="Tempel data di sini..."
        ></textarea>
        <div class="space-y-3">
          <input type="file" @change="handleImportFile" :accept="importMode === 'json' ? '.json' : '.csv'" />
          <div class="flex gap-2">
            <button
              type="button"
              @click="downloadTemplate(importMode)"
              class="flex-1 bg-white text-gray-700 border px-3 py-2 rounded hover:bg-gray-100 text-sm"
            >
              Download Template {{ importMode.toUpperCase() }}
            </button>
          </div>
          <button
            type="button"
            @click="runImport"
            class="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold"
          >
            Import Soal
          </button>
          <div v-if="importError" class="text-xs text-red-600">{{ importError }}</div>
          <div v-if="importSuccess" class="text-xs text-green-600">{{ importSuccess }}</div>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-white">
        <thead class="bg-gray-50 dark:bg-slate-700">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Soal</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Materi</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kesulitan</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tag</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="q in questions" :key="q.id" class="hover:bg-gray-50 dark:hover:bg-slate-700 transition">
            <td class="px-4 py-3 text-sm max-w-xs">
              <div class="font-semibold line-clamp-2">{{ q.question_text }}</div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{{ getMaterialTitle(q.material_id) }}</td>
            <td class="px-4 py-3 text-sm capitalize">{{ q.difficulty }}</td>
            <td class="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">
              <span v-if="q.tags?.length" class="inline-flex flex-wrap gap-1">
                <span v-for="tag in q.tags" :key="tag" class="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">{{ tag }}</span>
              </span>
              <span v-else class="text-gray-400">-</span>
            </td>
            <td class="px-4 py-3 text-right text-sm font-medium">
              <button @click="deleteQuestion(q.id)" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-bold">Hapus</button>
            </td>
          </tr>
          <tr v-if="questions.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Belum ada soal di bank.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';
import { useDialog } from '../utils/dialog';

interface Material {
  id: string;
  title: string;
}

const questions = ref<any[]>([]);
const materials = ref<Material[]>([]);
const showForm = ref(false);
const importMode = ref<'json' | 'csv'>('json');
const importText = ref('');
const importError = ref('');
const importSuccess = ref('');
const dialog = useDialog();
const form = ref({
  question_text: '',
  material_id: '',
  question_type: 'multiple_choice',
  options: '',
  correct_answer: '',
  difficulty: 'easy',
  tags: '',
  image_url: ''
});

const fetchData = async () => {
  try {
    const [qRes, mRes] = await Promise.all([
      api.get('/question-bank'),
      api.get('/materials')
    ]);
    questions.value = Array.isArray(qRes.data) ? qRes.data : [];
    materials.value = Array.isArray(mRes.data) ? mRes.data : [];
  } catch (e) {
    console.error('Gagal mengambil data bank soal', e);
  }
};

const getMaterialTitle = (id?: string | null) => {
  if (!id) return 'Global';
  const m = materials.value.find((mat) => mat.id === id);
  return m ? m.title : 'Global';
};

const createQuestion = async () => {
  try {
    const payload = {
      question_text: form.value.question_text,
      material_id: form.value.material_id || null,
      question_type: form.value.question_type,
      options: form.value.options.split(',').map((o) => o.trim()).filter(Boolean),
      correct_answer: form.value.correct_answer.trim(),
      difficulty: form.value.difficulty,
      tags: form.value.tags.split(',').map((t) => t.trim()).filter(Boolean),
      image_url: form.value.image_url.trim() || null
    };
    await api.post('/question-bank', payload);
    await fetchData();
    showForm.value = false;
      form.value = {
        question_text: '',
        material_id: '',
        question_type: 'multiple_choice',
        options: '',
        correct_answer: '',
        difficulty: 'easy',
        tags: '',
        image_url: ''
      };
  } catch (e) {
    await dialog.alert('Gagal menyimpan soal.');
  }
};

const deleteQuestion = async (id: string) => {
  const ok = await dialog.confirm('Hapus soal ini?', 'Hapus Soal');
  if (!ok) return;
  try {
    await api.delete(`/question-bank/${id}`);
    await fetchData();
  } catch (e) {
    await dialog.alert('Gagal menghapus soal.');
  }
};

const handleImportFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    importText.value = String(reader.result || '');
  };
  reader.readAsText(file);
  target.value = '';
};

const parseCsvLine = (line: string) => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map((v) => v.trim());
};

const parseCsv = (text: string) => {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.length === 0) return [];
  const header = parseCsvLine(lines[0] || '').map((h) => h.toLowerCase());
  const startIndex = header.includes('question_text') ? 1 : 0;
  return lines.slice(startIndex).map((line) => {
    const cols = parseCsvLine(line);
    const get = (key: string, idx: number) => header.includes(key) ? cols[header.indexOf(key)] : cols[idx];
    const optionsRaw = get('options', 2) || '';
    const tagsRaw = get('tags', 5) || '';
    return {
      question_text: get('question_text', 0) || '',
      question_type: get('question_type', 1) || 'multiple_choice',
      options: optionsRaw.split('|').map((o) => o.trim()).filter(Boolean),
      correct_answer: get('correct_answer', 3) || '',
      difficulty: get('difficulty', 4) || 'easy',
      tags: tagsRaw.split('|').map((t) => t.trim()).filter(Boolean),
      material_id: get('material_id', 6) || null,
      image_url: get('image_url', 7) || null
    };
  });
};

const runImport = async () => {
  importError.value = '';
  importSuccess.value = '';
  try {
    let payload: any[] = [];
    if (importMode.value === 'json') {
      const parsed = JSON.parse(importText.value || '[]');
      payload = Array.isArray(parsed) ? parsed : [parsed];
    } else {
      payload = parseCsv(importText.value || '');
    }
    const cleaned = payload.map((item) => ({
      question_text: item.question_text,
      question_type: item.question_type || 'multiple_choice',
      options: Array.isArray(item.options) ? item.options : [],
      correct_answer: item.correct_answer,
      difficulty: item.difficulty || 'easy',
      tags: Array.isArray(item.tags) ? item.tags : [],
      material_id: item.material_id || null,
      image_url: item.image_url || null
    })).filter((item) => item.question_text && item.correct_answer && item.options.length > 0);

    if (cleaned.length === 0) {
      importError.value = 'Tidak ada data valid untuk diimpor.';
      return;
    }

    await api.post('/question-bank/bulk', cleaned);
    importSuccess.value = `Berhasil import ${cleaned.length} soal.`;
    importText.value = '';
    await fetchData();
  } catch (e: any) {
    importError.value = e?.message || 'Gagal import soal.';
  }
};

const downloadTemplate = (mode: 'json' | 'csv') => {
  const filename = mode === 'json' ? 'question-bank-template.json' : 'question-bank-template.csv';
  const content = mode === 'json'
    ? JSON.stringify([
        {
          question_text: 'Hitung $\\\\int_0^1 x^2 dx$',
          question_type: 'multiple_choice',
          options: ['$\\\\frac{1}{3}$', '$\\\\frac{1}{2}$', '$\\\\frac{1}{4}$'],
          correct_answer: '$\\\\frac{1}{3}$',
          difficulty: 'easy',
          tags: ['kalkulus', 'integral'],
          material_id: null,
          image_url: 'https://example.com/graph.png'
        }
      ], null, 2)
    : [
        'question_text,question_type,options,correct_answer,difficulty,tags,material_id,image_url',
        '"Hitung $\\\\int_0^1 x^2 dx$","multiple_choice","$\\\\frac{1}{3}$|$\\\\frac{1}{2}$|$\\\\frac{1}{4}$","$\\\\frac{1}{3}$","easy","kalkulus|integral",,"https://example.com/graph.png"'
      ].join('\\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

onMounted(fetchData);
</script>
