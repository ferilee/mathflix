const DEMO_MODE_KEY = "demo_mode";
const DEMO_REFLECTIONS_KEY = "demo_reflections";
const DEMO_ASSIGNMENT_SUBMISSIONS_KEY = "demo_assignment_submissions";

export const demoStudent = {
  id: "demo-student",
  nisn: "DEMO-1001",
  full_name: "Siswa Demo",
  major: "TKJ",
  grade_level: 10,
};

export const demoMaterials = [
  {
    id: "demo-mat-1",
    title: "Fungsi Linear: Dasar dan Penerapan",
    description: "Memahami gradien, titik potong, dan contoh nyata.",
    content: `
      <div data-stage="discover">
        <h3>Discover</h3>
        <p>Kenali bentuk umum fungsi linear: y = mx + b.</p>
      </div>
      <div data-stage="explore">
        <h3>Explore</h3>
        <p>Pelajari makna gradien dan titik potong sumbu.</p>
      </div>
      <div data-stage="launch">
        <h3>Launch</h3>
        <p>Contoh penerapan: biaya tetap dan biaya per unit.</p>
      </div>
      <div data-stage="transform">
        <h3>Transform</h3>
        <p>Coba refleksi: kapan model linear tidak cocok?</p>
      </div>
      <div data-stage="assess">
        <h3>Assess</h3>
        <p>Uji pemahaman dengan kuis singkat.</p>
      </div>
    `,
    major_target: "TKJ",
    image_url: "",
  },
  {
    id: "demo-mat-2",
    title: "Sistem Persamaan Linear",
    description: "Metode substitusi dan eliminasi.",
    content: `
      <div data-stage="discover">
        <h3>Discover</h3>
        <p>Pengenalan sistem dua variabel.</p>
      </div>
      <div data-stage="explore">
        <h3>Explore</h3>
        <p>Metode substitusi dan eliminasi.</p>
      </div>
      <div data-stage="launch">
        <h3>Launch</h3>
        <p>Aplikasi ke masalah sehari-hari.</p>
      </div>
      <div data-stage="transform">
        <h3>Transform</h3>
        <p>Bandingkan dua metode dan pilih yang efisien.</p>
      </div>
      <div data-stage="assess">
        <h3>Assess</h3>
        <p>Latihan pemecahan SPLDV.</p>
      </div>
    `,
    major_target: "TKJ",
    image_url: "",
  },
];

export const demoQuizzes = [
  {
    id: "demo-quiz-1",
    material_id: "demo-mat-1",
    title: "Kuis Fungsi Linear",
    passing_score: 75,
    style: "classic",
    questions: [
      {
        id: "dq1-q1",
        question_text: "Bentuk umum fungsi linear adalah...",
        question_type: "multiple_choice",
        options: ["y = ax^2 + bx + c", "y = mx + b", "y = a/x", "y = m/x + b"],
        correct_answer: "y = mx + b",
      },
      {
        id: "dq1-q2",
        question_text: "Gradien adalah...",
        question_type: "multiple_choice",
        options: ["Titik potong", "Kemiringan garis", "Luas", "Keliling"],
        correct_answer: "Kemiringan garis",
      },
      {
        id: "dq1-q3",
        question_text: "Jika m = 2, maka garis semakin...",
        question_type: "multiple_choice",
        options: ["Landai", "Tegak", "Curam", "Mendatar"],
        correct_answer: "Curam",
      },
    ],
  },
  {
    id: "demo-quiz-2",
    material_id: "demo-mat-2",
    title: "Kuis SPLDV",
    passing_score: 70,
    style: "millionaire",
    questions: [
      {
        id: "dq2-q1",
        question_text: "Metode eliminasi bertujuan untuk...",
        question_type: "multiple_choice",
        options: [
          "Menambah variabel",
          "Menghilangkan variabel",
          "Mengganti variabel",
          "Menggambar grafik",
        ],
        correct_answer: "Menghilangkan variabel",
      },
      {
        id: "dq2-q2",
        question_text: "SPLDV berarti...",
        question_type: "multiple_choice",
        options: [
          "Sistem Persamaan Linear Dua Variabel",
          "Sistem Persamaan Linear Dua Bilangan",
          "Sistem Pertidaksamaan Linear",
          "Sistem Persamaan Kuadrat",
        ],
        correct_answer: "Sistem Persamaan Linear Dua Variabel",
      },
      {
        id: "dq2-q3",
        question_text: "Jika dua garis berpotongan, maka SPLDV memiliki...",
        question_type: "multiple_choice",
        options: [
          "Tak hingga solusi",
          "Tidak ada solusi",
          "Satu solusi",
          "Dua solusi",
        ],
        correct_answer: "Satu solusi",
      },
    ],
  },
];

