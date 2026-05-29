import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const config = await prisma.konfigurasiBeranda.findFirst({
      where: { id: 1 },
    });
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memuat konfigurasi" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const config = await prisma.konfigurasiBeranda.upsert({
      where: { id: 1 },
      update: {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroHotlineNumber: body.heroHotlineNumber,
        heroImageUrl: body.heroImageUrl,
      },
      create: {
        id: 1,
        heroTitle: body.heroTitle || "",
        heroSubtitle: body.heroSubtitle || "",
        heroHotlineNumber: body.heroHotlineNumber,
        heroImageUrl: body.heroImageUrl,
        ctaTitle: "Jangan Takut Melapor", // Default
        ctaSubtitle: "Identitas pelapor akan kami rahasiakan.", // Default
      },
    });
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menyimpan perubahan" },
      { status: 500 },
    );
  }
}
