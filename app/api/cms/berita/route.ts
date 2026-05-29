import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// function createSlug is implemented inline below

// Helper to create slug
function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function GET() {
  try {
    const berita = await prisma.berita.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(berita);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat berita" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.judul || !body.konten) {
      return NextResponse.json(
        { error: "Judul dan konten wajib diisi" },
        { status: 400 },
      );
    }

    let slug = createSlug(body.judul);

    // Ensure slug uniqueness
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.berita.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const newBerita = await prisma.berita.create({
      data: {
        judul: body.judul,
        slug: uniqueSlug,
        kategori: body.kategori || "Umum",
        konten: body.konten,
        excerpt: body.excerpt || body.konten.substring(0, 150) + "...",
        penulis: body.penulis || "Admin", // Default to Admin if not provided
        gambarUrl: body.gambarUrl, // Mandatory as per new requirement
        dokumentasi1: body.dokumentasi1,
        dokumentasi2: body.dokumentasi2,
      },
    });

    if (!body.gambarUrl) {
      return NextResponse.json(
        { error: "Gambar header wajib diupload" },
        { status: 400 },
      );
    }

    return NextResponse.json(newBerita, { status: 201 });
  } catch (error) {
    console.error("Error creating berita:", error);
    return NextResponse.json(
      { error: "Gagal membuat berita" },
      { status: 500 },
    );
  }
}
