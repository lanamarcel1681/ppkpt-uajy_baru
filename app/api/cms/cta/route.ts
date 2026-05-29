import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch CTA Configuration
export async function GET() {
  try {
    const config = await prisma.konfigurasiBeranda.findUnique({
      where: { id: 1 },
      select: {
        ctaTitle: true,
        ctaSubtitle: true,
        ctaVideoUrl: true,
      },
    });

    if (!config) {
      // Return default values if not found (though seed should handle this)
      return NextResponse.json({
        ctaTitle: "Jangan Takut Melapor",
        ctaSubtitle: "Identitas pelapor akan kami rahasiakan.",
        ctaVideoUrl: "",
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching CTA config:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// PUT: Update CTA Configuration
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { ctaTitle, ctaSubtitle, ctaVideoUrl } = body;

    const updatedConfig = await prisma.konfigurasiBeranda.upsert({
      where: { id: 1 },
      update: {
        ctaTitle,
        ctaSubtitle,
        ctaVideoUrl,
      },
      create: {
        id: 1,
        // Fill other required string fields with placeholders/empty if creating new
        heroTitle: "Satgas PPKPT",
        heroSubtitle: "Universitas Atma Jaya Yogyakarta",
        ctaTitle,
        ctaSubtitle,
        ctaVideoUrl,
      },
    });

    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error("Error updating CTA config:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
