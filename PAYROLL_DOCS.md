# Modul Payroll

Bagian ini menjelaskan struktur, alur, dan tanggung jawab dari komponen-komponen yang mengelola fitur **Payroll** di dalam aplikasi. Seluruh file komponen antarmuka untuk fitur ini terpusat di dalam direktori `components/payroll/`.

## 1. PayrollSummary.tsx (The Controller / Otak)
Ini adalah komponen utama pengatur (*Smart Component*) untuk seluruh proses ringkasan penggajian di halaman Dashboard.
Tanggung jawab utamanya mencakup:
- **Penyaringan Data**: Memfilter data riwayat absensi (`attendances`) menggunakan logika *Backward Cut-off* berdasarkan bulan dan Karyawan (`getPayrollAttendances`).
- **Kalkulasi (Payroll Engine)**: Menghitung gaji pokok, uang lembur, potongan absen, dan bonus secara dinamis langsung di dalam loop komponen (eksplisit & akurat).
- **State Management (Cache)**: Sinkronisasi data form "Bonus" dan "Extra" melalui Hook `usePayrollAdjustments` yang tersimpan di `localStorage`.
- **Finalisasi Individual**: Menjalankan fungsi `finalizeEmployee` untuk merekam data gaji per karyawan ke dalam tabel `payroll_history` di database Supabase.
- **Rendering**: Melakukan *looping* (perulangan) data daftar karyawan dan memunculkan komponen `PayrollCard` untuk masing-masing individu.

## 2. PayrollCard.tsx (The Container)
Komponen pembungkus (*wrapper*) untuk UI kartu gaji masing-masing karyawan.
- Bertindak sebagai pengatur *state* visual lokal `isExpanded` (untuk melacak apakah detail kartu sedang dibuka atau ditutup oleh user).
- Menampilkan badge "FINALIZED" jika gaji karyawan tersebut sudah dibekukan/dikunci di bulan terkait.
- Menggabungkan `PayrollCardHeader` dan `PayrollCardDetails` menjadi satu kesatuan kartu bergaya *Neo Brutalism* dengan efek *hard shadow*.

## 3. PayrollCardHeader.tsx (The Header UI)
Komponen yang menampilkan ringkasan informasi di bagian atas kartu yang selalu terlihat.
- Menampilkan nama karyawan, jabatan (*badge* hitam brutalist), dan tipe pekerjaan (Freelance/Tetap).
- Menampilkan Total Gaji Akhir (*Final Salary*) dengan tipografi yang tebal (*bold*).
- Memiliki tombol interaktif panah ke bawah (dropdown) yang akan memutar animasinya sebesar 180 derajat ketika di-klik.

## 4. PayrollCardDetails.tsx (The Details UI)
Komponen konten yang hanya muncul ketika kartu gaji di-expand (dibuka).
- Menampilkan rincian perhitungan seperti: Gaji Pokok/Harian, Total Hari Kerja (Freelance), Uang Lembur (X Kali • Y Jam), dan Potongan Absen.
- Menyediakan *input field* angka untuk memasukkan **Bonus** dan **Extra (THR/Kasbon)**. Mendukung angka negatif untuk memasukkan kasbon karyawan.
- Berisi tombol aksi utama **"GENERATE SLIP"** untuk mengirimkan data ke komponen `SalarySlipCard` (mencetak slip gaji ke dalam format PDF/PNG atau via Email).
- Berisi tombol **"FINALIZE PAYROLL"** untuk menyimpan data histori karyawan secara independen.

## 5. PayrollAnalytics.tsx (The Overview / Dashboard Stats)
Komponen yang menampilkan ringkasan data penggajian secara keseluruhan (global) untuk bulan yang dipilih, posisinya berada di bagian paling atas halaman Dashboard.
Tanggung jawab utamanya mencakup:
- **Global Calculation**: Menghitung total keseluruhan *Payroll*, *Overtime*, *Bonus*, *Deduction*, dan *Attendance* dari seluruh karyawan secara *Live & Real-time*.
- **Smart History Logic**: Jika seorang karyawan sudah di-Finalize, Analytics akan otomatis membaca angkanya dari riwayat database agar datanya tetap permanen dan utuh.
- **Executive Summary UI**: Menampilkan angka "Total Payroll" perusahaan dengan tipografi angka besar yang tegas sebagai fokus utama (*focal point*) bergaya *Neo Brutalism*.
- **Collapsible Details**: Menyediakan fitur *dropdown* untuk membuka metrik rincian grid 5-kolom.

---

### Alur Data (Data Flow)
1. Data Mentah (Supabase) ditarik di `app/page.tsx` via Hooks Layer (`useEmployees`, dll).
2. Data dilempar secara bersamaan ke `PayrollSummary.tsx` (detail) dan `PayrollAnalytics.tsx` (ringkasan global).
3. Kedua komponen memfilter bulan aktif (Backward Cut-off), menghitung gaji, dan melacak Bonus/Kasbon via `usePayrollAdjustments`.
4. Hasil perhitungan didistribusikan ke `PayrollCard.tsx` dan `SalarySlipCard.tsx` untuk UI.
5. Aksi Finalize akan merekam data ke Supabase dan memperbarui lencana/status di seluruh aplikasi.