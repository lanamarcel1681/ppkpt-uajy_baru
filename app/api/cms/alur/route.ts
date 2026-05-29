import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Asumsi Alur Kerja adalah singleton (row pertama atau id tertentu)
    // Kita gunakan findFirst
    const alur = await prisma.alurPelaporan.findFirst({
      orderBy: { id_alurpelaporan: "asc" },
    });
    return NextResponse.json(alur || {});
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data alur" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { judul, deskripsi, gambar_url } = body;

    // Cek apakah sudah ada data
    const existing = await prisma.alurPelaporan.findFirst({
      orderBy: { id_alurpelaporan: "asc" },
    });

    let result;
    if (existing) {
      result = await prisma.alurPelaporan.update({
        where: { id_alurpelaporan: existing.id_alurpelaporan },
        data: {
          judul,
          deskripsi,
          gambar_url,
        },
      });
    } else {
      result = await prisma.alurPelaporan.create({
        data: {
          judul,
          deskripsi,
          gambar_url,
        },
      });
    }

    return NextResponse.json({ message: "Berhasil disimpan", data: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal menyimpan data alur" },
      { status: 500 },
    );
  }
}
