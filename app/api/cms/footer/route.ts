import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let config = await prisma.konfigurasiFooter.findFirst();

    if (!config) {
      config = await prisma.konfigurasiFooter.create({
        data: {
          footerTitle: "Satgas PPKPT",
          footerDescription:
            "Menciptakan lingkungan kampus yang aman dan bebas dari kekerasan seksual.",
          alamat:
            "Gedung Rektorat Lt. 2\nUniversitas Atma Jaya Yogyakarta\nJl. Babarsari No.44, Yogyakarta",
          email: "satgas@uajy.ac.id",
          telepon: "0800-123-4567",
        },
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching footer config:", error);
    return NextResponse.json(
      { message: "Gagal mengambil konfigurasi footer" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      footerTitle,
      footerDescription,
      alamat,
      email,
      telepon,
      footerLogoUrl,
      facebookUrl,
      instagramUrl,
      twitterUrl,
      youtubeUrl,
    } = body;

    const config = await prisma.konfigurasiFooter.findFirst();

    if (config) {
      const updatedConfig = await prisma.konfigurasiFooter.update({
        where: { id: config.id },
        data: {
          footerTitle,
          footerDescription,
          alamat,
          email,
          telepon,
          footerLogoUrl: footerLogoUrl || null,
          facebookUrl: facebookUrl || null,
          instagramUrl: instagramUrl || null,
          twitterUrl: twitterUrl || null,
          youtubeUrl: youtubeUrl || null,
        },
      });
      return NextResponse.json(updatedConfig);
    } else {
      // Should not happen if GET is called first, but handle create
      const newConfig = await prisma.konfigurasiFooter.create({
        data: {
          footerTitle,
          footerDescription,
          alamat,
          email,
          telepon,
          footerLogoUrl: footerLogoUrl || null,
          facebookUrl: facebookUrl || null,
          instagramUrl: instagramUrl || null,
          twitterUrl: twitterUrl || null,
          youtubeUrl: youtubeUrl || null,
        },
      });
      return NextResponse.json(newConfig);
    }
  } catch (error) {
    console.error("Error updating footer config:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan konfigurasi footer" },
      { status: 500 },
    );
  }
}
