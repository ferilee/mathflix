<template>
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-2xl font-bold mb-6">{{ isEdit ? 'Edit Materi (Mode DELTA)' : 'Tambah Materi Baru (Strategi DELTA)' }}</h2>

    <form @submit.prevent="saveMaterial" class="space-y-6">
      
      <!-- Top Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Judul Materi</label>
          <input 
            v-model="form.title" 
            type="text" 
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            placeholder="Contoh: Optimasi Produksi"
          />
        </div>
        
        <!-- Teacher Name -->
        <div>
           <label class="block text-sm font-medium text-gray-700">Nama Pengajar (Guru)</label>
           <input 
             v-model="form.teacher_name" 
             type="text" 
             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-gray-50"
             placeholder="Nama Guru..."
           />
        </div>
        
        <!-- Description Field -->
        <div class="md:col-span-2">
           <label class="block text-sm font-medium text-gray-700">Deskripsi Singkat (untuk Hero/Card)</label>
           <textarea 
             v-model="form.description" 
             rows="2"
             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
             placeholder="Deskripsi singkat yang muncul di dashboard..."
           ></textarea>
        </div>

        <div class="flex gap-4">
            <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700">Jurusan Target</label>
                <select 
                    v-model="form.major_target" 
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                >
                    <option value="TKJ">TKJ</option>
                    <option value="RPL">RPL</option>
                    <option value="Multimedia">Multimedia</option>
                    <option value="Semua">Semua</option>
                </select>
            </div>
            <div class="flex items-end pb-3">
                 <label class="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" v-model="form.is_featured" class="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                    <span class="text-sm font-medium text-gray-900">Featured Topic?</span>
                 </label>
            </div>
        </div>
      </div>

      <!-- DELTA Tabs -->
      <div class="border rounded-lg overflow-hidden">
        <!-- Tab Headers -->
        <div class="flex overflow-x-auto bg-gray-50 border-b">
           <button 
             v-for="stage in stages" 
             :key="stage.key"
             type="button"
             @click="activeTab = stage.key"
             class="px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap"
             :class="activeTab === stage.key ? 'bg-white border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'"
           >
             {{ stage.label }}
           </button>
        </div>

        <!-- Tab Content -->
        <div class="p-6 bg-white min-h-[400px]">
           <!-- Stage Guidance -->
           <div class="mb-4 p-4 bg-blue-50 text-blue-800 rounded text-sm">
              <h4 class="font-bold mb-1">{{ currentStageInfo.title }} ({{ currentStageInfo.label }})</h4>
              <p>{{ currentStageInfo.description }}</p>
              <ul class="list-disc list-inside mt-2 text-xs text-blue-700">
                 <li v-for="(tip, i) in currentStageInfo.tips" :key="i">{{ tip }}</li>
              </ul>
           </div>

           <!-- Editor -->
           <div class="h-64 mb-12">
             <QuillEditor 
                v-model:content="deltaContent[activeTab]" 
                content-type="html" 
                theme="snow" 
                toolbar="full"
                @ready="onEditorReady" 
              />
           </div>
           
           <p class="text-xs text-gray-400 mt-2">
             Konten akan otomatis digabungkan saat disimpan. Gunakan $$ untuk rumus matematika.
           </p>
        </div>
      </div>

      <!-- Live Preview (Aggregated) -->
      <div class="mt-8 border-t pt-4">
        <button type="button" @click="showPreview = !showPreview" class="text-sm font-bold text-indigo-600 hover:underline mb-2">
            {{ showPreview ? 'Sembunyikan Preview' : 'Tampilkan Live Preview (Gabungan)' }}
        </button>
        <div v-if="showPreview" class="bg-gray-50 p-4 rounded border min-h-[100px] space-y-8">
           <div v-for="stage in stages" :key="stage.key">
              <div v-if="deltaContent[stage.key] && deltaContent[stage.key] !== '<p><br></p>'">
                  <h3 class="text-lg font-bold text-gray-800 mb-2 border-b">{{ stage.label }}</h3>
                  <MathRenderer :content="deltaContent[stage.key]" />
              </div>
           </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-4">
        <button 
          type="button" 
          @click="$router.back()"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Batal
        </button>
        <button 
          type="submit" 
          class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Simpan Materi
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { QuillEditor } from '@vueup/vue-quill';
import MathRenderer from '../../components/MathRenderer.vue';
import api from '../../api';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);

