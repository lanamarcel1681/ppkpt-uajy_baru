import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademicYear } from "@/lib/academicYear";
import { calculatePriority } from "@/lib/priority";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view"); // "dashboard" | "list"
    const role = searchParams.get("role");

    if (!role) {
      return NextResponse.json(
        { message: "Role is required" },
        { status: 400 },
      );
    }

    let reports: any[] = [];

    // Base query conditions
    let whereCondition: any = {};

    // 1. Filter based on View
    if (view === "dashboard") {
      whereCondition = {
        status_laporan: "Direview",
      };
    } else {
      // List (Default): Verified/Processed/Done
      // Exclude Direview, Masuk, and expired Ditolak
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      whereCondition = {
        OR: [
          {
            status_laporan: {
              notIn: ["Direview", "Masuk", "Ditolak"],
            },
          },
          {
            AND: [
              { status_laporan: "Ditolak" },
              { updatedAt: { gte: sevenDaysAgo } },
            ],
          },
        ],
      };
    }

    // 2. Filter based on Role
    if (role === "Ketua" || role === "Sekretaris" || role === "Administrator") {
      // Admin sees all matching the view
      reports = await prisma.laporan.findMany({
        where: whereCondition,
        include: {
          korban: true,
        },
        orderBy: {
          tgl_laporan: "desc",
        },
      });
    }
    // 2. Tim Satgas -> Hanya menampilkan laporan yang ditugaskan
    else if (role === "Tim Satgas") {
      const email = searchParams.get("email");
      if (!email) {
        return NextResponse.json(
          { message: "Email is required for Satgas role" },
          { status: 400 },
        );
      }

      // Find user ID from email
      const user = await prisma.pengurus.findUnique({
        where: { email_pengurus: email },
      });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }

      // Find assigned report IDs
      const assignments = await prisma.timPenanganan.findMany({
        where: { id_pengurus: user.id_pengurus },
        select: { id_laporan: true },
      });

      const reportIds = assignments.map((a) => a.id_laporan);

      // Build where condition for Tim Satgas
      const satgasWhere: any = {
        id_laporan: { in: reportIds },
      };

      // For dashboard view, only show active reports (exclude Selesai and Ditolak)
      if (view === "dashboard") {
        satgasWhere.status_laporan = {
          notIn: ["Selesai", "Ditolak"],
        };
      }

      reports = await prisma.laporan.findMany({
        where: satgasWhere,
        include: {
          korban: true,
        },
        orderBy: {
          tgl_laporan: "desc",
        },
      });
    }

    // Format data untuk tabel
    const formattedReports = reports.map((rpt: any) => ({
      id: `RPT-${new Date(rpt.tgl_laporan).getFullYear()}-${String(rpt.id_laporan).padStart(3, "0")}`,
      nama_korban: rpt.korban?.nama_korban || "Tanpa Nama",
      jenis: rpt.jenis_kekerasan || "Tidak Diketahui",
      status: rpt.status_laporan,
      prioritas: calculatePriority(
        rpt.tgl_laporan,
        rpt.updatedAt,
        rpt.status_laporan,
      ),
      tanggal: new Date(rpt.tgl_laporan).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      raw_id: rpt.id_laporan,
      semester: getAcademicYear(rpt.tgl_laporan),
    }));

    return NextResponse.json({ data: formattedReports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
