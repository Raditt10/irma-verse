# IRMA-Verse

IRMA-Verse adalah sebuah platform ekstrakurikuler Ikatan Remaja Masjid di SMK 13 Bandung. Platform ini dirancang untuk mendukung kegiatan remaja masjid dengan fitur-fitur seperti berita, pembelajaran, jadwal kajian, chatbot, dan lainnya yang akan ditambahkan di masa depan.

## Fitur Utama

- **Berita**: Menyediakan informasi terkini terkait kegiatan remaja masjid.
- **Pembelajaran**: Materi pembelajaran yang relevan untuk anggota.
- **Jadwal Kajian**: Informasi jadwal kajian rutin dan acara lainnya.
- **Chatbot**: Asisten virtual untuk menjawab pertanyaan umum.
- **Dan lainnya**: Fitur tambahan akan dikembangkan sesuai kebutuhan.

## Instalasi dan Pengembangan

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan pengembangan:

### Prasyarat

Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org) (disarankan versi terbaru LTS)
- [PostgreSQL](https://www.postgresql.org) untuk database

### Langkah Instalasi

1. Clone repository ini:

   ```bash
   git clone https://github.com/Raditt10/IRMA-Verse.git
   cd IRMA-Verse
   ```

2. Instal dependensi:

   ```bash
   pnpm install
   # atau
   npm install
   ```

3. Konfigurasi database:
   - Salin file `.env.example` menjadi `.env`.
   - Atur variabel lingkungan sesuai dengan konfigurasi database PostgreSQL Anda.

4. Jalankan migrasi Prisma untuk mengatur skema database:

   ```bash
   npx prisma migrate dev
   ```

5. Jalankan server pengembangan:

   ```bash
   pnpm dev
   # atau
   npm run dev
   ```

6. Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## Kontribusi

Kami menyambut kontribusi dari siapa pun! Jika Anda ingin menambahkan fitur atau memperbaiki bug, silakan buat pull request atau buka issue di repository ini.

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

Dukungan Anda sangat berarti bagi pengembangan IRMA-Verse. Terima kasih telah menjadi bagian dari perjalanan ini!
