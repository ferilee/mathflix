<template>
  <div class="space-y-6">
    <div class="bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-lg shadow-black/40 flex justify-between items-center transition-colors backdrop-blur">
      <div>
           <h2 class="text-2xl font-bold mb-1 text-gray-800 dark:text-gray-100">Dashboard Guru</h2>
           <p class="text-gray-600 dark:text-gray-400">Overview performa siswa dan aktivitas terbaru (Tahap Assess).</p>
      </div>
      <div class="flex items-center gap-3">
        <button @click="loadAnalytics" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-bold">Aggregated Real-time</button>
      </div>
    </div>

    <div v-if="paymentNotice" class="bg-emerald-900/40 border border-emerald-500/40 text-emerald-100 px-4 py-3 rounded-xl text-sm">
      {{ paymentNotice }}
      <span v-if="paymentNoticeAt" class="text-xs text-emerald-200/70 ml-2">
        {{ new Date(paymentNoticeAt).toLocaleString() }}
      </span>
    </div>

    <div v-if="isAdmin && pendingTeacherRequests.length" class="bg-red-950/60 border border-red-500/40 text-red-100 px-4 py-4 rounded-2xl text-sm">
      <div class="flex items-center justify-between gap-4">
        <div>
          <div class="font-semibold">Permintaan Akun Guru Baru</div>
          <div class="text-xs text-red-200/70 mt-1">
            {{ pendingTeacherRequests.length }} permintaan menunggu konfirmasi.
          </div>
        </div>
        <button
          type="button"
          class="text-xs font-semibold px-3 py-2 rounded bg-red-500 text-black hover:bg-red-400"
          @click="openPendingRequests"
        >
          Tinjau
        </button>
      </div>
    </div>


    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-lg shadow-black/40 border-l-4 border-blue-500 transition-colors backdrop-blur">
            <h3 class="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase">Total Siswa</h3>
            <div class="text-4xl font-bold text-gray-800 dark:text-white mt-2">{{ totalStudentsDisplay }}</div>
        </div>
        <div class="bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-lg shadow-black/40 border-l-4 border-green-500 transition-colors backdrop-blur">
            <h3 class="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase">Rata-rata Nilai Kuis</h3>
            <div class="text-4xl font-bold text-gray-800 dark:text-white mt-2">{{ averageScoreDisplay }}</div>
            <div class="text-xs text-gray-400 mt-1">Acuan ketuntasan: 75</div>
        </div>
        <div class="bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-lg shadow-black/40 border-l-4 border-purple-500 transition-colors backdrop-blur">
            <h3 class="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase">Jurnal Refleksi Hari Ini</h3>
            <div class="text-4xl font-bold text-gray-800 dark:text-white mt-2">{{ stats.today_reflections || 0 }}</div>
            <div class="text-xs text-gray-400 mt-1">Siswa aktif merefleksi</div>
        </div>
        <div class="bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-lg shadow-black/40 border-l-4 border-amber-500 transition-colors backdrop-blur">
            <h3 class="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase">Tagihan Siswa Berbayar</h3>
            <div class="text-3xl font-bold text-gray-800 dark:text-white mt-2">{{ formatRupiah(billingAmount) }}</div>
            <div class="text-xs text-gray-400 mt-1">
              Gratis {{ freeQuotaDisplay }} siswa, {{ paidStudentCount }} berbayar
              <span v-if="overdueStudents">• {{ overdueStudents }} tertunda</span>
            </div>
            <button
              v-if="billingAmount > 0"
              :disabled="billingLoading"
              @click="handleGoToBilling"
              class="mt-3 text-xs font-bold px-3 py-2 rounded bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-60"
            >
              {{ billingLoading ? 'Memuat...' : 'Atur Pembayaran' }}
            </button>
        </div>
    </div>

    <div v-if="isAdmin && unpaidTeachers.length > 0" class="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="font-bold text-lg text-gray-800 dark:text-white">Guru Belum Bayar</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Lebih dari {{ FREE_STUDENT_QUOTA }} siswa terdaftar.</p>
        </div>
        <router-link to="/admin/students" class="text-indigo-600 dark:text-indigo-400 text-sm hover:underline">Lihat Manajemen Siswa</router-link>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div v-for="item in unpaidTeachers" :key="item.key" class="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded px-4 py-3">
          <div>
            <div class="text-sm font-semibold text-gray-800 dark:text-white">{{ item.name }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.total }} siswa</div>
          </div>
          <div class="text-sm font-bold text-amber-700 dark:text-amber-300">
            {{ item.unpaid }} belum bayar
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Recent Reflections Feed -->
        <div class="lg:col-span-2 bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-lg shadow-black/40 transition-colors backdrop-blur">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-lg text-gray-800 dark:text-white">Jurnal Refleksi Terbaru</h3>
                <router-link to="/admin/reflections" class="text-indigo-600 dark:text-indigo-400 text-sm hover:underline">Lihat Semua</router-link>
            </div>

            <div v-if="loading" class="text-gray-500 italic">Memuat data...</div>
            <div v-else-if="stats.recent_reflections?.length === 0" class="text-gray-500">Belum ada jurnal.</div>

            <div v-else class="space-y-4">
                <template v-for="ref in stats.recent_reflections" :key="ref.id">
                    <div v-if="ref.student" class="border-b dark:border-slate-700 pb-3 last:border-0 last:pb-0">
                        <div class="flex justify-between items-start">
                            <div>
                                <span class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ ref.student.full_name }}</span>
                                <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">({{ ref.student.grade_level }} {{ ref.student.major }})</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-xl">{{ getMoodEmoji(ref.mood) }}</span>
                                <button
                                    type="button"
                                    class="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200"
                                    @click="deleteReflection(ref.id)"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                        <p class="text-gray-600 dark:text-gray-300 text-sm mt-1 italic line-clamp-2">"{{ ref.content }}"</p>
                        <div class="text-xs text-gray-400 mt-1">{{ new Date(ref.created_at).toLocaleString() }}</div>
                    </div>
                </template>
            </div>
        </div>

        <!-- At-Risk Monitor -->
        <div class="bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-lg shadow-black/40 transition-colors backdrop-blur">
            <h3 class="font-bold text-lg text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                ⚠️ Perlu Perhatian
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">Siswa dengan rata-rata nilai kuis di bawah 60.</p>

            <div v-if="loading" class="text-gray-500 italic">Menganalisis...</div>
            <div v-else-if="stats.at_risk_students?.length === 0" class="text-center py-6 text-green-600 dark:text-green-400">
                <div class="text-2xl mb-2">✅</div>
                Tidak ada siswa "at-risk". <br>Semua aman!
            </div>

            <div v-else class="space-y-3">
                 <div v-for="(student, idx) in stats.at_risk_students" :key="idx" class="flex justify-between items-center bg-red-50 dark:bg-red-900/30 p-3 rounded">
                     <span class="font-medium text-gray-700 dark:text-gray-200">{{ student.name }}</span>
                     <span class="bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-bold px-2 py-1 rounded">Avg: {{ student.average }}</span>
                 </div>
            </div>
        </div>
    </div>


    <!-- Recent Student Activity -->
    <div class="bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-lg shadow-black/40 transition-colors backdrop-blur">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg text-gray-800 dark:text-white">Aktivitas Siswa Terakhir</h3>
            <router-link to="/admin/activity" class="text-indigo-600 dark:text-indigo-400 text-sm hover:underline">Lihat Aktivitas</router-link>
        </div>
        <div v-if="activityLoading" class="text-gray-500 italic">Memuat aktivitas...</div>
        <div v-else-if="recentActivity.length === 0" class="text-gray-500">Belum ada aktivitas siswa.</div>
        <div v-else class="space-y-3">
            <div v-for="item in recentActivity" :key="item.student_id" class="flex items-center justify-between bg-gray-50 dark:bg-slate-700 p-3 rounded">
                <div>
                    <div class="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                        {{ item.student_name }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ item.material_title || 'Materi tidak diketahui' }}
                    </div>
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-300">
                    {{ formatDuration(item.duration_seconds) }}
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Navigation (Compact) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link to="/admin/students" class="bg-slate-900/70 border border-white/10 p-4 rounded-2xl text-center hover:border-red-500/70 transition font-bold text-red-300">Manajemen Siswa</router-link>
        <router-link to="/admin/materials" class="bg-slate-900/70 border border-white/10 p-4 rounded-2xl text-center hover:border-emerald-400/70 transition font-bold text-emerald-300">Manajemen Materi</router-link>
        <router-link to="/admin/quizzes" class="bg-slate-900/70 border border-white/10 p-4 rounded-2xl text-center hover:border-rose-400/70 transition font-bold text-rose-300">Manajemen Kuis</router-link>
        <router-link to="/admin/assignments" class="bg-slate-900/70 border border-white/10 p-4 rounded-2xl text-center hover:border-amber-400/70 transition font-bold text-amber-300">Manajemen Tugas</router-link>
    </div>

    <div v-if="showPendingRequests" class="fixed inset-0 z-[140] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closePendingRequests"></div>
      <div class="relative w-[92%] max-w-2xl rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-red-500/30 overflow-hidden">
        <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-rose-500"></div>
        <div class="p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-red-400">Permintaan Guru</p>
              <h3 class="text-xl font-semibold mt-2">Konfirmasi Akun Guru</h3>
              <p class="text-sm text-slate-300 mt-2">Setujui untuk mengaktifkan akun guru.</p>
            </div>
            <button class="text-slate-400 hover:text-white" @click="closePendingRequests">✕</button>
          </div>

          <div class="mt-6 space-y-3 max-h-[60vh] overflow-y-auto">
            <div
              v-for="req in pendingTeacherRequests"
              :key="req.id"
              class="flex items-center justify-between gap-4 bg-slate-900/70 border border-white/10 rounded-xl px-4 py-3"
            >
              <div>
                <div class="font-semibold text-white">{{ req.full_name }}</div>
                <div class="text-xs text-slate-400">NIP {{ req.nip }} • {{ req.school }}</div>
                <div class="text-[10px] text-slate-500 mt-1">
                  {{ formatRequestTime(req) }}
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500 text-black hover:bg-emerald-400"
                  @click="approveRequest(req)"
                >
                  Konfirmasi
                </button>
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800 hover:bg-slate-700"
                  @click="rejectRequest(req)"
                >
                  Tolak
                </button>
              </div>
            </div>

            <div v-if="!pendingTeacherRequests.length" class="text-sm text-slate-400 text-center py-6">
              Tidak ada permintaan baru.
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import { fetchBillingSummary, fetchTeacherExemptions, fetchBillingPayments } from '../utils/billing';
import { getTeacherAccounts } from '../utils/teachers';
import { clearStaffUser, getStaffActorId, getStaffUser } from '../utils/auth';
import { useDialog } from '../utils/dialog';
import { approveTeacherRequest, fetchPendingTeacherRequests, rejectTeacherRequest } from '../utils/teacherRequests';
import type { TeacherRequest } from '../utils/teacherRequests';

