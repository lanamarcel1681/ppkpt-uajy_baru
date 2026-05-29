const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seeding database...");

  // 1. ROLES
  console.log("... Seeding roles");
  const roles = [
    { id: 1, nama: "Administrator" },
    { id: 2, nama: "Tim Satgas" },
    { id: 3, nama: "Ketua" },
    { id: 4, nama: "Sekretaris" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id_role: role.id },
      update: {},
      create: { id_role: role.id, nama_role: role.nama },
    });
  }

  // 2. USERS
  console.log("... Seeding users");
  await prisma.pengurus.upsert({
    where: { email_pengurus: "admin@uajy.ac.id" },
    update: {},
    create: {
      nama_pengurus: "Super Admin",
      email_pengurus: "admin@uajy.ac.id",
      password: "admin123",
      id_role: 1,
      is_aktif: true,
    },
  });

  await prisma.pengurus.upsert({
    where: { email_pengurus: "satgas1@uajy.ac.id" },
    update: {},
    create: {
      nama_pengurus: "Anggota Satgas 1",
      email_pengurus: "satgas1@uajy.ac.id",
      password: "password123",
      id_role: 2,
      is_aktif: true,
      prodi: "Informatika",
      fakultas: "FTI",
    },
  });

  // Tambahan 4 User sesuai request
  await prisma.pengurus.upsert({
    where: { email_pengurus: "satgas2@uajy.ac.id" },
    update: {},
    create: {
      nama_pengurus: "Anggota Satgas 2",
      email_pengurus: "satgas2@uajy.ac.id",
      password: "password123",
      id_role: 2,
      is_aktif: true,
      prodi: "Sistem Informasi",
      fakultas: "FTI",
    },
  });

  await prisma.pengurus.upsert({
    where: { email_pengurus: "ketua@uajy.ac.id" },
    update: {},
    create: {
      nama_pengurus: "Ketua Satgas",
      email_pengurus: "ketua@uajy.ac.id",
      password: "password123",
      id_role: 3,
      is_aktif: true,
      prodi: "Hukum",
      fakultas: "Fakultas Hukum",
    },
  });

  await prisma.pengurus.upsert({
    where: { email_pengurus: "sekretaris@uajy.ac.id" },
    update: {},
    create: {
      nama_pengurus: "Sekretaris Satgas",
      email_pengurus: "sekretaris@uajy.ac.id",
      password: "password123",
      id_role: 4,
      is_aktif: true,
    },
  });



  // 3. PROFIL SATGAS (Tentang Kami)
  // Force update to ensure new content is applied
  console.log("... Seeding profil satgas");
  const profilData = {
    deskripsi_profil:
      "Satuan Tugas Pencegahan dan Penanganan Kekerasan Seksual (Satgas PPKS) Universitas Atma Jaya Yogyakarta dibentuk sebagai wujud komitmen universitas dalam menciptakan lingkungan kampus yang aman, inklusif, dan bebas dari segala bentuk kekerasan seksual. Kami bertugas untuk melakukan sosialisasi, edukasi, pencegahan, serta penanganan kasus kekerasan seksual yang melibatkan civitas akademika UAJY dengan prinsip kerahasiaan, keberpihakan pada korban, dan keadilan.",
    visi: "Menjadikan Universitas Atma Jaya Yogyakarta sebagai ruang aman bagi seluruh civitas akademika, bebas dari segala bentuk kekerasan seksual, serta menjunjung tinggi nilai-nilai kemanusiaan dan keadilan gender.",
    misi: "1. Menyelenggarakan kegiatan pencegahan melalui edukasi, sosialisasi, dan kampanye anti-kekerasan seksual secara berkala.\n2. Menyediakan layanan pelaporan yang mudah diakses, aman, dan menjamin kerahasiaan identitas pelapor.\n3. Melakukan penanganan kasus kekerasan seksual secara profesional, transparan, dan berperspektif korban.\n4. Memberikan pendampingan psikologis, hukum, dan spiritual bagi korban kekerasan seksual.\n5. Membangun sinergi dengan berbagai pihak internal dan eksternal dalam upaya pencegahan dan penanganan kekerasan seksual.",
  };

  await prisma.profilSatgas.upsert({
    where: { id_profilsatgas: 1 },
    update: profilData, // Update with new data if exists
    create: {
      id_profilsatgas: 1,
      ...profilData,
    },
  });

  // 3b. NILAI SATGAS
  // Delete existing to ensure clean slate for default values (prevents duplicates if run multiple times without unique key on content)
  console.log("... Seeding nilai satgas");
  const nilaiSatgasData = [
    {
      judul: "Kerahasiaan",
      deskripsi:
        "Kami menjamin kerahasiaan identitas pelapor, korban, dan saksi, serta seluruh informasi yang disampaikan dalam proses pelaporan dan penanganan kasus.",
    },
    {
      judul: "Keberpihakan",
      deskripsi:
        "Segala tindakan dan keputusan yang diambil berorientasi pada perlindungan, keamanan, dan pemulihan korban.",
    },
    {
      judul: "Profesionalitas",
      deskripsi:
        "Tim Satgas bekerja sesuai dengan standar operasional prosedur (SOP), kode etik, dan peraturan perundang-undangan yang berlaku.",
    },
    {
      judul: "Keadilan & Kesetaraan",
      deskripsi:
        "Kami menangani setiap kasus tanpa discriminasi, memastikan proses yang adil, dan menjunjung tinggi kesetaraan hak bagi semua pihak.",
    },
  ];

  // Strategy: Upsert by 'judul' isn't possible directly as it's not unique in schema usually.
  // Best approach for seed script meant to RESET defaults: Delete all then create.
  // For 'Config' type tables that define the UI structure, this is cleaner.
  await prisma.nilaiSatgas.deleteMany({});
  await prisma.nilaiSatgas.createMany({
    data: nilaiSatgasData.map((item, idx) => ({ ...item, urutan: idx + 1 })),
  });

  // 4. KONFIGURASI BERANDA
  console.log("... Seeding konfigurasi beranda");
  const berandaConfig = {
    heroTitle:
      "Satuan Tugas Pencegahan dan Penanganan Kekerasan di Lingkungan Perguruan Tinggi Universitas Atma Jaya Yogyakarta",
    heroSubtitle:
      "Kami berkomitmen menciptakan lingkungan kampus yang aman, nyaman, dan bebas dari segala bentuk kekerasan seksual. Laporkan, kami siap membantu Anda.",
    heroImageUrl: null,
    heroHotlineNumber: "0822-2006-4236",
    ctaTitle: "Mari Ciptakan Ruang Aman",
    ctaSubtitle:
      "Jika Anda melihat atau mengalami kekerasan seksual, jangan ragu untuk melapor. Identitas Anda kami jamin kerahasiaannya. Simak video berikut untuk memahami alur pelaporan.",
    ctaVideoUrl: "https://www.youtube.com/watch?v=JmhYP9O3eB0",
    ctaImageUrl: null,
    navbarTitle: "Satgas PPKPT UAJY",
    navbarSubtitle: "",
    navbarLogoUrl: null,
  };

  await prisma.konfigurasiBeranda.upsert({
    where: { id: 1 },
    update: berandaConfig,
    create: {
      id: 1,
      ...berandaConfig,
    },
  });

  // 5. BERITA
  console.log("... Seeding berita");
  const beritaData = [
    {
      judul: "Sosialisasi Pencegahan Kekerasan Seksual bagi Mahasiswa Baru",
      slug: "sosialisasi-maba-2025",
      kategori: "Kegiatan",
      konten: `Satgas PPKPT UAJY mengadakan sosialisasi bagi mahasiswa baru angkatan 2025. Kegiatan ini bertujuan untuk memberikan pemahaman dasar mengenai bentuk-bentuk kekerasan seksual dan cara melaporkannya. Sosialisasi ini dihadiri oleh lebih dari 1000 mahasiswa baru yang antusias mengikuti materi yang disampaikan.

Dalam sesi ini, Ketua Satgas menekankan pentingnya peran aktif mahasiswa dalam menciptakan lingkungan kampus yang aman. "Kita semua adalah agen perubahan. Jangan diam jika melihat ketidakadilan," ujarnya. Selain pemaparan materi, acara juga diisi dengan sesi tanya jawab interaktif dan simulasi pelaporan melalui website resmi Satgas.

Mahasiswa diperkenalkan dengan berbagai kanal pelaporan yang tersedia, mulai dari hotline 24 jam, email pengaduan, hingga fitur pelaporan anonim di website. Diharapkan dengan adanya sosialisasi ini, mahasiswa baru tidak ragu untuk melapor jika mengalami atau menyaksikan tindakan kekerasan seksual.`,
      excerpt:
        "Satgas PPKPT UAJY menyapa mahasiswa baru dalam kegiatan inisiasi, memberikan pembekalan tentang pencegahan kekerasan seksual.",
      penulis: "Admin Satgas",
      gambarUrl: null,
    },
    {
      judul: "Webinar Nasional: Membangun Kampus Aman dan Inklusif",
      slug: "webinar-nasional-kampus-aman",
      kategori: "Webinar",
      konten: `Universitas Atma Jaya Yogyakarta bekerjasama dengan kementerian terkait menyelenggarakan webinar nasional dengan tema 'Membangun Kampus Aman dan Inklusif'. Webinar ini menghadirkan narasumber ahli di bidang hukum, psikologi, dan aktivis hak asasi manusia.

Diskusi berfokus pada implementasi Permendikbudristek No. 30 Tahun 2021 tentang Pencegahan dan Penanganan Kekerasan Seksual di Lingkungan Perguruan Tinggi. Para pembicara berbagi praktik baik dan tantangan yang dihadapi dalam penerapan regulasi tersebut di berbagai kampus di Indonesia.

Salah satu poin penting yang dibahas adalah bagaimana membangun sistem pendampingan korban yang komprehensif, tidak hanya dari aspek hukum tetapi juga pemulihan psikologis. Rekaman webinar ini dapat diakses kembali melalui kanal YouTube resmi UAJY bagi civitas akademika yang berhalangan hadir.`,
      excerpt:
        "Webinar ini menghadirkan narasumber ahli untuk mendiskusikan implementasi Permendikbudristek No. 30 Tahun 2021.",
      penulis: "Divisi Edukasi",
      gambarUrl: null,
    },
    {
      judul: "Panduan Pencegahan Kekerasan Berbasis Gender Online (KBGO)",
      slug: "panduan-kbgo",
      kategori: "Edukasi",
      konten: `Di era digital, kekerasan seksual dapat terjadi secara daring atau yang dikenal dengan Kekerasan Berbasis Gender Online (KBGO). Bentuk kekerasan ini seringkali tidak disadari namun memiliki dampak psikologis yang nyata bagi korban.

Bentuk-bentuk KBGO antara lain:
1. Cyber grooming: Pendekatan untuk memperdaya korban.
2. Cyber harassment: Gangguan atau pelecehan terus-menerus.
3. Hacking: Peretasan akun pribadi.
4. Non-consensual dissemination of intimate images (NCII): Penyebaran konten intim tanpa persetujuan.

Satgas PPKPT UAJY berkomitmen untuk menangani kasus KBGO dengan serius. Jika Anda mengalami intimidasi atau penyebaran data pribadi secara online, segera simpan bukti digital (screenshot, URL) dan laporkan kepada kami. Keamanan data Anda adalah prioritas kami.`,
      excerpt:
        "Kenali apa itu KBGO dan bagaimana cara melindungi diri di dunia maya. Panduan lengkap pencegahan kekerasan di ranah digital.",
      penulis: "Tim Media",
      gambarUrl: null,
    },
    {
      judul: "Workshop Pertolongan Pertama Psikologis (PFA)",
      slug: "workshop-pfa-2025",
      kategori: "Workshop",
      konten: `Satgas PPKPT UAJY menyelenggarakan Workshop Psychological First Aid (PFA) yang terbuka bagi seluruh mahasiswa. Kegiatan ini bertujuan untuk membekali mahasiswa dengan keterampilan dasar dalam memberikan dukungan awal bagi teman sebaya yang mengalami situasi krisis atau trauma.

PFA bukanlah konseling profesional, melainkan serangkaian tindakan suportif yang manusiawi. Peserta diajarkan prinsip 'Look, Listen, Link' (Lihat, Dengar, Hubungkan). Keterampilan ini sangat penting, mengingat teman sebaya seringkali menjadi tempat curhat pertama bagi korban kekerasan.`,
      excerpt:
        "Membekali mahasiswa dengan keterampilan Psychological First Aid untuk mendukung sesama.",
      penulis: "Divisi Psikologi",
      gambarUrl: null,
    },
    {
      judul: "Kampanye Kampus Aman 2025: Bergerak Bersama",
      slug: "kampanye-kampus-aman",
      kategori: "Berita",
      konten: `Universitas Atma Jaya Yogyakarta meluncurkan kampanye tahunan 'Kampus Aman 2025'. Kampanye ini merupakan rangkaian kegiatan yang berlangsung selama satu semester, mencakup kompetisi poster, film pendek, dan esai bertema pencegahan kekerasan seksual.

Tujuan utama kampanye ini adalah meningkatkan awareness dan melibatkan partisipasi aktif seluruh elemen kampus. Karya-karya terbaik akan dipamerkan di selasar kampus dan media sosial resmi universitas. Mari dukung dan ramaikan kegiatan ini!`,
      excerpt:
        "Rangkaian kegiatan kreatif untuk meningkatkan kesadaran warga kampus tentang isu kekerasan seksual.",
      penulis: "Humas UAJY",
      gambarUrl: null,
    },
  ];

  for (const berita of beritaData) {
    await prisma.berita.upsert({
      where: { slug: berita.slug },
      update: berita, // Update content if slug exists
      create: berita,
    });
  }

  // 6. LAYANAN
  console.log("... Seeding layanan");
  const layananData = [
    {
      title: "Pendampingan Psikologis",
      desc: "Layanan konseling gratis oleh psikolog klinis profesional untuk membantu pemulihan trauma korban secara holistik.",
      iconBg: "bg-green-100",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.28 3.6-1.28 5.14 0 .34.66.17 1.7-.5 1.7-4.27 0-6.57-2.93-9.98-7.79 3.41-4.86 5.71-7.79 9.98-7.79.67 0 .84 1.04.5 1.7-1.54 1.28-3.65 1.28-5.14 0-1.04-.88-2.58-.88-3.61 0C13.89 3.1 11.78 3.1 10.29 1.81c-.34-.66-.17-1.7.5-1.7 4.27 0 6.57 2.93 9.98 7.79-3.41 4.86-5.71 7.79-9.98 7.79-.67 0-.84-1.04-.5-1.7 1.49-1.28 3.6-1.28 5.14 0 1.03.89 2.57.89 3.61 0z"/></svg>`,
    },
    {
      title: "Bantuan Hukum",
      desc: "Pendampingan hukum selama proses penanganan kasus, mulai dari konsultasi hingga pendampingan di kepolisian jika diperlukan.",
      iconBg: "bg-orange-100",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`,
    },
    {
      title: "Edukasi & Sosialisasi",
      desc: "Program edukasi rutin, workshop, dan seminar untuk meningkatkan kesadaran dan pencegahan kekerasan seksual di kampus.",
      iconBg: "bg-purple-100",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    },
  ];

  // Use deleteMany + createMany strategy for config lists to ensure clean defaults
  await prisma.layanan.deleteMany({});
  await prisma.layanan.createMany({ data: layananData });

  // 7. JENIS KEKERASAN
  console.log("... Seeding jenis kekerasan");
  // Check if exists, if not create. Better not to delete here as it has relations (ContohKekerasan) that might complicate things if cascade delete isn't set.
  // We'll use upsert-like logic manually or just create if empty for now since structure is complex.
  // Actually, for a seed reset request, we might want to clear it, but let's be careful.
  // Let's just create if count is 0 as per original request, but user said "data tidak masuk".
  // Let's check count again.
  const jkCount = await prisma.jenisKekerasan.count();
  if (jkCount === 0) {
    await prisma.jenisKekerasan.create({
      data: {
        judul: "Kekerasan Seksual Fisik",
        deskripsi:
          "Tindakan fisik yang bersifat seksual tanpa persetujuan korban.",
        contoh: {
          create: [
            { isi_contoh: "Menyentuh bagian tubuh sensitif tanpa izin" },
            { isi_contoh: "Memaksa melakukan hubungan seksual" },
          ],
        },
      },
    });
    await prisma.jenisKekerasan.create({
      data: {
        judul: "Kekerasan Seksual Non-Fisik",
        deskripsi:
          "Tindakan verbal atau isyarat yang bersifat seksual dan merendahkan.",
        contoh: {
          create: [
            { isi_contoh: "Catcalling atau siulan bernada seksual" },
            { isi_contoh: "Mengirimkan pesan/gambar porno tanpa persetujuan" },
          ],
        },
      },
    });
  }

  // 8. KONFIGURASI FOOTER
  console.log("... Seeding footer");
  await prisma.konfigurasiFooter.upsert({
    where: { id: 1 },
    update: {}, // Keep existing config if any
    create: {
      id: 1,
      footerTitle: "Satgas PPKPT",
      footerDescription:
        "Satgas Pencegahan dan Penanganan Kekerasan pada Lingkungan Perguruan Tinggi Universitas Atma Jaya Yogyakarta.",
      alamat: "Gedung Thomas Aquinas, Babarsari, Yogyakarta 55281",
      email: "ppkpt@uajy.ac.id",
      telepon: "0822-2006-4236",
      footerLogoUrl: null,
      facebookUrl: "https://facebook.com/uajy",
      instagramUrl: "https://instagram.com/uajy",
      twitterUrl: "https://twitter.com/uajy",
      youtubeUrl: "https://youtube.com/uajy",
    },
  });

  // 9. ALUR KERJA
  console.log("... Seeding alur kerja");
  const alurCount = await prisma.alurPelaporan.count();
  if (alurCount === 0) {
    await prisma.alurPelaporan.create({
      data: {
        judul: "Alur Pelaporan",
        deskripsi:
          "Mahasiswa/Civitas Akademika melaporkan kejadian melalui portal -> Satgas memverifikasi -> Proses Investigasi -> Penindakan & Pemulihan.",
        gambar_url: null,
      },
    });
  }

  // 10. FAKULTAS & PRODI
  console.log("... Seeding Fakultas & Prodi");
  const fakultasCount = await prisma.fakultas.count();
  if (fakultasCount === 0) {
    const fti = await prisma.fakultas.create({
      data: {
        nama: "Fakultas Teknologi Industri",
        prodi: {
          create: [
            { nama: "Informatika" },
            { nama: "Sistem Informasi" },
            { nama: "Teknik Industri" }
          ]
        }
      }
    });

    const fbis = await prisma.fakultas.create({
      data: {
        nama: "Fakultas Bisnis dan Ekonomika",
        prodi: {
          create: [
            { nama: "Manajemen" },
            { nama: "Akuntansi" },
            { nama: "Ekonomi Pembangunan" }
          ]
        }
      }
    });
  }

  // 11. TAHUN AKADEMIK
  console.log("... Seeding Tahun Akademik");
  const taCount = await prisma.tahunAkademik.count();
  if (taCount === 0) {
    await prisma.tahunAkademik.createMany({
      data: [
        { nama: "Ganjil 2024/2025", is_active: false },
        { nama: "Genap 2024/2025", is_active: true },
        { nama: "Ganjil 2025/2026", is_active: false }
      ]
    });
  }

  // 12. STATISTIK
  console.log("... Seeding Statistik");
  const statCount = await prisma.statistik.count();
  if (statCount === 0) {
    await prisma.statistik.createMany({
      data: [
        { label: "Laporan Diterima", jumlah: "120+", urutan: 1 },
        { label: "Kasus Selesai", jumlah: "98%", urutan: 2 },
        { label: "Edukasi & Sosialisasi", jumlah: "50+", urutan: 3 }
      ]
    });
  }

  console.log("✅ Seed berhasil! Database telah terisi.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
