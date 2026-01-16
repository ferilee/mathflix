# Mathflix Admin Dashboard

A Vue 3 + Vite Admin Dashboard for the SMK Math Platform.

## Features
- **Tech Stack**: Vue 3, Vite, Tailwind CSS, TypeScript.
- **Rich Text Editing**: Quill Editor (`@vueup/vue-quill`).
- **Math Rendering**: KaTeX (`katex`) for displaying LaTeX formulas.
- **Components**:
  - `MathRenderer.vue`: Reusable component for rendering HTML + LaTeX.
  - Admin Layout with Sidebar.
- **Modules**:
  - **Siswa**: Manage students.
  - **Materi**: Create learning materials with rich text and math preview.
  - **Kuis**: Manage quizzes and questions with math support.

## Prerequisites
- Node.js & npm (or Bun)
- Backend API running on `http://localhost:3000` (configurable in `.env`)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configuration**
   Check `.env` file:
   ```
   VITE_API_URL=http://localhost:3000
   ```
   The dev server is configured to run on port `9001` in `vite.config.ts`.

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Access the dashboard at `http://localhost:9001`.

4. **Build for Production**
   ```bash
   npm run build
   ```
# mathflix