const stats = ref<any>({});
const loading = ref(true);
const recentActivity = ref<any[]>([]);
const activityLoading = ref(true);
const billingSummary = ref<any>(null);
const billingLoading = ref(false);
const FREE_STUDENT_QUOTA = 5;
const PRICE_PER_STUDENT = 1000;
const staffUser = getStaffUser();
const teacherId = staffUser?.nip || staffUser?.full_name || getStaffActorId(staffUser);
const teacherName = staffUser?.full_name || staffUser?.nip || '';
const router = useRouter();
const isGuru = computed(() => staffUser?.role === 'guru');
const isAdmin = computed(() => staffUser?.role === 'admin');
const unpaidTeachers = ref<{ key: string; name: string; total: number; unpaid: number }[]>([]);
const exemptTeacherIds = ref<Set<string>>(new Set());
const paymentNotice = ref('');
const paymentNoticeAt = ref('');
let guruPaymentInterval: number | undefined;
const dialog = useDialog();
const pendingTeacherRequests = ref<TeacherRequest[]>([]);
const showPendingRequests = ref(false);
const guruStudentTotal = ref<number | null>(null);
const formatRequestTime = (req: TeacherRequest) => {
    const timestamp = req.requested_at || req.created_at;
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString();
};

const totalStudentsForBilling = computed(() => {
    if (isGuru.value) {
        if (guruStudentTotal.value != null) return guruStudentTotal.value;
    }
    const statsTotalRaw = stats.value?.total_students;
    const statsTotal = statsTotalRaw == null ? null : Number(statsTotalRaw);
    if (statsTotal === 0) return 0;
    return Number(billingSummary.value?.total_students ?? statsTotal ?? 0);
});