export const demoAssignments = [
  {
    id: "demo-asg-1",
    title: "Latihan Fungsi Linear",
    description: "Buat 3 contoh soal fungsi linear dan penyelesaiannya.",
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-asg-2",
    title: "SPLDV dalam Kehidupan",
    description: "Tulis 1 kasus SPLDV dan selesaikan.",
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const defaultReflections = [
  {
    id: "demo-ref-1",
    content: "Hari ini belajar fungsi linear dan cara menentukan gradien.",
    mood: "happy",
    topic: "Fungsi Linear",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

export const isDemoMode = () => localStorage.getItem(DEMO_MODE_KEY) === "true";

export const enableDemo = () => {
  localStorage.setItem(DEMO_MODE_KEY, "true");
  localStorage.setItem("student", JSON.stringify(demoStudent));
  if (!localStorage.getItem(DEMO_REFLECTIONS_KEY)) {
    localStorage.setItem(
      DEMO_REFLECTIONS_KEY,
      JSON.stringify(defaultReflections),
    );
  }
};

export const resetDemo = () => {
  localStorage.removeItem(DEMO_MODE_KEY);
  localStorage.removeItem(DEMO_REFLECTIONS_KEY);
  localStorage.removeItem(DEMO_ASSIGNMENT_SUBMISSIONS_KEY);
  localStorage.removeItem("student");
};

export const getDemoStudent = () => demoStudent;

export const getDemoMaterials = () => demoMaterials;

export const getDemoMaterialById = (id: string) =>
  demoMaterials.find((m) => m.id === id) || null;

export const getDemoQuizzes = () => demoQuizzes;

export const getDemoQuizById = (id: string) =>
  demoQuizzes.find((q) => q.id === id) || null;

export const getDemoAssignments = () => demoAssignments;

export const getDemoAssignmentById = (id: string) =>
  demoAssignments.find((a) => a.id === id) || null;

export const getDemoReflections = () => {
  const saved = localStorage.getItem(DEMO_REFLECTIONS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [...defaultReflections];
    }
  }
  return [...defaultReflections];
};

export const saveDemoReflections = (items: any[]) => {
  localStorage.setItem(DEMO_REFLECTIONS_KEY, JSON.stringify(items));
};

export const getDemoAssignmentSubmissions = () => {
  const saved = localStorage.getItem(DEMO_ASSIGNMENT_SUBMISSIONS_KEY);
  if (!saved) return {};
  try {
    return JSON.parse(saved);
  } catch {
    return {};
  }
};

export const saveDemoAssignmentSubmission = (
  assignmentId: string,
  payload: any,
) => {
  const current = getDemoAssignmentSubmissions();
  current[assignmentId] = payload;
  localStorage.setItem(
    DEMO_ASSIGNMENT_SUBMISSIONS_KEY,
    JSON.stringify(current),
  );
};

export const getDemoAssignmentSubmission = (assignmentId: string) => {
  const current = getDemoAssignmentSubmissions();
  return current[assignmentId] || null;
};

export const getDemoRecommendations = () => {
  const primary = demoMaterials[0];
  if (!primary) return [];
  return [
    {
      material_id: primary.id,
      title: primary.title,
      description: primary.description,
      image_url: primary.image_url,
      major_target: primary.major_target,
      reason: "Rekomendasi demo berdasarkan progres.",
    },
  ];
};

export const getDemoMaterialAnalytics = () => {
  return demoMaterials.map((m, idx) => ({
    material_id: m.id,
    title: m.title,
    progress_rate: 60 + idx * 10,
    average_score: 78 + idx * 3,
    pass_rate: 70 + idx * 5,
    active_students: 12 + idx * 2,
    total_students: 30,
  }));
};

export const getDemoMaterialAnalyticsDetail = (materialId: string) => {
  const material = demoMaterials.find((m) => m.id === materialId);
  if (!material) return null;
  return {
    material_id: material.id,
    title: material.title,
    progress_rate: 72,
    average_score: 82,
    pass_rate: 76,
    active_students: 16,
    total_students: 30,
    hardest_questions: [
      {
        question_id: "demo-hard-1",
        question_text: "Hitung $\\\\int_0^1 x^2 dx$",
        correct_rate: 35,
        attempts: 20,
      },
      {
        question_id: "demo-hard-2",
        question_text: "Gradien garis melalui (1,2) dan (3,8) adalah...",
        correct_rate: 42,
        attempts: 18,
      },
    ],
  };
};
