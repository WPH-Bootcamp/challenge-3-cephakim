[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/L5QgqEe3)
# HABIT TRACKER CLI - CHALLENGE 3

## DESKRIPSI ASSIGNMENT

Anda ditugaskan untuk membuat aplikasi Command Line Interface (CLI) untuk melacak kebiasaan harian. Aplikasi ini akan mendemonstrasikan pemahaman Anda tentang konsep-konsep JavaScript fundamental tanpa menggunakan DOM manipulation.

---

## TUJUAN PEMBELAJARAN

Setelah menyelesaikan assignment ini, Anda diharapkan dapat:

1. Memahami dan mengimplementasikan objek dasar dan class di JavaScript
2. Mengelola data menggunakan Array dan metode-metodenya
3. Memanipulasi tanggal menggunakan Date object
4. Menggunakan setInterval untuk automasi
5. Menyimpan dan memuat data dengan JSON
6. Menerapkan nullish coalescing operator
7. Mengimplementasikan while dan for loop
8. Membuat aplikasi CLI interaktif dengan Node.js

---

## KONSEP YANG HARUS DIIMPLEMENTASIKAN

Assignment ini WAJIB mencakup konsep-konsep berikut:

1. Objek dasar (Class dan Object)
2. Array (List data)
3. Metode Array: filter, map, find, forEach
4. Date (Manipulasi tanggal)
5. setInterval (Timer otomatis)
6. JSON.stringify dan JSON.parse (Penyimpanan data)
7. Nullish coalescing operator (??)
8. while loop dan for loop

---

## FITUR APLIKASI YANG HARUS DIBUAT

Aplikasi Anda harus memiliki 10 menu dengan fitur berikut:

1. Lihat Profil - Menampilkan informasi user dan statistik
2. Lihat Semua Kebiasaan - List semua habits dengan progress bar
3. Lihat Kebiasaan Aktif - Filter habits yang belum selesai
4. Lihat Kebiasaan Selesai - Filter habits yang sudah mencapai target
5. Tambah Kebiasaan Baru - Input nama dan target per minggu
6. Tandai Kebiasaan Selesai - Mark habit selesai untuk hari ini
7. Hapus Kebiasaan - Delete habit dari list
8. Lihat Statistik - Tampilkan summary dengan array methods
9. Demo Loop - Demonstrasi while dan for loop
0. Keluar - Exit aplikasi

Fitur Tambahan:
- Reminder otomatis setiap 10 detik
- Data persistence menggunakan JSON file
- Progress bar ASCII untuk visualisasi

---

## PANDUAN PENGERJAAN STEP BY STEP

### TAHAP 1: SETUP PROJECT (15 menit)

1. Pastikan Node.js sudah terinstall
   ```bash
   node --version
   ```

2. Buat file app.js

3. Import module yang diperlukan:
   ```javascript
   const readline = require('readline');
   const fs = require('fs');
   const path = require('path');
   ```

4. Definisikan konstanta:
   ```javascript
   const DATA_FILE = path.join(__dirname, 'habits-data.json');
   const REMINDER_INTERVAL = 10000; // 10 detik
   const DAYS_IN_WEEK = 7;
   ```

5. Setup readline interface:
   ```javascript
   const rl = readline.createInterface({
       input: process.stdin,
       output: process.stdout
   });
   ```

### TAHAP 2: BUAT USER PROFILE OBJECT (20 menit)

Implementasi object untuk profil pengguna dengan method updateStats dan getDaysJoined.

KONSEP YANG DIGUNAKAN: Objek Dasar, Date, filter()

### TAHAP 3: BUAT HABIT CLASS (30 menit)

Implementasi class untuk satu kebiasaan dengan properties:
- id, name, targetFrequency, completions (array), createdAt

Methods yang harus ada:
- markComplete()
- getThisWeekCompletions()
- isCompletedThisWeek()
- getProgressPercentage()
- getStatus()

KONSEP YANG DIGUNAKAN: Class, Array, Date, filter(), find()

### TAHAP 4: BUAT HABIT TRACKER CLASS (60 menit)

Class utama untuk mengelola aplikasi dengan methods:

CRUD Operations:
- addHabit(name, frequency)
- completeHabit(habitIndex)
- deleteHabit(habitIndex)

Display Methods:
- displayProfile()
- displayHabits(filter)
- displayHabitsWithWhile()
- displayHabitsWithFor()
- displayStats()

