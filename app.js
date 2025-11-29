// ============================================
// HABIT TRACKER MEMBACA AL-QUR'AN DAN DZIKIR
// ============================================
// NAMA: Cecep Abdul Hakim
// KELAS: WPH-REP-129
// TANGGAL: 09-11-2025
// DESKRIPSI: Aplikasi CLI untuk melacak kebiasaan membaca dan menghafal Al-Qur'an serta dzikir harian.
// FITUR: 10 menu, penyimpanan JSON, reminder tiap 10 detik,
//        progress bar ASCII, streak, kategori (Tilawah/Hafalan/Dzikir)

// ============================================
// IMPORT MODULE BAWAAN NODE.JS
// ============================================
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// ============================================
// KONSTANTA GLOBAL
// ============================================
const DATA_FILE = path.join(__dirname, 'habits-data.json');
const REMINDER_INTERVAL = 10000; // reminder setiap 10 detik
const DAYS_IN_WEEK = 7;
const PROGRESS_BAR_WIDTH = 12;

// ============================================
// SETUP READLINE INTERFACE UNTUK INPUT CLI
// ============================================
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fungsi helper untuk membuat input berbasis Promise
function askQuestion(q) {
  return new Promise((resolve) => rl.question(q, (ans) => resolve(ans)));
}

// ============================================
// FUNGSI UTILITAS UMUM
// ============================================

// Membuat ID unik untuk setiap habit
function generateId() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// Mengubah string ISO jadi objek Date
function parseDate(iso) {
  return iso ? new Date(iso) : null;
}

// Mengambil tanggal awal minggu (untuk hitung progress mingguan)
function getWeekStartDate() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(now.getDate() - (DAYS_IN_WEEK - 1));
  return start;
}

// ============================================
// OBJEK PROFIL PENGGUNA
// ============================================
const userProfile = {
  name: 'Cecep Abdul Hakim',
  joinDate: new Date().toISOString(),
  totalHabits: 0,
  completedThisWeek: 0,

  // Mengupdate statistik total kebiasaan dan yang selesai minggu ini
  updateStats(habits = []) {
    this.totalHabits = habits.length;
    this.completedThisWeek = habits.filter(
      (h) => h.isCompletedThisWeek && h.isCompletedThisWeek()
    ).length;
  },

  // Menghitung berapa hari sejak bergabung
  getDaysJoined() {
    const created = parseDate(this.joinDate) ?? new Date();
    const now = new Date();
    const diff = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    return diff;
  },
};

// ============================================
// CLASS: HABIT
// Menyimpan satu kebiasaan Al-Qur'an (tilawah, hafalan, dzikir)
// ============================================
class Habit {
  constructor({
    id = null,
    name = 'Tilawah',
    targetFrequency = 1,
    category = 'Tilawah',
    completions = [],
    createdAt = null,
    streak = 0,
  } = {}) {
    this.id = id ?? generateId();
    this.name = name ?? 'Tilawah';
    this.targetFrequency = Number(targetFrequency ?? 1);
    this.category = category ?? 'Tilawah';
    this.completions = completions ?? [];
    this.createdAt = createdAt ?? new Date().toISOString();
    this.streak = streak ?? 0;
  }

  // Tandai kebiasaan hari ini selesai
  markComplete() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isoToday = today.toISOString();

    const exists = this.completions.find((c) => {
      const d = new Date(c);
      d.setHours(0, 0, 0, 0);
      return d.toISOString() === isoToday;
    });
    if (exists) return false;