const freeQuota = computed(() => {
    return Number(billingSummary.value?.free_quota ?? FREE_STUDENT_QUOTA);
});

const freeQuotaDisplay = computed(() => {
    if (totalStudentsForBilling.value === 0) return 0;
    return freeQuota.value;
});

const totalStudentsDisplay = computed(() => {
    if (isGuru.value) {
        if (guruStudentTotal.value != null) return guruStudentTotal.value;
        return totalStudentsForBilling.value;
    }
    return Number(stats.value?.total_students ?? 0);
});

const pricePerStudent = computed(() => {
    return Number(billingSummary.value?.price_per_student ?? PRICE_PER_STUDENT);
});

const paidStudentCount = computed(() => {
    const total = totalStudentsForBilling.value;
    return Math.max(0, total - freeQuota.value);
});

const averageScoreDisplay = computed(() => {
    const totalStudents = Number(stats.value?.total_students ?? 0);
    if (totalStudents === 0) return 0;

    const attemptKeys = [
        'quiz_attempts',
        'total_quiz_attempts',
        'total_quiz_submissions',
        'quiz_submissions',
        'total_quiz_taken'
    ];
    let attempts: number | null = null;
    for (const key of attemptKeys) {
        if (Object.prototype.hasOwnProperty.call(stats.value || {}, key)) {
            attempts = Number((stats.value as any)?.[key] ?? 0);
            break;
        }
    }
    if (attempts !== null && attempts <= 0) return 0;

    const average = Number(stats.value?.average_score ?? 0);
    return Number.isFinite(average) ? average : 0;
});

