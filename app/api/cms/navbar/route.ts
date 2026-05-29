import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const config = await prisma.konfigurasiBeranda.findFirst({
      where: { id: 1 },
      select: {
        navbarTitle: true,
        navbarSubtitle: true,
        navbarLogoUrl: true,
      },
    });

    return NextResponse.json(config || {});
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil konfigurasi navbar" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { navbarTitle, navbarSubtitle, navbarLogoUrl } = body;

    const config = await prisma.konfigurasiBeranda.upsert({
      where: { id: 1 },
      update: {
        navbarTitle,
        navbarSubtitle,
        navbarLogoUrl,
      },
      create: {
        id: 1,
        // Fields lain harus ada default atau null di schema,
        // tapi KonfigurasiBeranda punya banyak field non-nullable tanpa default.
        // Kita asumsikan row id:1 sudah ada karena init script atau auto-create di tempat lain.
        // Jika belum ada, upsert create ini akan gagal jika ada field required lain yg missing.
        // Untuk aman, kita gunakan updateM`any atau asumsikan seed data sudah ada.
        // Tapi upsert butuh create body lengkap.
        // Kita akan coba update dulu.
        heroTitle: "Default Title",
        heroSubtitle: "Default Subtitle",
        ctaTitle: "Default CTA",
        ctaSubtitle: "Default CTA Sub",
        navbarTitle,
        navbarSubtitle,
        navbarLogoUrl,
      },
    });

    return NextResponse.json({ message: "Berhasil disimpan", config });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal menyimpan konfigurasi navbar" },
      { status: 500 },
    );
  }
}
