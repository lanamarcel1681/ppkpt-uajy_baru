import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      rolePelapor,
      pelapor,
      korban, // Hanya ada jika rolePelapor != Korban
      terlapor,
      laporan,
    } = body;

    // Validation basic
    if (!rolePelapor || !pelapor || !terlapor || !laporan) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      let id_pelapor_korban: number | null = null;
      let id_saksi_created: number | null = null;

      // 1. Handle Pelapor & Korban Creation
      if (rolePelapor === "Korban") {
        // Pelapor ADALAH Korban
        const newKorban = await tx.korban.create({
          data: {
            nama_korban: pelapor.nama,
            email_korban: pelapor.email,
            no_hp_korban: pelapor.noHp,
            fakultas_korban: pelapor.fakultas || null,
            status_korban: pelapor.status,
            jenis_kelamin: pelapor.gender,
          },
        });
        id_pelapor_korban = newKorban.id_pelapor;
      } else {
        // Pelapor ADALAH Saksi
        // Create Data Korban terpisah
        if (!korban) {
          throw new Error("Data korban wajib diisi jika pelapor bukan korban");
        }
        const newKorban = await tx.korban.create({
          data: {
            nama_korban: korban.nama,
            email_korban: korban.email,
            no_hp_korban: korban.noHp,
            fakultas_korban: korban.fakultas || null,
            status_korban: korban.status,
            jenis_kelamin: korban.gender,
          },
        });
        id_pelapor_korban = newKorban.id_pelapor;

        // Create Entity Pelapor (Saksi)
        if (rolePelapor === "Saksi") {
          const newSaksi = await tx.saksi.create({
            data: {
              nama_saksi: pelapor.nama,
              email_saksi: pelapor.email,
              no_hp_saksi: pelapor.noHp,
              fakultas_saksi: pelapor.fakultas || null,
              status_saksi: pelapor.status,
              jenis_kelamin: pelapor.gender,
            },
          });
          id_saksi_created = newSaksi.id_saksi;
        }
      }

      // 2. Handle Terlapor (Pelaku)
      const newPelaku = await tx.pelaku.create({
        data: {
          nama_pelaku: terlapor.nama,
          status_pelaku: terlapor.status,
          fakultas_pelaku: terlapor.fakultas || null,
        },
      });

      // 3. Create Laporan
      const jenisKekerasanString = Array.isArray(laporan.jenisKekerasan)
        ? laporan.jenisKekerasan.join(", ")
        : laporan.jenisKekerasan;

      const lokasiGabungan = `${laporan.tkp || ""} - ${laporan.lokasiDetail || ""}`;

      const newLaporan = await tx.laporan.create({
        data: {
          id_pelapor: id_pelapor_korban, // FK ke Korban
          id_terlapor: newPelaku.id_terlapor,
          id_saksi: id_saksi_created,

          jenis_kekerasan: jenisKekerasanString,
          kronologi_laporan: laporan.kronologi,
          waktu_kejadian: new Date(laporan.waktuKejadian),
          tkp: lokasiGabungan,
          status_laporan: "Direview", // Default
          pendampingan_segera: laporan.pendampinganSegera,
          tindak_lanjut: laporan.tindakLanjut,
          link_video: laporan.linkVideo || null,
          bukti_laporan: laporan.buktiUrl || null, // Sent as JSON string or single string
        },
      });

      return newLaporan;
    });

    const emailTujuan = pelapor.email;
    const namaTujuan = pelapor.nama;
    if (emailTujuan) {
      // Kirim email secara asinkron (tidak await agar tidak memblokir respon ke client)
      sendNotificationEmail(
        emailTujuan,
        namaTujuan,
        rolePelapor,
        laporan.kronologi,
      ).catch(console.error);
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Laporan berhasil dikirim, dan notifikasi email sedang diproses",
        data: result,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error submitting report:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
