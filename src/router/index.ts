import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';
import Dashboard from '../views/Dashboard.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/student',
        component: () => import('../layouts/StudentLayout.vue'),
        children: [
            { path: '', component: () => import('../views/StudentDashboard.vue') },
            { path: 'quiz/:id', component: () => import('../views/StudentQuiz.vue') },
            { path: 'leaderboard', component: () => import('../views/Leaderboard.vue') },
            { path: 'my-list', component: () => import('../views/MyList.vue') },
            { path: 'material/:id', component: () => import('../views/StudentMaterialDetail.vue') },
            { path: 'announcements', component: () => import('../views/StudentAnnouncements.vue') },
            { path: 'discuss', component: () => import('../views/StudentDiscuss.vue') },
            { path: 'assignments', component: () => import('../views/StudentAssignments.vue') },
            { path: 'reflections', component: () => import('../views/StudentReflections.vue') },
            { path: 's-badges', component: () => import('../views/StudentBadges.vue') }
        ]
    },
    {
        path: '/',
        redirect: '/student'
    },
    {
        path: '/admin',
        component: AdminLayout,
        redirect: '/admin/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: Dashboard,
                meta: { title: 'Dashboard' }
            },
            {
                path: 'students',
                name: 'Students',
                component: () => import('../views/Students/StudentList.vue'),
                meta: { title: 'Manajemen Siswa' }
            },
            {
                path: 'materials',
                name: 'Materials',
                component: () => import('../views/Materials/MaterialList.vue'),
                meta: { title: 'Manajemen Materi' }
            },
            {
                path: 'materials/new',
                name: 'CreateMaterial',
                component: () => import('../views/Materials/MaterialForm.vue'),
                meta: { title: 'Tambah Materi' }
            },
            {
                path: 'materials/:id/edit',
                name: 'EditMaterial',
                component: () => import('../views/Materials/MaterialForm.vue'),
                meta: { title: 'Edit Materi' }
            },
            {
                path: 'quizzes',
                name: 'Quizzes',
                component: () => import('../views/Quizzes/QuizList.vue'),
                meta: { title: 'Manajemen Kuis' }
            },
            {
                path: 'quizzes/:id',
                name: 'QuizDetail',
                component: () => import('../views/Quizzes/QuizDetail.vue'),
                meta: { title: 'Detail Kuis' }
            },
            {
                path: 'quizzes/:quizId/questions/new',
                name: 'AddQuestion',
                component: () => import('../views/Quizzes/QuestionForm.vue'),
                meta: { title: 'Tambah Soal' }
            },
            {
                path: 'announcements',
                name: 'AdminAnnouncements',
                component: () => import('../views/AdminAnnouncements.vue'),
                meta: { title: 'Kelola Pengumuman' }
            },
            {
                path: 'discuss',
                name: 'AdminDiscuss',
                component: () => import('../views/AdminDiscuss.vue'),
                meta: { title: 'Moderasi Diskusi' }
            },
            {
                path: 'assignments',
                name: 'AdminAssignments',
                component: () => import('../views/AdminAssignments.vue'),
                meta: { title: 'Manajemen Tugas' }
            },
            {
                path: 'reflections',
                name: 'AdminReflections',
                component: () => import('../views/AdminReflections.vue'),
                meta: { title: 'Jurnal Siswa' }
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