interface MaterialForm {
    title: string;
    description: string;
    major_target: string;
    teacher_name: string;
    is_featured: boolean;
}

const form = ref<MaterialForm>({
  title: '',
  description: '',
  major_target: 'Semua',
  teacher_name: 'Feri Dwi Hermawan', // Default
  is_featured: false
});

const showPreview = ref(false);

// DELTA Configuration
const stages = [
    { key: 'discover', label: '1. DISCOVER', title: 'Tahap Discover', description: 'Menemukan Konsep melalui Investigasi Mandiri.', tips: ['Berikan masalah kontekstual', 'Picu rasa ingin tahu', 'Fasilitasi investigasi siswa'] },
    { key: 'explore', label: '2. EXPLORE', title: 'Tahap Explore', description: 'Mengeksplorasi Konsep secara Mendalam.', tips: ['Gunakan peta konsep', 'Identifikasi pola matematis', 'Gunakan software/alat bantu'] },
    { key: 'launch', label: '3. LAUNCH', title: 'Tahap Launch', description: 'Meluncurkan Solusi dalam Konteks Nyata.', tips: ['Proyek nyata', 'Simulasi & Modeling', 'Aplikasi di industri/jurusan'] },
    { key: 'transform', label: '4. TRANSFORM', title: 'Tahap Transform', description: 'Mentransformasi Pengalaman menjadi Pembelajaran Bermakna.', tips: ['Jurnal refleksi', 'Diskusi strategi belajar', 'Pertanyaan pemantik refleksi'] },
    { key: 'assess', label: '5. ASSESS', title: 'Tahap Assess', description: 'Menilai Perkembangan Pemahaman.', tips: ['Kuis pemahaman', 'Self-assessment', 'Formatif & Sumatif'] },
];

const activeTab = ref('discover');
const deltaContent = ref<Record<string, string>>({
    discover: '',
    explore: '',
    launch: '',
    transform: '',
    assess: ''
});

const currentStageInfo = computed(() => stages.find(s => s.key === activeTab.value) || stages[0]);

onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await api.get(`/materials/${route.params.id}`);
      form.value.title = data.title;
      form.value.description = data.description || '';
      form.value.major_target = data.major_target || 'Semua';
      form.value.teacher_name = data.teacher_name || 'Feri Dwi Hermawan';
      form.value.is_featured = !!data.is_featured;
      
      // Parse content back to DELTA sections
      parseContent(data.content);
    } catch (e) {
      console.error("Failed to load material", e);
    }
  }
});

const parseContent = (html: string) => {
    // Simple parser looking for our specific delimiter
    // Format: <div data-stage="key">...content...</div>
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    stages.forEach(stage => {
        const section = doc.querySelector(`div[data-stage="${stage.key}"]`);
        if (section) {
            deltaContent.value[stage.key] = section.innerHTML;
        }
    });

    // Fallback: If no structured data found (legacy content), put all in Discover
    const hasData = Object.values(deltaContent.value).some(v => v.length > 0);
    if (!hasData && html) {
        deltaContent.value.discover = html;
    }
};

const saveMaterial = async () => {
    // Aggregate content
    let fullContent = '';
    stages.forEach(stage => {
        const content = deltaContent.value[stage.key];
        if (content && content.trim() !== '' && content !== '<p><br></p>') {
            fullContent += `<div data-stage="${stage.key}" class="delta-section mb-8">`;
            fullContent += `<h3 class="text-xl font-bold bg-gray-100 p-2 border-l-4 border-indigo-500 mb-4">${stage.label} - ${stage.title}</h3>`;
            fullContent += content;
            fullContent += `</div>`;
        }
    });

    // If empty (edge case), allow saving empty?
    if (fullContent === '') fullContent = '<p>Materi belum diisi.</p>';

    const payload = {
        ...form.value,
        content: fullContent
    };

    try {
        if (isEdit.value) {
            await api.put(`/materials/${route.params.id}`, payload);
        } else {
            await api.post('/materials', payload);
        }
        router.push('/admin/materials');
    } catch (e) {
        alert("Gagal menyimpan materi");
        console.error(e);
    }
};

const onEditorReady = () => {
    // Optional: could customize toolbar here if needed
};
</script>

<style scoped>
/* Override quill height if needed */
:deep(.ql-editor) {
    min-height: 200px;
}
</style>
