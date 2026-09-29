# Tugas 1 — RESTful API Reservasi Ruang Rapat

**Mahasiswa:** Yonathan Rinfi  
**NIM:** 2428240101  
**Kelas:** SI5B  
**Nomor Topik:** 28  
**Topik:** Coworking Space — Reservasi Ruang Rapat

## Deskripsi

RESTful API murni menggunakan Express.js untuk mengelola data reservasi ruang rapat. Data disimpan dalam array di memori sesuai ketentuan tugas, tanpa database dan tanpa halaman HTML.

## Endpoint

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/` | Informasi API |
| GET | `/meeting-reservations` | Mengambil semua reservasi |
| GET | `/meeting-reservations/:id` | Mengambil reservasi berdasarkan ID |
| GET | `/meeting-reservations?tanggal=2026-10-05` | Filter berdasarkan tanggal |
| POST | `/meeting-reservations` | Menambah reservasi |
| PUT | `/meeting-reservations/:id` | Mengganti seluruh data reservasi |
| DELETE | `/meeting-reservations/:id` | Menghapus reservasi |

Field wajib untuk POST dan PUT: `namaPemesan` (string), `ruang` (string), `tanggal` (`YYYY-MM-DD`), `jamMulai` (`HH:mm`), dan `durasiJam` (angka positif).

Contoh request body:

```json
{
  "namaPemesan": "PT Maju Digital",
  "ruang": "Ruang Kenanga",
  "tanggal": "2026-10-05",
  "jamMulai": "13:00",
  "durasiJam": 2
}
```

## Persyaratan dan menjalankan secara lokal

Project menggunakan Node.js 24 LTS. File `.nvmrc` membantu memilih versi tersebut jika memakai nvm.

```bash
nvm use
npm install
npm run dev
```

Server lokal berjalan di `http://localhost:3000`.

## Pengujian API

Import `postman_collection.json` ke Postman. Jalankan request pada URL lokal atau ganti base URL ke URL Vercel setelah deployment. Sertakan screenshot request, response JSON, dan status code pada laporan.

## GitHub dan Vercel

- Repository publik: `https://github.com/USERNAME/tugas1-restful-2428240101` (ganti `USERNAME` setelah repository dibuat)
- URL Vercel: belum dideploy

## Catatan

Karena penyimpanan menggunakan array dalam memori, perubahan data dapat kembali ke data awal setelah proses serverless Vercel berhenti atau dimulai ulang. Ini sesuai catatan tugas dan bukan penyimpanan permanen.
