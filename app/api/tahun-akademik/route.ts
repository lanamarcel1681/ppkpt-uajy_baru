import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tahunAkademik = await prisma.tahunAkademik.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(tahunAkademik);
  } catch (error) {
    console.error("Error fetching tahun akademik:", error);
    return NextResponse.json(
      { error: "Failed to fetch tahun akademik" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { nama, is_active } = await request.json();

    if (!nama) {
      return NextResponse.json({ error: "Nama is required" }, { status: 400 });
    }

    // Jika yang baru ini di-set active, nonaktifkan yang lain dulu
    if (is_active) {
      await prisma.tahunAkademik.updateMany({
        where: { is_active: true },
        data: { is_active: false },
      });
    }

    const newTahunAkademik = await prisma.tahunAkademik.create({
      data: {
        nama,
        is_active: is_active || false,
      },
    });

    return NextResponse.json(newTahunAkademik, { status: 201 });
  } catch (error) {
    console.error("Error creating tahun akademik:", error);
    return NextResponse.json(
      { error: "Failed to create tahun akademik" },
      { status: 500 },
    );
  }
}