const billingAmount = computed(() => {
    if (totalStudentsForBilling.value === 0) return 0;
    if (!isGuru.value && billingSummary.value?.amount_due != null) {
        return Number(billingSummary.value.amount_due);
    }
    return paidStudentCount.value * pricePerStudent.value;
});
const overdueStudents = computed(() => (
    totalStudentsForBilling.value === 0 ? 0 : Number(billingSummary.value?.overdue_students ?? 0)
));

const getMoodEmoji = (mood: string) => {
    switch(mood) {
        case 'happy': return '😄';
        case 'neutral': return '😐';
        case 'confused': return '😕';
        case 'frustrated': return '😫';
        default: return '😐';
    }
};

const loadAnalytics = async () => {
    loading.value = true;
    try {
        const analyticsParams = isGuru.value
            ? {
                teacher_id: staffUser?.nip ? teacherId : undefined,
                teacher_name: !staffUser?.nip && teacherName ? teacherName : undefined,
            }
            : undefined;
        const analyticsRes = await api.get('/analytics', { params: analyticsParams });
        const reflectionsRes = isGuru.value ? null : await api.get('/reflections');
        const analytics = analyticsRes.data || {};
        const reflections = reflectionsRes
            ? Array.isArray(reflectionsRes.data)
                ? reflectionsRes.data
                : reflectionsRes.data?.data || []
            : [];

        const today = new Date();
        const todayKey = today.toISOString().slice(0, 10);
        const uniqueStudents = new Set<string>();

        reflections.forEach((ref: any) => {
            const createdAt = ref?.created_at;
            if (!createdAt) return;
            if (new Date(createdAt).toISOString().slice(0, 10) !== todayKey) return;
            const studentId = ref?.student?.id || ref?.student_id || ref?.student?.nisn || ref?.nisn;
            if (studentId) uniqueStudents.add(String(studentId));
        });

        stats.value = {
            ...analytics,
            today_reflections: isGuru.value ? analytics.today_reflections ?? 0 : uniqueStudents.size
        };
        await loadRecentActivity();
        await loadBillingSummary();
        await loadGuruStudentTotal();
        await loadTeacherBillingSnapshot();
    } catch (e) {
        console.error("Failed to load analytics", e);
    } finally {
        loading.value = false;
    }
};

