import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const email = searchParams.get("email");

    // For Tim Satgas, filter stats to only their assigned reports
    let reportIdFilter: { id_laporan: { in: number[] } } | undefined;

    if (role === "Tim Satgas" && email) {
      const user = await prisma.pengurus.findUnique({
        where: { email_pengurus: email },
      });

      if (user) {
        const assignments = await prisma.timPenanganan.findMany({
          where: { id_pengurus: user.id_pengurus },
          select: { id_laporan: true },
        });
        const reportIds = assignments.map((a) => a.id_laporan);
        reportIdFilter = { id_laporan: { in: reportIds } };
      }
    }

    // Base where condition (scoped to assigned reports for Tim Satgas)
    const baseWhere = reportIdFilter || {};

    // 1. Total Laporan
    const totalHelper = await prisma.laporan.count({
      where: baseWhere,
    });

    // 2. Menunggu Review
    const reviewHelper = await prisma.laporan.count({
      where: {
        ...baseWhere,
        status_laporan: {
          in: ["Direview", "Di Review", "Verifikasi", "Menunggu"],
        },
      },
    });

    // 3. Dalam Proses
    const prosesHelper = await prisma.laporan.count({
      where: {
        ...baseWhere,
        status_laporan: {
          in: ["Diproses", "Investigasi", "Dalam Proses"],
        },
      },
    });

    // 4. Selesai
    const selesaiHelper = await prisma.laporan.count({
      where: {
        ...baseWhere,
        status_laporan: "Selesai",
      },
    });

    return NextResponse.json({
      total: totalHelper,
      review: reviewHelper,
      proses: prosesHelper,
      selesai: selesaiHelper,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
