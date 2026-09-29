// Import Express untuk membuat server dan route API.
const express = require("express");

// Membuat aplikasi Express.
const app = express();

// Middleware agar Express bisa membaca request body berformat JSON.
app.use(express.json());

// Data reservasi awal disimpan di array (sesuai ketentuan tugas, tanpa database).
const meetingReservations = [
  {
    id: 1,
    namaPemesan: "PT Maju Digital",
    ruang: "Ruang Kenanga",
    tanggal: "2026-10-05",
    jamMulai: "13:00",
    durasiJam: 2,
  },
  {
    id: 2,
    namaPemesan: "CV Kreatif Nusantara",
    ruang: "Ruang Melati",
    tanggal: "2026-10-06",
    jamMulai: "09:30",
    durasiJam: 1.5,
  },
  {
    id: 3,
    namaPemesan: "Tim Sistem Informasi",
    ruang: "Ruang Anggrek",
    tanggal: "2026-10-05",
    jamMulai: "15:00",
    durasiJam: 2,
  },
];

// ID berikutnya yang akan diberikan saat data baru ditambahkan.
let nextId = 4;

// Memeriksa apakah tanggal benar-benar valid dan berformat YYYY-MM-DD.
function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

// Memeriksa semua field wajib pada request POST dan PUT.
function validateReservation(body) {
  const requiredStrings = ["namaPemesan", "ruang"];

  for (const field of requiredStrings) {
    if (typeof body[field] !== "string" || body[field].trim() === "") {
      return `Field ${field} wajib diisi dengan teks`;
    }
  }

  if (!isValidDate(body.tanggal)) {
    return "Field tanggal wajib berformat YYYY-MM-DD dan berisi tanggal yang valid";
  }

  if (
    typeof body.jamMulai !== "string" ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(body.jamMulai)
  ) {
    return "Field jamMulai wajib berformat HH:mm yang valid";
  }

  if (
    typeof body.durasiJam !== "number" ||
    !Number.isFinite(body.durasiJam) ||
    body.durasiJam <= 0
  ) {
    return "Field durasiJam wajib berupa angka lebih dari 0";
  }

  return null;
}

// Membuat objek data baru tanpa menerima id dari pengguna.
function getReservationFields(body) {
  return {
    namaPemesan: body.namaPemesan.trim(),
    ruang: body.ruang.trim(),
    tanggal: body.tanggal,
    jamMulai: body.jamMulai,
    durasiJam: body.durasiJam,
  };
}

// GET / - Menampilkan informasi API dalam JSON.
app.get("/", (req, res) => {
  res.status(200).json({
    namaMahasiswa: "Yonathan Rinfi",
    nim: "2428240101",
    kelas: "SI5B",
    nomorTopik: 28,
    namaTopik: "Coworking Space - Reservasi Ruang Rapat",
    endpoints: [
      "GET /meeting-reservations",
      "GET /meeting-reservations/:id",
      "POST /meeting-reservations",
      "PUT /meeting-reservations/:id",
      "DELETE /meeting-reservations/:id",
      "GET /meeting-reservations?tanggal=YYYY-MM-DD",
    ],
  });
});

// GET /meeting-reservations - Mengambil semua data atau memfilter berdasarkan tanggal.
app.get("/meeting-reservations", (req, res) => {
  const { tanggal } = req.query;

  if (tanggal !== undefined) {
    return res.status(200).json(
      meetingReservations.filter((reservation) => reservation.tanggal === tanggal),
    );
  }

  return res.status(200).json(meetingReservations);
});

// GET /meeting-reservations/:id - Mengambil satu reservasi berdasarkan ID.
app.get("/meeting-reservations/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const reservation = meetingReservations.find((item) => item.id === id);

  if (!reservation) {
    return res.status(404).json({
      status: "error",
      message: `Data reservasi dengan id ${req.params.id} tidak ditemukan`,
      data: null,
    });
  }

  return res.status(200).json(reservation);
});

// POST /meeting-reservations
// Body: { "namaPemesan": "PT Maju Digital", "ruang": "Ruang Kenanga", "tanggal": "2026-10-05", "jamMulai": "13:00", "durasiJam": 2 }
app.post("/meeting-reservations", (req, res) => {
  const validationError = validateReservation(req.body || {});

  if (validationError) {
    return res.status(400).json({
      status: "error",
      message: validationError,
      data: null,
    });
  }

  const newReservation = {
    id: nextId++,
    ...getReservationFields(req.body),
  };

  meetingReservations.push(newReservation);

  return res.status(201).json({
    status: "success",
    message: "Data reservasi berhasil ditambahkan",
    data: newReservation,
  });
});

// PUT /meeting-reservations/:id
// Body wajib memuat seluruh field: namaPemesan, ruang, tanggal, jamMulai, durasiJam.
app.put("/meeting-reservations/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const index = meetingReservations.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data reservasi dengan id ${req.params.id} tidak ditemukan`,
      data: null,
    });
  }

  const validationError = validateReservation(req.body || {});

  if (validationError) {
    return res.status(400).json({
      status: "error",
      message: validationError,
      data: null,
    });
  }

  const updatedReservation = {
    id,
    ...getReservationFields(req.body),
  };

  meetingReservations[index] = updatedReservation;

  return res.status(200).json({
    status: "success",
    message: `Data reservasi dengan id ${id} berhasil diperbarui`,
    data: updatedReservation,
  });
});

// DELETE /meeting-reservations/:id - Menghapus satu reservasi berdasarkan ID.
app.delete("/meeting-reservations/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const index = meetingReservations.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: `Data reservasi dengan id ${req.params.id} tidak ditemukan`,
      data: null,
    });
  }

  meetingReservations.splice(index, 1);

  return res.status(200).json({
    status: "success",
    message: `Data reservasi dengan id ${id} berhasil dihapus`,
    data: null,
  });
});

// Catch-all 404 untuk route yang tidak tersedia (tetap JSON).
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan",
    data: null,
  });
});

// Error handler JSON, termasuk body JSON yang tidak valid.
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const isMalformedJson = err instanceof SyntaxError && err.status === 400 && "body" in err;
  const statusCode = isMalformedJson ? 400 : 500;

  return res.status(statusCode).json({
    status: "error",
    message: isMalformedJson ? "Format JSON request tidak valid" : "Terjadi kesalahan pada server",
    data: null,
  });
});

// Menjalankan server hanya di komputer lokal; Vercel mengimpor app di atas.
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

// Export aplikasi Express agar dapat dijalankan oleh Vercel.
module.exports = app;
