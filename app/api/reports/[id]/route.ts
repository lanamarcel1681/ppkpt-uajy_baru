import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendStatusUpdateEmail } from "@/lib/email";
import { calculatePriority } from "@/lib/priority";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 },
      );
    }

    const report = await prisma.laporan.findUnique({
      where: {
        id_laporan: id,
      },
      include: {
        korban: true,
        pelaku: true,
        saksi: true,
        timPenanganan: {
          include: {
            pengurus: true,
          },
        }, // Include this to check if team is assigned
        logPelaporan: {
          orderBy: {
            waktu: "asc",
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { message: "Laporan tidak ditemukan" },
        { status: 404 },
      );
    }

    // Calculate deadline and extensions
    const processedLog = report.logPelaporan.find(log => log.deskripsi_log === "Laporan Diproses");
    const processedDate = processedLog ? new Date(processedLog.waktu) : null;

    const extensionLogs = report.logPelaporan.filter(log => log.deskripsi_log === "Tenggat Waktu Diperpanjang");
    const jumlah_perpanjangan = extensionLogs.length;

    let tenggat_waktu = null;
    if (processedDate) {
      if (jumlah_perpanjangan > 0) {
        // Find the LATEST extension log and calculate 30 days from THAT specific date
        const latestExtensionDate = new Date(extensionLogs[extensionLogs.length - 1].waktu);
        const deadline = new Date(latestExtensionDate);
        deadline.setDate(deadline.getDate() + 30);
        tenggat_waktu = deadline.toISOString();
      } else {
        // If no extensions, calculate 30 days from processing start date
        const deadline = new Date(processedDate);
        deadline.setDate(deadline.getDate() + 30);
        tenggat_waktu = deadline.toISOString();
      }
    }

    // Format data for frontend
    const formattedReport = {
      id: `RPT-${new Date(report.tgl_laporan).getFullYear()}-${String(report.id_laporan).padStart(3, "0")}`,
      raw_id: report.id_laporan,
      jenisKekerasan: report.jenis_kekerasan,
      deskripsi: report.kronologi_laporan, // Mapped from kronologi_laporan
      pelapor: report.saksi
        ? report.saksi.nama_saksi
        : report.korban?.nama_korban,
      fakultas_pelapor: report.saksi
        ? report.saksi.fakultas_saksi
        : report.korban?.fakultas_korban,
      nama_korban: report.korban?.nama_korban,
      nama_terlapor: report.pelaku?.nama_pelaku || "Tidak diketahui",
      status: report.status_laporan,
      prioritas: calculatePriority(report.tgl_laporan, report.updatedAt, report.status_laporan),
      tanggal: new Date(report.tgl_laporan).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      sanksi: report.sanksi,
      keterangan_sanksi: report.keterangan_sanksi,
      lokasi: report.tkp || "-", // Mapped from tkp
      saksi: report.saksi
        ? `Ada saksi (${report.saksi.nama_saksi})`
        : "Tidak ada saksi",
      bukti: report.bukti_laporan ? "Ada bukti lampiran" : "Tidak ada bukti",
      buktiUrl: report.bukti_laporan,
      linkVideo: report.link_video, // Added field
      kronologi: report.kronologi_laporan,
      hasAssignedTeam: report.timPenanganan.length > 0, // Flag for frontend
      assignedTeam: report.timPenanganan.map((t) => ({
        id_pengurus: t.id_pengurus,
        nama: t.pengurus?.nama_pengurus,
        posisi: t.posisi,
      })),
      no_hp: report.saksi
        ? report.saksi.no_hp_saksi
        : report.korban?.no_hp_korban || "-",
      updatedAt: report.updatedAt.toISOString(), // For timeline
      waktu_diproses: processedDate ? processedDate.toISOString() : null,
      tenggat_waktu: tenggat_waktu,
      jumlah_perpanjangan: jumlah_perpanjangan,
      logs: report.logPelaporan.map((log) => ({
        date: log.waktu.toISOString(),
        description: log.deskripsi_log,
      })),
    };

    return NextResponse.json(formattedReport);
  } catch (error) {
    console.error("Error fetching report detail:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { status, prioritas, sanksi, keterangan_sanksi } = body; // Also allow priority update if sent

    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {};
    if (status) updateData.status_laporan = status;
    if (prioritas) updateData.prioritas = prioritas;
    if (sanksi) updateData.sanksi = sanksi;
    if (keterangan_sanksi !== undefined) updateData.keterangan_sanksi = keterangan_sanksi;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No data to update" },
        { status: 400 },
      );
    }

    // Transaction to update report and create log
    const result = await prisma.$transaction(async (tx) => {
      const updatedReport = await tx.laporan.update({
        where: { id_laporan: id },
        data: updateData,
        include: {
          saksi: true,
          korban: true,
        },
      });

      if (status) {
        await tx.logPelaporan.create({
          data: {
            id_laporan: id,
            deskripsi_log: `Laporan ${status}`,
            waktu: new Date(),
          },
        });
      }

      return updatedReport;
    });

    // Send notification email asynchronously if status changed
    if (status && result) {
      const emailTujuan = result.saksi
        ? result.saksi.email_saksi
        : result.korban?.email_korban;
      const namaTujuan = result.saksi
        ? result.saksi.nama_saksi
        : result.korban?.nama_korban;

      if (emailTujuan && namaTujuan) {
        sendStatusUpdateEmail(emailTujuan, namaTujuan, status).catch(
          console.error,
        );
      }
    }

    return NextResponse.json({
      message: "Report updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
