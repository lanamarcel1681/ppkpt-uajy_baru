import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper to extract Prodi from "Fakultas - Prodi" string
// Format saved in DB: "Fakultas Teknologi Industri - Informatika"
const extractProdi = (val: string | null) => {
  if (!val) return null;
  const parts = val.split(" - ");
  return parts.length > 1 ? parts[1].trim() : null; // Use 2nd part as Prodi if exists
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get("reportId");

  if (!reportId) {
    return NextResponse.json(
      { error: "Report ID is required" },
      { status: 400 },
    );
  }

  try {
    // 1. Get Report & Victim & Witness & Perpetrator
    const report = await prisma.laporan.findUnique({
      where: { id_laporan: parseInt(reportId) },
      include: {
        korban: true,
        saksi: true,
        pelaku: true,
      },
    });

    if (!report || !report.korban) {
      return NextResponse.json(
        { error: "Laporan or Korban not found" },
        { status: 404 },
      );
    }

    const victimProdi = extractProdi(report.korban.fakultas_korban);
    const perpetratorProdi = report.pelaku
      ? extractProdi(report.pelaku.fakultas_pelaku)
      : null;

    // Also get faculties just in case/for reference, but filtering is on Prodi
    const victimFaculty = report.korban.fakultas_korban;
    const witnessFaculty = report.saksi?.fakultas_saksi;

    // 2. Get All Active Satgas (Role ID 2, 3, 4)
    const allSatgas = await prisma.pengurus.findMany({
      where: {
        id_role: { in: [2, 3, 4] },
        is_aktif: true,
        // Ensure they have prodi data
        prodi: { not: null },
      },
      include: {
        role: true,
        timPenanganan: {
          include: {
            laporan: true
          }
        }
      },
    });

    // 3. Filter candidates
    // Rule: Satgas cannot be from the same PRODI as the victim OR the perpetrator (if known)
    const eligibleCandidates = allSatgas.filter((satgas) => {
      const norm = (str: string | null | undefined) =>
        str?.toLowerCase().trim() || "";

      const sProdi = norm(satgas.prodi);
      const vProdi = norm(victimProdi);
      const pProdi = norm(perpetratorProdi);

      // Check exact match
      const sameAsVictim = vProdi && sProdi === vProdi;
      const sameAsPerpetrator = pProdi && sProdi === pProdi;

      // Check containment (e.g. "Informatika" vs "Teknik Informatika")
      const similarToVictim =
        vProdi &&
        sProdi &&
        (sProdi.includes(vProdi) || vProdi.includes(sProdi));
      const similarToPerpetrator =
        pProdi &&
        sProdi &&
        (sProdi.includes(pProdi) || pProdi.includes(sProdi));

      return (
        !sameAsVictim &&
        !sameAsPerpetrator &&
        !similarToVictim &&
        !similarToPerpetrator
      );
    });

    return NextResponse.json({
      victimFaculty,
      witnessFaculty,
      candidates: eligibleCandidates.map((s) => {
        const activeReports = s.timPenanganan?.filter(
          (t) => t.laporan.status_laporan !== "Selesai" && t.laporan.status_laporan !== "Ditolak"
        ) || [];
        const activeReportsCount = new Set(activeReports.map(t => t.id_laporan)).size;
        return {
          id_pengurus: s.id_pengurus,
          nama_pengurus: s.nama_pengurus,
          fakultas: s.fakultas,
          prodi: s.prodi,
          role_nama: s.role.nama_role,
          activeReportsCount,
        };
      }),
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