Reminder System:
- startReminder()
- showReminder()
- stopReminder()

File Operations:
- saveToFile()
- loadFromFile()
- clearAllData()

KONSEP YANG DIGUNAKAN: Class, Array, filter(), map(), find(), forEach(), Date, setInterval, JSON, Nullish coalescing

### TAHAP 5: BUAT CLI INTERFACE (30 menit)

Fungsi untuk interaksi dengan user:
- askQuestion(question) - Return Promise untuk input
- displayMenu() - Tampilkan menu 0-9
- handleMenu(tracker) - Handle pilihan user dengan switch-case

### TAHAP 6: BUAT MAIN FUNCTION (15 menit)

Fungsi utama untuk menjalankan aplikasi:
- Tampilkan banner
- Buat instance HabitTracker
- Optional: Tambah data demo
- Panggil handleMenu(tracker)

### TAHAP 7: TESTING (30 menit)

Test aplikasi dengan skenario:
1. Jalankan aplikasi
2. Tambah data demo
3. Test setiap menu
4. Cek reminder muncul setiap 10 detik
5. Restart app untuk cek persistence

---

## KRITERIA PENILAIAN

Total: 100 poin

### 1. IMPLEMENTASI KONSEP (70 poin)

- Objek dasar (Class Habit dan Object userProfile): 10 poin
- Array untuk menyimpan data: 5 poin
- Metode filter() min 3 tempat: 10 poin
- Metode map() untuk transform data: 10 poin
- Metode find() untuk search: 5 poin
- Metode forEach() untuk iteration: 5 poin
- Date object dan manipulasi: 10 poin
- setInterval untuk reminder: 5 poin
- JSON.stringify dan JSON.parse: 5 poin
- Nullish coalescing operator min 3 tempat: 5 poin
- while loop: 2.5 poin
- for loop: 2.5 poin

### 2. FUNGSIONALITAS (20 poin)

- Aplikasi berjalan tanpa error: 5 poin
- Semua 10 menu berfungsi dengan benar: 10 poin
- Data tersimpan dan termuat dengan benar: 5 poin

### 3. CODE QUALITY (10 poin)

- Code rapi dan terstruktur: 3 poin
- Penamaan variabel yang jelas: 3 poin
- Komentar yang memadai: 4 poin

### BONUS (Opsional, maksimal +15 poin)

- Streak counter: +5 poin
- Kategori habits: +5 poin
- Export data: +5 poin
- History view: +5 poin
- Multiple users: +10 poin

---

## KETENTUAN PENGERJAAN

1. Assignment ini INDIVIDUAL (dikerjakan sendiri)
2. Deadline pengumpulan: (akan ditentukan oleh instruktur)
3. Format pengumpulan: File app.js dan habits-data.json (jika ada)
4. Dilarang copy-paste dari sumber lain
5. Wajib ada komentar di setiap bagian penting
6. Jika ada referensi, wajib dicantumkan

---

## CARA MENJALANKAN

1. Pastikan Node.js sudah terinstall
   ```bash
   node --version
   ```

2. Buka terminal/command prompt

3. Masuk ke folder project Anda
   ```bash
   cd path/to/your/project
   ```

4. Jalankan aplikasi
   ```bash
   node app.js
   ```

5. Ikuti instruksi di layar

---

## CONTOH OUTPUT

### Menu Utama
```
==================================================
HABIT TRACKER - MAIN MENU
==================================================
1. Lihat Profil
2. Lihat Semua Kebiasaan
3. Lihat Kebiasaan Aktif
4. Lihat Kebiasaan Selesai
5. Tambah Kebiasaan Baru
6. Tandai Kebiasaan Selesai
7. Hapus Kebiasaan
8. Lihat Statistik
9. Demo Loop (while/for)
0. Keluar
==================================================
```

### Contoh Tampilan Habits
```
1. [Aktif] Minum Air 8 Gelas
   Target: 7x/minggu
   Progress: 3/7 (43%)
   Progress Bar: ████░░░░░░ 43%

2. [Selesai] Baca Buku 30 Menit
   Target: 5x/minggu
   Progress: 5/5 (100%)
   Progress Bar: ██████████ 100%
```

### Contoh Reminder
```
==================================================
REMINDER: Jangan lupa "Minum Air 8 Gelas"!
==================================================
```

---

## CONTOH IMPLEMENTASI KONSEP

