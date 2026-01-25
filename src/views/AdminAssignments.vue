
<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Manajemen Tugas (Class-Based)</h1>

    <div v-if="loading" class="p-8 text-center text-gray-500">Memuat data...</div>
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{{ error }}</div>

    <div v-else>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">Manajemen Tugas</h2>
            <button @click="showForm = !showForm" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-bold shadow transition">
                {{ showForm ? 'Tutup Form' : 'Buat Tugas' }}
            </button>
        </div>

        <!-- Create Assignment -->
        <div v-if="showForm" class="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-8 transition-colors">
            <h2 class="font-bold mb-4 text-gray-800 dark:text-white">Buat Tugas Baru</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input v-model="form.title" placeholder="Judul Tugas" class="border p-2 rounded dark:bg-slate-700 dark:text-white dark:border-slate-600">
                <input v-model="form.due_date" type="datetime-local" class="border p-2 rounded dark:bg-slate-700 dark:text-white dark:border-slate-600">
            </div>
            <div class="mb-4 bg-white dark:bg-slate-700 rounded text-black">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 px-2 pt-2">Deskripsi Tugas (Rich Text / LaTeX)</label>
                <QuillEditor
                    v-model:content="form.description"
                    content-type="html"
                    theme="snow"
                    toolbar="minimal"
                />
            </div>

            <div class="mb-6 bg-white dark:bg-slate-800 rounded-lg shadow border dark:border-slate-700 p-4">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-bold text-gray-800 dark:text-white">Rubrik Penilaian</h3>
                    <button
                        type="button"
                        @click="addRubricItem"
                        class="text-xs font-bold text-indigo-600 dark:text-indigo-300 hover:underline"
                    >
                        + Tambah Kriteria
                    </button>
                </div>
                <div v-if="form.rubric.length === 0" class="text-xs text-gray-500 dark:text-gray-400 italic">
                    Belum ada rubrik. Tambahkan kriteria untuk penilaian terstruktur.
                </div>
                <div v-else class="space-y-3">
                    <div
                        v-for="(item, idx) in form.rubric"
                        :key="item.id"
                        class="grid grid-cols-1 md:grid-cols-6 gap-3 bg-gray-50 dark:bg-slate-700 p-3 rounded border dark:border-slate-600"
                    >
                        <input v-model="item.title" placeholder="Nama Kriteria" class="md:col-span-2 border p-2 rounded dark:bg-slate-800 dark:text-white dark:border-slate-600" />
                        <input v-model.number="item.max_score" type="number" min="1" placeholder="Skor Maks" class="md:col-span-1 border p-2 rounded dark:bg-slate-800 dark:text-white dark:border-slate-600" />
                        <input v-model="item.description" placeholder="Deskripsi (opsional)" class="md:col-span-2 border p-2 rounded dark:bg-slate-800 dark:text-white dark:border-slate-600" />
                        <button
                            type="button"
                            @click="removeRubricItem(idx)"
                            class="text-red-600 hover:text-red-700 text-sm font-bold"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>

            <div class="mb-6 bg-gray-50 dark:bg-slate-900 p-4 rounded border dark:border-slate-700">
                <h3 class="font-bold mb-3 text-gray-800 dark:text-white">Target Tugas</h3>

                <!-- Target Mode Switcher -->
                <div class="flex gap-4 mb-4 border-b dark:border-gray-700 pb-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" v-model="targetMode" value="class" name="targetMode">
                        <span class="font-bold text-gray-700 dark:text-gray-300">Kelas / Kelompok</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" v-model="targetMode" value="individual" name="targetMode">
                        <span class="font-bold text-gray-700 dark:text-gray-300">Privat / Individu</span>
                    </label>
                </div>

                <!-- Class Mode Selectors -->
                <div v-if="targetMode === 'class'" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tingkat Kelas</label>
                        <select v-model="form.target_grade" class="w-full border p-2 rounded dark:bg-slate-700 dark:text-white dark:border-slate-600">
                            <option :value="null">Semua Tingkat (10, 11, 12)</option>
                            <option :value="10">Kelas 10</option>
                            <option :value="11">Kelas 11</option>
                            <option :value="12">Kelas 12</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Jurusan</label>
                        <select v-model="form.target_major" class="w-full border p-2 rounded dark:bg-slate-700 dark:text-white dark:border-slate-600">
                            <option :value="null">Semua Jurusan</option>
                            <option v-for="major in MAJOR_OPTIONS" :key="major.value" :value="major.value">{{ major.label }}</option>
                        </select>
                    </div>
                </div>

                <!-- Student List (Always visible but serves different purpose) -->
                <div class="mt-4">
                     <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {{ targetMode === 'class' ? 'Tambahan Siswa (Opsional)' : 'Pilih Siswa (Wajib)' }}
                     </label>
                     <div class="h-40 overflow-y-auto border dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700 dark:text-white">
                         <div v-for="s in students" :key="s.id" class="flex items-center gap-2 mb-1">
                             <input type="checkbox" :value="s.id" v-model="form.target_students">
                             <span class="text-sm">{{ s.full_name }} ({{ s.grade_level }} {{ s.major }})</span>
                         </div>
                     </div>
                     <p v-if="targetMode === 'class'" class="text-xs text-gray-500 dark:text-gray-400 mt-1">Siswa yang dipilih akan menerima tugas ini <b>selain</b> target kelas diatas.</p>
                     <p v-else class="text-xs text-gray-500 dark:text-gray-400 mt-1">Tugas hanya akan dikirim ke siswa yang dipilih.</p>
                </div>
            </div>

            <div class="flex justify-end">
                <button @click="createAssignment" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-bold shadow transition">
                    Simpan Tugas
                </button>
            </div>
        </div>

        <!-- List Assignments -->

        <div class="space-y-4">
            <h2 class="font-bold text-xl text-gray-800 dark:text-white">Daftar Tugas Aktif</h2>
            <div v-if="assignments.length === 0" class="text-gray-500 italic">Belum ada tugas.</div>

            <div v-for="assign in assignments" :key="assign.id" class="bg-white dark:bg-slate-800 p-4 rounded shadow border dark:border-slate-700 flex justify-between items-start transition-colors">
                <div>
                    <h3 class="font-bold text-lg hover:text-indigo-600 cursor-pointer dark:text-white" @click="$router.push(`/admin/assignments/${assign.id}`)">
                        {{ assign.title }}
                    </h3>
                    <div class="text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">
                         <MathRenderer :content="assign.description" />
                    </div>
                    <div class="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span class="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded">
                            Target:
                            {{ assign.target_grade ? 'Kelas ' + assign.target_grade : 'Semua Kelas' }}
                            -
                            {{ assign.target_major ? assign.target_major : 'Semua Jurusan' }}
                        </span>
                        <span class="flex items-center">🕒 Due: {{ new Date(assign.due_date).toLocaleString() }}</span>
                    </div>
                </div>
                <div class="text-right">
                     <button @click="deleteAssignment(assign.id)" class="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm underline mb-1">Hapus</button>
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
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import MathRenderer from '../components/MathRenderer.vue';
import api from '../api';
import { MAJOR_OPTIONS } from '../constants/majors';
import { addAuditLog } from '../utils/auditLog';
import { getStaffActorId, getStaffUser } from '../utils/auth';

