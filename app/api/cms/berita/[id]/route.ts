import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);
    const berita = await prisma.berita.findUnique({
      where: { id },
    });

    if (!berita) {
      return NextResponse.json(
        { error: "Berita tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(berita);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat berita" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);
    const body = await request.json();

    const updatedBerita = await prisma.berita.update({
      where: { id },
      data: {
        judul: body.judul,
        kategori: body.kategori,
        konten: body.konten,
        excerpt: body.excerpt,
        penulis: body.penulis,
        gambarUrl: body.gambarUrl,
        dokumentasi1: body.dokumentasi1,
        dokumentasi2: body.dokumentasi2,
        // Slug usually shouldn't change to maintain SEO, or handle carefully
      },
    });

    return NextResponse.json(updatedBerita);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengupdate berita" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const params = await props.params;
    const id = parseInt(params.id);
    await prisma.berita.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Berita berhasil dihapus" });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghapus berita" },
      { status: 500 },
    );
  }
}