### 1. Nullish Coalescing
```javascript
const habit = this.habits[index - 1] ?? null;
const name = data.name ?? 'Default';
```

### 2. Filter
```javascript
const activeHabits = this.habits.filter(h => !h.isCompletedThisWeek());
```

### 3. Map
```javascript
const habitNames = this.habits.map(h => h.name);
```

### 4. Find
```javascript
const habit = this.habits.find(h => h.id === habitId);
```

### 5. forEach
```javascript
this.habits.forEach(habit => {
    console.log(habit.name);
});
```

### 6. While Loop
```javascript
let i = 0;
while (i < this.habits.length) {
    console.log(this.habits[i].name);
    i++;
}
```

### 7. For Loop
```javascript
for (let i = 0; i < this.habits.length; i++) {
    console.log(this.habits[i].name);
}
```

### 8. setInterval
```javascript
setInterval(() => {
    this.showReminder();
}, 10000);
```

### 9. JSON Operations
```javascript
// Save
const jsonData = JSON.stringify(data, null, 2);
fs.writeFileSync(DATA_FILE, jsonData);

// Load
const jsonData = fs.readFileSync(DATA_FILE, 'utf8');
const data = JSON.parse(jsonData);
```

---

## TROUBLESHOOTING

### Error: Cannot find module readline
- Pastikan menggunakan Node.js, bukan browser
- Install Node.js dari nodejs.org

### Error: EACCES permission denied
- Pastikan folder memiliki write permission
- Coba jalankan terminal sebagai administrator

### Data tidak tersimpan
- Cek apakah file habits-data.json terbuat
- Pastikan tidak ada error saat panggil saveToFile()

### Reminder tidak muncul
- Pastikan ada habit yang belum diselesaikan hari ini
- Tunggu minimal 10 detik

### Input tidak terbaca
- Pastikan menggunakan readline dengan benar
- Gunakan Promise dengan resolve()

---

## TIPS PENGERJAAN

1. Kerjakan step by step sesuai panduan
2. Test setiap fungsi setelah selesai dibuat
3. Gunakan console.log() untuk debugging
4. Baca error message dengan teliti
5. Backup code Anda secara berkala
6. Test di berbagai skenario

---

## CHECKLIST SEBELUM SUBMIT

[ ] Implementasi semua 8 konsep yang diminta
[ ] Semua 10 menu berfungsi dengan benar
[ ] Aplikasi berjalan tanpa error
[ ] Code memiliki komentar yang cukup
[ ] File app.js dapat dijalankan dengan: node app.js
[ ] Data tersimpan dan termuat dengan benar
[ ] Reminder muncul setiap 10 detik
[ ] While loop dan for loop terdemonstrasikan
[ ] Nullish coalescing digunakan minimal 3 tempat

---

## REFERENSI BELAJAR

### Array Methods
- filter(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
- map(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
- find(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
- forEach(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

### JavaScript Concepts
- Date: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
- setInterval: https://developer.mozilla.org/en-US/docs/Web/API/setInterval
- JSON.stringify(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
- JSON.parse(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
- Nullish Coalescing: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing

### Node.js Modules
- Readline: https://nodejs.org/api/readline.html
- File System: https://nodejs.org/api/fs.html

---

## FAQ

Q: Apakah boleh menggunakan library tambahan?
A: Tidak. Gunakan hanya module bawaan Node.js (readline, fs, path)

Q: Apakah harus sama persis dengan contoh?
A: Tidak harus. Yang penting semua konsep dan fitur terimplementasi

Q: Bagaimana cara menampilkan progress bar ASCII?
A: Gunakan karakter seperti █ untuk fill dan ░ untuk empty

Q: Boleh bertanya ke teman?
A: Boleh diskusi konsep, tapi code harus tulis sendiri

Q: File habits-data.json harus disubmit?
A: Opsional. Yang penting app.js bisa generate file tersebut

---

## STRUKTUR FILE PROJECT

```
challenge-3/
├── app.js              # File utama yang Anda kerjakan
├── habits-data.json    # File data (akan dibuat otomatis)
├── app-template.js     # Template kosong untuk memulai
└── README.md           # Dokumentasi (file ini)
```

---

## KONTAK

Jika ada pertanyaan mengenai assignment ini, hubungi:
- Instruktur: (akan diisi)
- Email: (akan diisi)
- Office Hours: (akan diisi)

---

SELAMAT MENGERJAKAN!
# challenge-3-batch-3-rep
