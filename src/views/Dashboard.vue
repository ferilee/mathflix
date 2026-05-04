<template>
  <div class="space-y-6">
    <!-- Header: Guild Master Dashboard -->
    <div class="bg-gradient-to-r from-slate-900 to-slate-800 border-l-4 border-amber-500 p-6 rounded-2xl shadow-lg shadow-black/40 flex justify-between items-center transition-colors backdrop-blur relative overflow-hidden">
      <div class="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
         <span class="text-8xl">👑</span>
      </div>
      <div class="relative z-10">
           <h2 class="text-3xl font-black mb-1 text-white uppercase tracking-widest drop-shadow-md">Guild Master Board</h2>
           <p class="text-slate-400 font-bold text-sm">Overview performa Hero (Siswa) dan pantauan aktivitas (Tahap Assess).</p>
      </div>
      <div class="relative z-10 flex items-center gap-3">
        <button @click="loadAnalytics" class="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-amber-400 px-4 py-2 rounded-lg text-sm font-black tracking-widest uppercase shadow-md active:translate-y-1 transition-all">Refresh Realm</button>
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
          <div class="font-semibold uppercase tracking-widest text-red-400">New Guild Master Request</div>
          <div class="text-xs text-red-200/70 mt-1">
            {{ pendingTeacherRequests.length }} permintaan menunggu konfirmasi.
          </div>
        </div>
        <button
          type="button"
          class="text-xs font-black px-4 py-2 rounded bg-red-600 text-white hover:bg-red-500 tracking-widest uppercase shadow-[0_4px_0_#991b1b] active:translate-y-1 active:shadow-none transition-all"
          @click="openPendingRequests"
        >
          Tinjau
        </button>
      </div>
    </div>

    <!-- Stats Row (RPG Style) -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div class="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:scale-110 transition-transform">🛡️</div>
            <h3 class="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-2 drop-shadow-sm">Total Heroes</h3>
            <div class="text-5xl font-black text-white drop-shadow-md">{{ totalStudentsDisplay }}</div>
            <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Siswa Terdaftar</div>
        </div>
        <div class="bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div class="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:scale-110 transition-transform">⚔️</div>
            <h3 class="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-2 drop-shadow-sm">Avg. Battle Prowess</h3>
            <div class="text-5xl font-black text-white drop-shadow-md">{{ averageScoreDisplay }}</div>
            <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Rata-rata Nilai (Target: 75)</div>
        </div>
        <div class="bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div class="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:scale-110 transition-transform">🏕️</div>
            <h3 class="text-purple-400 text-xs font-black uppercase tracking-[0.2em] mb-2 drop-shadow-sm">Campfire Stories</h3>
            <div class="text-5xl font-black text-white drop-shadow-md">{{ stats.today_reflections || 0 }}</div>
            <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Jurnal Refleksi Hari Ini</div>
        </div>
        <div class="bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div class="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:scale-110 transition-transform">💰</div>
            <h3 class="text-amber-400 text-xs font-black uppercase tracking-[0.2em] mb-2 drop-shadow-sm">Guild Treasury</h3>
            <div class="text-3xl font-black text-white drop-shadow-md">{{ formatRupiah(billingAmount) }}</div>
            <div class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Gratis {{ freeQuotaDisplay }} siswa ({{ freeClassDisplay }} kelas), {{ paidClassCount }} berbayar
              <span v-if="overdueStudents">• {{ overdueStudents }} tertunda</span>
            </div>
            <button
              v-if="billingAmount > 0"
              :disabled="billingLoading"
              @click="handleGoToBilling"
              class="mt-3 text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded bg-amber-500 text-black hover:bg-amber-400 shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none transition-all disabled:opacity-60 disabled:shadow-none disabled:translate-y-0"
            >
              {{ billingLoading ? 'Loading...' : 'Atur Pembayaran' }}
            </button>
        </div>
    </div>

    <div v-if="isAdmin && unpaidTeachers.length > 0" class="bg-slate-800 p-6 rounded-2xl shadow-xl border border-white/5">
      <div class="flex items-center justify-between mb-4">
        <div>
           <h3 class="font-black text-xl text-white uppercase tracking-widest">Guild Master Belum Bayar</h3>
           <p class="text-sm text-slate-400 font-bold">Lebih dari 1 kelas ({{ STUDENTS_PER_CLASS }} siswa) terdaftar.</p>
        </div>
        <router-link to="/admin/students" class="text-blue-400 text-sm font-bold uppercase tracking-widest hover:text-blue-300">Lihat Daftar Master</router-link>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="item in unpaidTeachers" :key="item.key" class="flex items-center justify-between bg-slate-900 border-l-4 border-amber-500 rounded-r-xl px-5 py-4 shadow-md">
          <div>
            <div class="text-sm font-black text-white">{{ item.name }}</div>
            <div class="text-xs text-slate-400 font-bold">{{ item.total }} siswa</div>
          </div>
          <div class="text-sm font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-md">
            {{ item.unpaid }} kelas unpaid
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Recent Reflections Feed -->
        <div class="lg:col-span-2 bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur flex flex-col">
            <div class="flex justify-between items-center mb-6">
                <h3 class="font-black text-xl text-white flex items-center gap-2 tracking-widest uppercase drop-shadow-md">
                   <span>🏕️</span> Campfire Stories (Jurnal)
                </h3>
                <router-link to="/admin/reflections" class="text-purple-400 font-bold text-xs uppercase tracking-widest hover:text-purple-300">Lihat Semua</router-link>
            </div>

            <div v-if="loading" class="text-slate-500 italic font-bold">Mendengarkan cerita...</div>
            <div v-else-if="stats.recent_reflections?.length === 0" class="text-slate-500 font-bold">Belum ada cerita hari ini.</div>

            <div v-else class="space-y-4 flex-1">
                <template v-for="ref in stats.recent_reflections" :key="ref.id">
                    <div v-if="ref.student" class="bg-slate-800/50 rounded-xl p-4 border border-white/5 shadow-inner">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <span class="font-black text-white text-sm tracking-wider">{{ ref.student.full_name }}</span>
                                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-2 bg-slate-900 px-2 py-0.5 rounded">Lvl {{ ref.student.grade_level }} {{ ref.student.major }}</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-2xl filter drop-shadow-md">{{ getMoodEmoji(ref.mood) }}</span>
                                <button
                                    type="button"
                                    class="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 bg-red-500/10 px-2 py-1 rounded"
                                    @click="deleteReflection(ref.id)"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                        <p class="text-slate-300 text-sm italic font-medium">"{{ ref.content }}"</p>
                        <div class="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-3">{{ new Date(ref.created_at).toLocaleString() }}</div>
                    </div>
                </template>
            </div>
        </div>

        <!-- At-Risk Monitor -->
        <div class="bg-slate-900/80 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur">
            <h3 class="font-black text-xl text-red-500 mb-2 flex items-center gap-2 tracking-widest uppercase drop-shadow-md">
                <span class="animate-pulse">⚠️</span> Heroes in Danger
            </h3>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Siswa dengan rata-rata Kuis < 60 (Terkena Debuff)</p>

            <div v-if="loading" class="text-slate-500 italic font-bold">Mencari hero yang terluka...</div>
            <div v-else-if="stats.at_risk_students?.length === 0" class="text-center py-10 bg-slate-800/50 rounded-xl border border-white/5">
                <div class="text-4xl mb-3 drop-shadow-md">🛡️</div>
                <div class="font-black text-emerald-400 uppercase tracking-widest text-sm">Semua Hero Aman!</div>
                <div class="text-xs text-slate-500 font-bold mt-1">Tidak ada yang terkena debuff.</div>
            </div>

            <div v-else class="space-y-3">
                 <div v-for="(student, idx) in stats.at_risk_students" :key="idx" class="flex justify-between items-center bg-red-950/40 border border-red-500/30 p-3 rounded-xl shadow-inner">
                     <span class="font-black text-red-200 text-sm truncate">{{ student.name }}</span>
                     <span class="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-md">Avg: {{ student.average }}</span>
                 </div>
            </div>
        </div>
    </div>

    <!-- Quick Navigation (RPG Menu) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link to="/admin/students" class="group bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-5 rounded-2xl text-center shadow-lg hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex flex-col items-center gap-2">
            <span class="text-3xl drop-shadow-md group-hover:scale-110 transition-transform">👥</span>
            <span class="font-black text-blue-400 uppercase tracking-widest text-[10px]">Manajemen Hero</span>
        </router-link>
        <router-link to="/admin/materials" class="group bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-5 rounded-2xl text-center shadow-lg hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex flex-col items-center gap-2">
            <span class="text-3xl drop-shadow-md group-hover:scale-110 transition-transform">📜</span>
            <span class="font-black text-emerald-400 uppercase tracking-widest text-[10px]">Quest & Regions</span>
        </router-link>
        <router-link to="/admin/quizzes" class="group bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-5 rounded-2xl text-center shadow-lg hover:border-rose-500 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all flex flex-col items-center gap-2">
            <span class="text-3xl drop-shadow-md group-hover:scale-110 transition-transform">☠️</span>
            <span class="font-black text-rose-400 uppercase tracking-widest text-[10px]">Boss Battles</span>
        </router-link>
        <router-link to="/admin/assignments" class="group bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-5 rounded-2xl text-center shadow-lg hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex flex-col items-center gap-2">
            <span class="text-3xl drop-shadow-md group-hover:scale-110 transition-transform">⚔️</span>
            <span class="font-black text-amber-400 uppercase tracking-widest text-[10px]">Bounties (Tugas)</span>
        </router-link>
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
import { getStaffActorId, getStaffUser } from '../utils/auth';
import { useDialog } from '../utils/dialog';
import { approveTeacherRequest, fetchPendingTeacherRequests, rejectTeacherRequest } from '../utils/teacherRequests';
import type { TeacherRequest } from '../utils/teacherRequests';