    this.completions.push(new Date().toISOString());
    // Jika kemarin juga selesai, streak bertambah
    if (this._wasCompletedYesterday()) this.streak += 1;
    else this.streak = 1;
    return true;
  }

  // Mengecek apakah kemarin juga ditandai selesai
  _wasCompletedYesterday() {
    const yesterday = new Date();
    yesterday.setHours(0, 0, 0, 0);
    yesterday.setDate(yesterday.getDate() - 1);
    const isoY = yesterday.toISOString();
    return this.completions.some((c) => {
      const d = new Date(c);
      d.setHours(0, 0, 0, 0);
      return d.toISOString() === isoY;
    });
  }

  // Mengambil daftar penyelesaian minggu ini
  getThisWeekCompletions() {
    const start = getWeekStartDate();
    return this.completions.filter((c) => new Date(c) >= start);
  }

  // Mengecek apakah habit sudah mencapai target mingguan
  isCompletedThisWeek() {
    return this.getThisWeekCompletions().length >= this.targetFrequency;
  }

  // Menghitung persentase progress habit
  getProgressPercentage() {
    const count = this.getThisWeekCompletions().length;
    const perc =
      this.targetFrequency <= 0
        ? 0
        : Math.min(100, Math.round((count / this.targetFrequency) * 100));
    return isNaN(perc) ? 0 : perc;
  }

  // Mendapatkan status habit (aktif / selesai)
  getStatus() {
    return this.isCompletedThisWeek() ? 'Selesai' : 'Aktif';
  }

  // Membuat progress bar berbentuk ASCII
  getProgressBar(width = PROGRESS_BAR_WIDTH) {
    const perc = this.getProgressPercentage();
    const filled = Math.round((perc / 100) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty) + ` ${perc}%`;
  }
}

// ============================================
// CLASS: HABIT TRACKER
// Menangani seluruh logika aplikasi dan daftar kebiasaan
// ============================================
class HabitTracker {
  constructor({ habits = [], user = userProfile } = {}) {
    this.habits = (habits ?? []).map((h) => new Habit(h));
    this.user = user ?? userProfile;
    this.reminderId = null;
    this.user.updateStats(this.habits);
  }

  // Menambahkan habit baru ke daftar
  addHabit(name, frequency = 1, category = 'Tilawah') {
    const h = new Habit({ name, targetFrequency: frequency, category });
    this.habits.push(h);
    this.user.updateStats(this.habits);
    this.saveToFile();
    return h;
  }

  // Menandai habit tertentu sudah selesai hari ini
  completeHabit(index) {
    const habit = this.habits[index];
    if (!habit) return { ok: false, message: 'Habit tidak ditemukan' };
    const ok = habit.markComplete();
    if (ok) {
      this.user.updateStats(this.habits);
      this.saveToFile();
      return {
        ok: true,
        message: `Habit "${habit.name}" ditandai selesai hari ini.`,
      };
    }
    return {
      ok: false,
      message: `Habit "${habit.name}" sudah ditandai hari ini.`,
    };
  }

  // Menghapus habit dari daftar
  deleteHabit(index) {
    const habit = this.habits[index];
    if (!habit) return { ok: false, message: 'Habit tidak ditemukan' };
    this.habits.splice(index, 1);
    this.user.updateStats(this.habits);
    this.saveToFile();
    return { ok: true, message: `Habit "${habit.name}" dihapus.` };
  }

  // Menampilkan header menu
  displayBanner() {
    console.clear();
    console.log('==================================================');
    console.log("      HABIT TRACKER - MEMBACA AL-QUR'AN");
    console.log('==================================================');
  }

  // Menampilkan daftar menu utama
  displayMenu() {
    console.log('\n1. Lihat Profil');
    console.log('2. Lihat Semua Kebiasaan');
    console.log('3. Lihat Kebiasaan Aktif');
    console.log('4. Lihat Kebiasaan Selesai');
    console.log('5. Tambah Kebiasaan Baru');
    console.log('6. Tandai Kebiasaan Selesai');
    console.log('7. Hapus Kebiasaan');
    console.log('8. Lihat Statistik');
    console.log('9. Demo Loop (while/for)');
    console.log('0. Keluar');
  }

  // Menampilkan data profil pengguna
  displayProfile() {
    console.log('------------------- Profil -------------------');
    console.log(`Nama: ${this.user.name}`);
    console.log(`Bergabung: ${new Date(this.user.joinDate).toLocaleString()}`);
    console.log(`Hari sejak bergabung: ${this.user.getDaysJoined()}`);
    console.log(`Total habits: ${this.user.totalHabits}`);
    console.log(`Selesai minggu ini: ${this.user.completedThisWeek}`);
    console.log('-----------------------------------------------');
  }

