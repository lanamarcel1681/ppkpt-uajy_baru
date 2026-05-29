import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademicYear } from "@/lib/academicYear";

export async function GET() {
    try {
        // Definisi "Sudah Terverifikasi":
        // Bukan "Masuk" (karena baru masuk)
        // Bukan "Ditolak" (karena ditolak)
        // Bukan "Direview" / "Verifikasi" (karena sedang diverifikasi, belum selesai verifikasi)
        // Jadi: Status selain ["Masuk", "Ditolak", "Direview", "Verifikasi", "Menunggu"]

        // Namun bisa juga user maksudnya "Semua yang valid masuk sistem satgas",
        // tapi biasanya "Sudah Terverifikasi" berarti lolos tahap verifikasi.
        // Kita ikuti logic di reports/route.ts untuk list view: notIn: ["Direview", "Masuk", "Ditolak"]

        const verifiedReports = await prisma.laporan.findMany({
            where: {
                status_laporan: {
                    notIn: ["Direview", "Verifikasi", "Menunggu", "Di Review"]
                }
            },
            select: {
                id_laporan: true,
                tgl_laporan: true,
                status_laporan: true,
                jenis_kekerasan: true,
                updatedAt: true,
                sanksi: true,
                korban: {
                    select: {
                        fakultas_korban: true
                    }
                }
            }
        });

        // --- Summary Stats ---
        const totalReports = verifiedReports.length;

        let totalDurationDays = 0;
        let completedCount = 0;

        verifiedReports.forEach(report => {
            if (report.status_laporan === "Selesai") {
                const start = new Date(report.tgl_laporan).getTime();
                const end = new Date(report.updatedAt).getTime();
                const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                totalDurationDays += diffDays;
                completedCount++;
            }
        });

        const avgDuration = completedCount > 0 ? Math.round(totalDurationDays / completedCount) : 0;
        const completionRate = totalReports > 0 ? ((completedCount / totalReports) * 100).toFixed(1) : "0";

        const reportsWithSemester = verifiedReports.map(report => ({
            ...report,
            semester: getAcademicYear(new Date(report.tgl_laporan))
        }));

        return NextResponse.json({
            reports: reportsWithSemester,
            summary: {
                total: totalReports,
                avgDuration: `${avgDuration} hari`,
                completionRate: `${completionRate}%`
            }
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