const loadRecentActivity = async () => {
    activityLoading.value = true;
    try {
        const studentsRes = await api.get('/students', { params: { page: 1, limit: 20 } });
        const students = studentsRes.data?.data || [];
        const ids = students.map((s: any) => s.id).join(',');
        if (!ids) {
            recentActivity.value = [];
            return;
        }
        const activityRes = await api.get('/activity/latest', { params: { student_ids: ids } });
        const activity = Array.isArray(activityRes.data) ? activityRes.data : [];
        const map = new Map(students.map((s: any) => [s.id, s.full_name]));
        recentActivity.value = activity
            .map((row: any) => ({
                ...row,
                student_name: map.get(row.student_id) || 'Siswa'
            }))
            .slice(0, 6);
    } catch (e) {
        console.error("Failed to load recent activity", e);
        recentActivity.value = [];
    } finally {
        activityLoading.value = false;
    }
};

const formatDuration = (seconds?: number | null) => {
    if (!seconds || seconds <= 0) return 'Durasi tidak tersedia';
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    if (mins < 1) return `${secs}s`;
    return `${mins}m ${secs}s`;
};

const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(value);
};

const deleteReflection = async (reflectionId: string) => {
    const ok = await dialog.confirm('Hapus jurnal refleksi ini?', 'Hapus Jurnal');
    if (!ok) return;
    try {
        await api.delete(`/reflections/${reflectionId}`);
        await loadAnalytics();
    } catch (e: any) {
        console.error("Failed to delete reflection", e);
        await dialog.alert('Gagal menghapus jurnal: ' + (e.response?.data?.error || e.message || e));
    }
};

const loadBillingSummary = async () => {
    billingLoading.value = true;
    try {
        const summary = await fetchBillingSummary(teacherId);
        if (summary) billingSummary.value = summary;
    } finally {
        billingLoading.value = false;
    }
};

const loadGuruStudentTotal = async () => {
    if (!isGuru.value) return;
    try {
        const params = {
            page: 1,
            limit: 1,
            teacher_id: staffUser?.nip ? teacherId : undefined,
            teacher_name: !staffUser?.nip && teacherName ? teacherName : undefined,
        };
        let data = (await api.get('/students', { params })).data;
        let total = Number(data?.total ?? 0);
        if (total === 0 && teacherName) {
            data = (await api.get('/students', {
                params: { page: 1, limit: 1, teacher_name: teacherName }
            })).data;
            total = Number(data?.total ?? 0);
        }
        guruStudentTotal.value = total;
    } catch {
        guruStudentTotal.value = 0;
    }
};

const handleGoToBilling = () => {
    router.push('/admin/students?pay=1');
};

const loadPaymentNotice = async () => {
    if (!isGuru.value) return;
    try {
        const rows = await fetchBillingPayments(teacherId, 1);
        const latest = rows[0];
        if (!latest) return;
        const lastKey = `latestPayment_${teacherId}`;
        const lastSeen = localStorage.getItem(lastKey);
        const createdAt = latest.createdAt || latest.created_at;
        if (createdAt && createdAt !== lastSeen) {
            paymentNotice.value = `Pembayaran dikonfirmasi: Rp ${latest.amount}`;
            paymentNoticeAt.value = createdAt;
            localStorage.setItem(lastKey, createdAt);
        }
    } catch (e) {
        // ignore
    }
};

