
<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Manajemen Tugas (Class-Based)</h1>

    <div v-if="loading" class="p-8 text-center text-gray-500">Memuat data...</div>
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{{ error }}</div>
    
    <div v-else>
        <!-- Create Assignment -->
        <div class="bg-white p-6 rounded shadow mb-8">
            <h2 class="font-bold mb-4">Buat Tugas Baru</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input v-model="form.title" placeholder="Judul Tugas" class="border p-2 rounded">
                <input v-model="form.due_date" type="datetime-local" class="border p-2 rounded">
            </div>
            <textarea v-model="form.description" placeholder="Deskripsi Tugas" class="w-full border p-2 rounded mb-4" rows="3"></textarea>
            
            <div class="mb-6 bg-gray-50 p-4 rounded border">
                <h3 class="font-bold mb-3">Target Tugas</h3>
                
                <!-- Target Mode Switcher -->
                <div class="flex gap-4 mb-4 border-b pb-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" v-model="targetMode" value="class" name="targetMode">
                        <span class="font-bold text-gray-700">Kelas / Kelompok</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" v-model="targetMode" value="individual" name="targetMode">
                        <span class="font-bold text-gray-700">Privat / Individu</span>
                    </label>
                </div>

                <!-- Class Mode Selectors -->
                <div v-if="targetMode === 'class'" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Tingkat Kelas</label>
                        <select v-model="form.target_grade" class="w-full border p-2 rounded">
                            <option :value="null">Semua Tingkat (10, 11, 12)</option>
                            <option :value="10">Kelas 10</option>
                            <option :value="11">Kelas 11</option>
                            <option :value="12">Kelas 12</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Jurusan</label>
                        <select v-model="form.target_major" class="w-full border p-2 rounded">
                            <option :value="null">Semua Jurusan</option>
                            <option value="RPL">RPL</option>
                            <option value="TKJ">TKJ</option>
                            <option value="DPIB">DPIB</option>
                        </select>
                    </div>
                </div>

                <!-- Student List (Always visible but serves different purpose) -->
                <div class="mt-4">
                     <label class="block text-sm font-bold text-gray-700 mb-2">
                        {{ targetMode === 'class' ? 'Tambahan Siswa (Opsional)' : 'Pilih Siswa (Wajib)' }}
                     </label>
                     <div class="h-40 overflow-y-auto border p-2 rounded bg-white">
                         <div v-for="s in students" :key="s.id" class="flex items-center gap-2 mb-1">
                             <input type="checkbox" :value="s.id" v-model="form.target_students">
                             <span class="text-sm">{{ s.full_name }} ({{ s.grade_level }} {{ s.major }})</span>
                         </div>
                     </div>
                     <p v-if="targetMode === 'class'" class="text-xs text-gray-500 mt-1">Siswa yang dipilih akan menerima tugas ini <b>selain</b> target kelas diatas.</p>
                     <p v-else class="text-xs text-gray-500 mt-1">Tugas hanya akan dikirim ke siswa yang dipilih.</p>
                </div>
            </div>

            <div class="flex justify-end">
                <button @click="createAssignment" class="bg-indigo-600 text-white px-6 py-2 rounded">Buat Tugas</button>
            </div>
        </div>

        <!-- List Assignments -->
        <div class="space-y-4">
            <h2 class="font-bold text-xl">Daftar Tugas Aktif</h2>
            <div v-if="assignments.length === 0" class="text-gray-500 italic">Belum ada tugas.</div>
            
            <div v-for="assign in assignments" :key="assign.id" class="bg-white p-4 rounded shadow border flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-lg">{{ assign.title }}</h3>
                    <p class="text-gray-600 mb-2">{{ assign.description }}</p>
                    <div class="flex gap-4 text-xs text-gray-500">
                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Target: 
                            {{ assign.target_grade ? 'Kelas ' + assign.target_grade : 'Semua Kelas' }} 
                            - 
                            {{ assign.target_major ? assign.target_major : 'Semua Jurusan' }}
                        </span>
                        <span class="flex items-center">🕒 Due: {{ new Date(assign.due_date).toLocaleString() }}</span>
                    </div>
                </div>
                <div class="text-right">
                     <button @click="deleteAssignment(assign.id)" class="text-red-500 hover:text-red-700 text-sm underline mb-1">Hapus</button>
                    <div class="text-xs text-gray-400">
                        Created: {{ new Date(assign.created_at).toLocaleDateString() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import api from '../api';

const students = ref<any[]>([]);
const assignments = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const targetMode = ref('class'); // 'class' or 'individual'

const form = reactive({
    title: '',
    description: '',
    due_date: '',
    target_grade: null as number | null,
    target_major: null as string | null,
    target_students: [] as string[]
});

const loadData = async () => {
    loading.value = true;
    error.value = '';
    try {
        const [aRes, sRes] = await Promise.all([
             api.get('/assignments'),
             api.get('/students')
        ]);
        assignments.value = Array.isArray(aRes.data) ? aRes.data : [];
        students.value = Array.isArray(sRes.data) ? sRes.data : [];
    } catch (e: any) {
        console.error("Error loading data:", e);
        error.value = 'Gagal memuat data: ' + (e.message || e);
    } finally {
        loading.value = false;
    }
};

const createAssignment = async () => {
    if (!form.title || !form.due_date) return alert('Judul dan Tanggal harus diisi!');
    
    // Prepare payload
    const payload = { ...form };
    
    if (targetMode.value === 'individual') {
        if (form.target_students.length === 0) return alert('Pilih minimal satu siswa untuk tugas individu!');
        // Set Class Filters to Non-Matching to ensure privacy
        payload.target_grade = -1; 
        payload.target_major = 'NONE';
    }

    try {
        await api.post('/assignments', payload);
        alert('Tugas berhasil dibuat!');
        
        // Reset form
        form.title = '';
        form.description = '';
        form.due_date = '';
        form.target_grade = null;
        form.target_major = null;
        form.target_students = [];
        targetMode.value = 'class';
        
        loadData();
    } catch (e: any) {
        console.error(e);
        let msg = e.response?.data?.error || e.message || 'Gagal membuat tugas';
        if (typeof msg === 'object') msg = JSON.stringify(msg);
        alert('Gagal membuat tugas: ' + msg);
    }
};

const deleteAssignment = async (id: string) => {
    if (!confirm('Apakah anda yakin ingin menghapus tugas ini?')) return;
    
    try {
        await api.delete(`/assignments/${id}`);
        // Remove from local list to avoid full reload
        assignments.value = assignments.value.filter(a => a.id !== id);
    } catch (e: any) {
        alert('Gagal menghapus tugas: ' + (e.message || String(e)));
    }
};

onMounted(loadData);
</script>