  // Menampilkan daftar kebiasaan berdasarkan filter
  displayHabits(filter = 'all') {
    let list = this.habits;
    if (filter === 'active')
      list = this.habits.filter((h) => !h.isCompletedThisWeek());
    if (filter === 'done')
      list = this.habits.filter((h) => h.isCompletedThisWeek());

    if (list.length === 0) {
      console.log('Belum ada kebiasaan sesuai filter.');
      return;
    }

    list.forEach((h, idx) => {
      const cThisWeek = h.getThisWeekCompletions().length;
      console.log(`${idx + 1}. [${h.getStatus()}] ${h.name}`);
      console.log(`   Kategori: ${h.category}`);
      console.log(`   Target: ${h.targetFrequency}x/minggu`);
      console.log(
        `   Progress: ${cThisWeek}/${
          h.targetFrequency
        } (${h.getProgressPercentage()}%)`
      );
      console.log(`   Progress Bar: ${h.getProgressBar()}`);
      console.log(`   Streak: ${h.streak} hari`);
      console.log('');
    });
  }

  // Demo penggunaan while loop
  displayHabitsWithWhile() {
    console.log('\n--- Demo Perulangan While ---');
    let i = 0;
    while (i < this.habits.length) {
      const h = this.habits[i];
      console.log(
        `${i + 1}. ${h.name} - ${h.getStatus()} - ${h.getProgressBar()}`
      );
      i++;
    }
  }

  // Demo penggunaan for loop
  displayHabitsWithFor() {
    console.log('\n--- Demo Perulangan For ---');
    for (let i = 0; i < this.habits.length; i++) {
      const h = this.habits[i];
      console.log(
        `${i + 1}. ${h.name} - ${h.getStatus()} - ${h.getProgressBar()}`
      );
    }
  }

  // Menampilkan statistik keseluruhan habit
  displayStats() {
    console.log('------ Statistik ------');
    const total = this.habits.length;
    const done = this.habits.filter((h) => h.isCompletedThisWeek()).length;
    const active = total - done;
    const avgProgress =
      total === 0
        ? 0
        : Math.round(
            this.habits.reduce((a, h) => a + h.getProgressPercentage(), 0) /
              total
          );

    console.log(`Total habits: ${total}`);
    console.log(`Selesai minggu ini: ${done}`);
    console.log(`Masih aktif: ${active}`);
    console.log(`Rata-rata progress: ${avgProgress}%`);
    console.log('-----------------------');
  }

  // Menjalankan pengingat otomatis tiap 10 detik
  startReminder() {
    if (this.reminderId) return;
    this.reminderId = setInterval(() => this.showReminder(), REMINDER_INTERVAL);
  }

  // Menampilkan reminder kebiasaan yang belum selesai
  showReminder() {
    const active = this.habits.filter((h) => !h.isCompletedThisWeek());
    if (active.length === 0) return;
    console.log('\n==================================================');
    console.log("REMINDER: Tilawah Al-Qur'an yang belum selesai minggu ini:");
    active
      .slice(0, 3)
      .forEach((h) =>
        console.log(`- ${h.name} (Target: ${h.targetFrequency}/minggu)`)
      );
    console.log('==================================================');
  }

  // Menghentikan reminder
  stopReminder() {
    if (this.reminderId) {
      clearInterval(this.reminderId);
      this.reminderId = null;
    }
  }

  // Menyimpan data ke file JSON
  saveToFile() {
    try {
      const data = { user: this.user, habits: this.habits };
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('Gagal menyimpan data:', err.message);
    }
  }

  // Memuat data dari file JSON
  loadFromFile() {
    try {
      if (!fs.existsSync(DATA_FILE)) return;
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      this.user = Object.assign(this.user, parsed.user ?? {});
      this.habits = (parsed.habits ?? []).map((h) => new Habit(h));
      this.user.updateStats(this.habits);
    } catch (err) {
      console.error('Gagal memuat data:', err.message);
    }
  }

