<template>
  <div class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{{ isEdit ? 'Edit Materi (Mode DELTA)' : 'Tambah Materi Baru (Strategi DELTA)' }}</h2>

    <form @submit.prevent="saveMaterial" class="space-y-6">
      
      <!-- Top Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FloatingInput 
            v-model="form.title" 
            label="Judul Materi (Contoh: Optimasi Produksi)" 
            id="title" 
            required 
          />
        </div>
        
        <!-- Teacher Name -->
        <div>
           <FloatingInput 
             v-model="form.teacher_name" 
             label="Nama Pengajar (Guru)" 
             id="teacher" 
           />
        </div>
        
        <!-- Description Field -->
        <div class="md:col-span-2">
           <div class="relative z-0 w-full mb-6 group">
                <textarea 
                  v-model="form.description" 
                  name="description" 
                  id="description" 
                  rows="2" 
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                  placeholder=" " 
                ></textarea>
                <label 
                  for="description" 
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Deskripsi Singkat (untuk Hero/Card)
                </label>
           </div>
        </div>

        <div class="flex gap-4">
            <div class="flex-1">
                <div class="relative z-0 w-full mb-6 group">
                    <select 
                        v-model="form.major_target" 
                        id="major"
                        class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    >
                        <option class="text-black" value="TKJ">TKJ</option>
                        <option class="text-black" value="RPL">RPL</option>
                        <option class="text-black" value="Multimedia">Multimedia</option>
                        <option class="text-black" value="Semua">Semua</option>
                    </select>
                    <label 
                        for="major" 
                        class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Jurusan Target
                    </label>
                </div>
            </div>
            <div class="flex items-end pb-8">
                 <label class="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" v-model="form.is_featured" class="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-300">Featured Topic?</span>
                 </label>
            </div>
        </div>

        <!-- Embedded Tool Section (Explore Stage) -->
        <div class="border-t dark:border-gray-700 pt-4 mt-4 md:col-span-2">
             <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Simulasi Interaktif (Untuk Tahap EXPLORE)</label>
             <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                     <div class="relative z-0 w-full mb-6 group">
                         <select v-model="form.tool_type" id="tool_type" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer">
                             <option class="text-black" value="">Tidak Ada</option>
                             <option class="text-black" value="geogebra">GeoGebra</option>
                             <option class="text-black" value="desmos">Desmos</option>
                             <option class="text-black" value="generic">Website Lain (Generic)</option>
                         </select>
                         <label for="tool_type" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Tipe Tool</label>
                     </div>
                 </div>
                 <div class="md:col-span-2">
                     <FloatingInput 
                       v-model="form.embedded_tool_url" 
                       label="URL Embed / Link Simulasi"
                       id="embed_url"
                     />
                     <p v-if="form.tool_type === 'geogebra'" class="text-[10px] text-gray-400 mt-1">Gunakan link 'Embed' dari GeoGebra, bukan link view biasa.</p>
                 </div>
             </div>
        </div>
      </div>

      <!-- DELTA Tabs -->
      <div class="border dark:border-gray-700 rounded-lg overflow-hidden">
        <!-- Tab Headers -->
        <div class="flex overflow-x-auto bg-gray-50 dark:bg-slate-900 border-b dark:border-gray-700">
           <button 
             v-for="stage in stages" 
             :key="stage.key"
             type="button"
             @click="activeTab = stage.key"
             class="px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap"
             :class="activeTab === stage.key ? 'bg-white dark:bg-slate-800 border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'"
           >
             {{ stage.label }}
           </button>
        </div>

        <!-- Tab Content -->
        <div class="p-6 bg-white dark:bg-slate-800 min-h-[400px]">
           <!-- Stage Guidance -->
           <div v-if="currentStageInfo" class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded text-sm">
              <h4 class="font-bold mb-1">{{ currentStageInfo.title }} ({{ currentStageInfo.label }})</h4>
              <p>{{ currentStageInfo.description }}</p>
              <ul class="list-disc list-inside mt-2 text-xs text-blue-700 dark:text-blue-300">
                 <li v-for="(tip, i) in currentStageInfo.tips" :key="i">{{ tip }}</li>
              </ul>
           </div>

           <!-- Editor -->
           <div class="h-64 mb-12 bg-white dark:bg-gray-700 text-black dark:text-white rounded">
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
      <div class="mt-8 border-t dark:border-gray-700 pt-4">
        <button type="button" @click="showPreview = !showPreview" class="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline mb-2">
            {{ showPreview ? 'Sembunyikan Preview' : 'Tampilkan Live Preview (Gabungan)' }}
        </button>
        <div v-if="showPreview" class="bg-gray-50 dark:bg-slate-900 p-4 rounded border dark:border-gray-700 min-h-[100px] space-y-8">
           <div v-for="stage in stages" :key="stage.key">
              <div v-if="deltaContent[stage.key] && deltaContent[stage.key] !== '<p><br></p>'">
                  <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 border-b dark:border-gray-700">{{ stage.label }}</h3>
                  <MathRenderer :content="deltaContent[stage.key] || ''" />
              </div>
           </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-4">
        <button 
          type="button" 
          @click="$router.back()"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
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
import FloatingInput from '../../components/FloatingInput.vue';
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
    embedded_tool_url: string;
    tool_type: string;
}

const form = ref<MaterialForm>({
  title: '',
  description: '',
  major_target: 'Semua',
  teacher_name: 'Feri Dwi Hermawan', // Default
  is_featured: false,
  embedded_tool_url: '',
  tool_type: ''
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
      form.value.embedded_tool_url = data.embedded_tool_url || '';
      form.value.tool_type = data.tool_type || '';
      
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