const loadTeacherBillingSnapshot = async () => {
    if (!isAdmin.value) return;
    try {
        const [studentsRes, exemptions, teachers] = await Promise.all([
            api.get('/students', { params: { page: 1, limit: 5000 } }),
            fetchTeacherExemptions(),
            getTeacherAccounts()
        ]);
        const teacherNameByNip = new Map<string, string>();
        (teachers || []).forEach((teacher: any) => {
            if (teacher?.nip) teacherNameByNip.set(teacher.nip, teacher.full_name || teacher.nip);
        });
        const normalizedExemptions = (exemptions || []).map((row: any) => {
            const teacherId = row.teacherId || row.teacher_id || '';
            const teacherName =
                row.teacherName ||
                row.teacher_name ||
                (teacherId ? teacherNameByNip.get(teacherId) : null) ||
                '';
            return {
                teacherId,
                teacherName: teacherName ? teacherName.toLowerCase() : ''
            };
        });
        exemptTeacherIds.value = new Set(
            normalizedExemptions.map((row) => row.teacherId).filter(Boolean)
        );
        const exemptTeacherNames = new Set(
            normalizedExemptions.map((row) => row.teacherName).filter(Boolean)
        );
        const { data } = studentsRes;
        const students = data?.data || data || [];
        const map = new Map<string, { name: string; total: number }>();
        students.forEach((student: any) => {
            const teacherName = student.teacher_name || student.teacherName;
            const teacherId = student.teacher_id || student.teacherId;
            const key = teacherId || teacherName;
            if (!key) return;
            const normalizedTeacherName = teacherName ? String(teacherName).toLowerCase() : '';
            if (exemptTeacherIds.value.has(teacherId || key)) return;
            if (normalizedTeacherName && exemptTeacherNames.has(normalizedTeacherName)) return;
            const name = teacherName || teacherId || 'Guru';
            const entry = map.get(key) || { name, total: 0 };
            entry.total += 1;
            entry.name = name;
            map.set(key, entry);
        });
        unpaidTeachers.value = Array.from(map.entries())
            .map(([key, value]) => ({
                key,
                name: value.name,
                total: value.total,
                unpaid: Math.max(0, value.total - FREE_STUDENT_QUOTA)
            }))
            .filter((item) => item.unpaid > 0)
            .sort((a, b) => b.unpaid - a.unpaid || b.total - a.total);
    } catch (e) {
        unpaidTeachers.value = [];
    }
};

const loadPendingTeacherRequests = async () => {
    if (!isAdmin.value) return;
    try {
        pendingTeacherRequests.value = await fetchPendingTeacherRequests();
    } catch {
        pendingTeacherRequests.value = [];
    }
};

const openPendingRequests = () => {
    loadPendingTeacherRequests();
    showPendingRequests.value = true;
};

const closePendingRequests = () => {
    showPendingRequests.value = false;
};

const approveRequest = async (req: TeacherRequest) => {
    const ok = await dialog.confirm(
        `Aktifkan akun guru untuk ${req.full_name}?`,
        'Konfirmasi Akun Guru',
        'Aktifkan',
        'Batal',
        'success'
    );
    if (!ok) return;
    try {
        await approveTeacherRequest(req.id);
        await loadPendingTeacherRequests();
        await dialog.alert('Akun guru berhasil diaktifkan.', 'Sukses', 'success');
    } catch (e: any) {
        await dialog.alert(
            e?.response?.data?.error || e?.message || 'Gagal mengaktifkan akun guru.',
            'Gagal',
            'danger'
        );
    }
};

const rejectRequest = async (req: TeacherRequest) => {
    const ok = await dialog.confirm(
        `Tolak permintaan akun dari ${req.full_name}?`,
        'Tolak Permintaan',
        'Tolak',
        'Batal',
        'warning'
    );
    if (!ok) return;
    await rejectTeacherRequest(req.id);
    await loadPendingTeacherRequests();
    await dialog.alert('Permintaan dihapus.', 'Info', 'info');
};


const handleLogout = () => {
    clearStaffUser();
    router.push('/login');
};

onMounted(loadAnalytics);
onMounted(() => {
    if (isGuru.value) {
        loadPaymentNotice();
        guruPaymentInterval = window.setInterval(loadPaymentNotice, 8000);
    }
    if (isAdmin.value) {
        loadPendingTeacherRequests();
    }
});

onUnmounted(() => {
    if (guruPaymentInterval) {
        clearInterval(guruPaymentInterval);
    }
});
</script>