  // Menambahkan data demo awal jika belum ada
  seedDemoData() {
    if (this.habits.length > 0) return;
    this.addHabit('Tilawah: Juz 30', 7, 'Tilawah');
    this.addHabit('Tilawah: 1 Halaman', 5, 'Tilawah');
    this.addHabit('Hafalan: 5 Ayat', 3, 'Hafalan');
  }
}

// ============================================
// CONTROLLER MENU (LOGIKA ANTARMUKA PENGGUNA)
// ============================================
async function handleMenu(tracker) {
  let running = true;
  while (running) {
    tracker.displayBanner();
    tracker.displayMenu();
    const choice = (await askQuestion('Pilih menu (0-9): ')).trim();

    switch (choice) {
      case '1':
        tracker.displayProfile();
        await askQuestion('\nTekan Enter...');
        break;
      case '2':
        tracker.displayHabits('all');
        await askQuestion('\nTekan Enter...');
        break;
      case '3':
        tracker.displayHabits('active');
        await askQuestion('\nTekan Enter...');
        break;
      case '4':
        tracker.displayHabits('done');
        await askQuestion('\nTekan Enter...');
        break;
      case '5': {
        const name = (await askQuestion('Nama kebiasaan: ')).trim();
        const freqStr = (await askQuestion('Target per minggu: ')).trim();
        const cat =
          (await askQuestion('Kategori [Tilawah]: ')).trim() || 'Tilawah';
        const freq = parseInt(freqStr) || 1;
        if (!name) console.log('Nama tidak boleh kosong.');
        else {
          tracker.addHabit(name, freq, cat);
          console.log('Habit berhasil ditambahkan.');
        }
        await askQuestion('\nTekan Enter...');
        break;
      }
      case '6': {
        tracker.displayHabits('all');
        const idx = parseInt(
          (await askQuestion('Pilih nomor habit untuk tandai selesai: ')).trim()
        );
        if (!idx || idx < 1 || idx > tracker.habits.length)
          console.log('Pilihan tidak valid.');
        else {
          const res = tracker.completeHabit(idx - 1);
          console.log(res.message);
        }
        await askQuestion('\nTekan Enter...');
        break;
      }
      case '7': {
        tracker.displayHabits('all');
        const idx = parseInt(
          (await askQuestion('Pilih nomor habit untuk dihapus: ')).trim()
        );
        if (!idx || idx < 1 || idx > tracker.habits.length)
          console.log('Pilihan tidak valid.');
        else {
          const res = tracker.deleteHabit(idx - 1);
          console.log(res.message);
        }
        await askQuestion('\nTekan Enter...');
        break;
      }
      case '8':
        tracker.displayStats();
        await askQuestion('\nTekan Enter...');
        break;
      case '9':
        tracker.displayHabitsWithWhile();
        tracker.displayHabitsWithFor();
        await askQuestion('\nTekan Enter...');
        break;
      case '0':
        running = false;
        tracker.saveToFile();
        tracker.stopReminder();
        console.log('Keluar...');
        break;
      default:
        console.log('Pilihan tidak valid.');
        await askQuestion('\nTekan Enter...');
    }
  }
}

// ============================================
// FUNGSI UTAMA PROGRAM
// ============================================
async function main() {
  const tracker = new HabitTracker();
  tracker.loadFromFile();

  if (tracker.habits.length === 0) {
    console.log('Tidak ditemukan data. Menambahkan demo data...');
    tracker.seedDemoData();
  }

  const nameInput = (
    await askQuestion(`Nama kamu [${tracker.user.name}]: `)
  ).trim();
  tracker.user.name = nameInput || tracker.user.name;

  // Jalankan reminder dan menu utama
  tracker.startReminder();
  await handleMenu(tracker);

  rl.close();
  console.log("Terima kasih. Semoga istiqomah membaca Al-Qur'an.");
}

// Jalankan program dengan penanganan error
main().catch((err) => {
  console.error('Terjadi error:', err);
  rl.close();
});
