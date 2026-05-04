**Ringkasan Aplikasi: MathQuest (Gamified Class Management)**  
​Aplikasi ini menggabungkan stack teknis modern (Bun, Hono, Rustfs) dengan elemen RPG (Role-Playing Game) untuk menciptakan pengalaman belajar yang adiktif dan transparan.

​1. Konsep Visual & UI (Game Aesthetic)  
​Shadcn/UI Custom Styling: Menggunakan tema Dark Mode dengan aksen warna neon (seperti mana bar biru dan health bar merah) atau gaya Pixel Art yang bersih.  
​Dashboard sebagai "Character Sheet": Saat siswa login via Google, mereka tidak melihat tabel data, melainkan profil karakter mereka.  
​Status Bar Siswa:

* ​HP (Health Points): Mewakili kehadiran. Jika sering Alpa, HP berkurang.  
* ​XP (Experience Points): Bertambah dari nilai ujian dan tugas.  
* ​AP (Activity Points): Bertambah jika aktif bertanya atau maju ke depan kelas.

​2. Fitur Utama Bertema Game  
​A. Leaderboard of Heroes (Papan Pengumuman)  
​Bukan sekadar daftar nama, tapi peringkat "Pahlawan" di kelas:

* ​The Immortal: Gelar untuk siswa dengan kehadiran 100% (HP penuh).  
* ​The Scholar: Gelar untuk siswa dengan nilai tertinggi (XP tertinggi).  
* ​The Tactician: Gelar untuk siswa paling aktif (AP tertinggi).  
* ​The Underworld/Pit: Area introspeksi bagi siswa yang butuh "Healing" (remedial) karena nilai atau kehadiran yang kritis.

​B. Quest Log (Daftar Tugas & Absensi)

* ​Daily Quest: Hadir tepat waktu di kelas Matematika.  
* ​Main Quest: Menyelesaikan ujian bab dengan hasil di atas KKM.  
* ​Side Quest: Aktif membantu menjelaskan materi ke teman sekelas (mendapat ekstra AP).

​C. Rustfs sebagai "Inventory Bag"  
​Tempat siswa menyimpan "Item" mereka, yaitu dokumen tugas atau surat izin digital yang diunggah ke sistem penyimpanan cepat berbasis Rust.

​3. Mekanisme Introspeksi (Healing System)  
​Siswa yang masuk daftar "Nilai Kurang" akan mendapatkan status \[DEBUFF\] pada profil mereka. Untuk menghilangkan efek negatif tersebut, mereka harus menyelesaikan "Healing Quest" (Remedial). Ini mengubah kesan hukuman menjadi kesempatan untuk memulihkan status karakter mereka.

​4. Alur Kerja Aplikasi (The Game Loop)

* ​Login (Enter the World): Siswa masuk via Google OAuth. Jika Anda (Guru) sudah memasukkan mereka ke database, karakter mereka muncul.  
* ​Attendance (Daily Check-in): Anda melakukan absensi. Di layar siswa, mereka melihat HP mereka tetap terjaga karena hadir.  
* ​Activity (Battle Phase): Selama pelajaran, Anda menambah AP siswa yang aktif lewat dashboard Anda. Siswa bisa melihat poin mereka bertambah secara real-time.  
* ​Reporting (End of Level): Di akhir bab, Anda mengunggah nilai. Sistem secara otomatis memperbarui Leaderboard dan memberikan lencana (Badges) digital kepada yang terbaik.

​5. Pembaruan Skema Database (Gamified Drizzle)  
export const students \= sqliteTable("students", {  
  id: integer("id").primaryKey(),  
  userId: integer("user\_id").references(() \=\> users.id),  
  hp: integer("hp").default(100),         // Health (Kehadiran)  
  xp: integer("xp").default(0),           // Experience (Nilai)  
  ap: integer("ap").default(0),           // Activity Points (Keaktifan)  
  level: integer("level").default(1),  
  status: text("status").default("active"), // e.g., "Need Healing" untuk remedial  
});