const stats = ref<any>({});
const loading = ref(true);
const recentActivity = ref<any[]>([]);
const activityLoading = ref(true);
const billingSummary = ref<any>(null);
const billingLoading = ref(false);
const FREE_CLASS_QUOTA = 1;
const STUDENTS_PER_CLASS = 30;
const PRICE_PER_CLASS = 49000;
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
    return Number(billingSummary.value?.free_quota ?? (FREE_CLASS_QUOTA * STUDENTS_PER_CLASS));
});

const freeQuotaDisplay = computed(() => {
    if (totalStudentsForBilling.value === 0) return 0;
    return freeQuota.value;
});

const freeClassDisplay = computed(() => {
    const override = billingSummary.value?.free_classes;
    if (override != null) return Number(override);
    return FREE_CLASS_QUOTA;
});

const totalStudentsDisplay = computed(() => {
    if (isGuru.value) {
        if (guruStudentTotal.value != null) return guruStudentTotal.value;
        return totalStudentsForBilling.value;
    }
    return Number(stats.value?.total_students ?? 0);
});

const pricePerClass = computed(() => {
    return Number(billingSummary.value?.price_per_class ?? PRICE_PER_CLASS);
});

const paidClassCount = computed(() => {
    const total = totalStudentsForBilling.value;
    const paidStudents = Math.max(0, total - freeQuota.value);
    return Math.ceil(paidStudents / STUDENTS_PER_CLASS);
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
    return paidClassCount.value * pricePerClass.value;
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
                unpaid: Math.ceil(Math.max(0, value.total - (FREE_CLASS_QUOTA * STUDENTS_PER_CLASS)) / STUDENTS_PER_CLASS)
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