const students = ref<any[]>([]);
const assignments = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const showForm = ref(false);
const targetMode = ref('class'); // 'class' or 'individual'
const staffUser = ref(getStaffUser());
const actorId = ref(getStaffActorId(staffUser.value));
const isGuru = ref(staffUser.value?.role === 'guru');

const form = reactive({
    title: '',
    description: '',
    due_date: '',
    target_grade: null as number | null,
    target_major: null as string | null,
    target_students: [] as string[],
    rubric: [] as Array<{ id: string; title: string; description?: string; max_score: number }>
});

const createRubricItem = () => ({
    id: `rubric_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: '',
    description: '',
    max_score: 10
});

const addRubricItem = () => {
    form.rubric.push(createRubricItem());
};

const removeRubricItem = (index: number) => {
    form.rubric.splice(index, 1);
};

const normalizeRubric = () => {
    return form.rubric
        .filter(item => item.title && item.max_score)
        .map(item => ({
            id: item.id,
            title: item.title.trim(),
            description: item.description?.trim() || '',
            max_score: Number(item.max_score)
        }));
};

const loadData = async () => {
    loading.value = true;
    error.value = '';
    try {
        const [aRes, sRes] = await Promise.all([
             api.get('/assignments'),
             api.get('/students')
        ]);
        const assignmentRows = Array.isArray(aRes.data) ? aRes.data : aRes.data?.data || [];
        if (isGuru.value) {
            assignments.value = assignmentRows.filter(
                (item: any) => String(item.created_by || '') === String(actorId.value)
            );
        } else {
            assignments.value = assignmentRows;
        }
        students.value = Array.isArray(sRes.data) ? sRes.data : sRes.data?.data || [];
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
    const payload = { ...form, rubric: normalizeRubric(), created_by: actorId.value };

    if (targetMode.value === 'individual') {
        if (form.target_students.length === 0) return alert('Pilih minimal satu siswa untuk tugas individu!');
        // Set Class Filters to Non-Matching to ensure privacy
        payload.target_grade = -1;
        payload.target_major = 'NONE';
    }

    try {
        const response = await api.post('/assignments', payload);
        const createdId = response?.data?.id || response?.data?.assignment_id || response?.data?.data?.id;
        addAuditLog({
            action: 'create',
            entity: 'assignment',
            entity_id: String(createdId || ''),
            summary: `Tambah tugas: ${payload.title}`,
        }).catch(() => undefined);
        alert('Tugas berhasil dibuat!');

        // Reset form
        form.title = '';
        form.description = ''; // Quill v-model binds here
        form.due_date = '';
        form.target_grade = null;
        form.target_major = null;
        form.target_students = [];
        form.rubric = [];
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
    if (isGuru.value) {
        const item = assignments.value.find((row: any) => String(row.id) === String(id));
        const isOwned = item?.created_by && String(item.created_by) === String(actorId.value);
        if (!isOwned) {
            alert('Anda hanya dapat menghapus tugas milik Anda sendiri.');
            return;
        }
    }

    try {
        await api.delete(`/assignments/${id}`);
        addAuditLog({
            action: 'delete',
            entity: 'assignment',
            entity_id: String(id),
            summary: 'Hapus tugas',
        }).catch(() => undefined);
        // Remove from local list to avoid full reload
        assignments.value = assignments.value.filter(a => a.id !== id);
    } catch (e: any) {
        alert('Gagal menghapus tugas: ' + (e.message || String(e)));
    }
};

onMounted(loadData);
</script>

<style scoped>
:deep(.ql-editor) {
    min-height: 150px;
    background: white;
}
</style>
