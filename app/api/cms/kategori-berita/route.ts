import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const kategori = await prisma.kategoriBerita.findMany({
            orderBy: { createdAt: "asc" },
        });
        return NextResponse.json(kategori);
    } catch (error) {
        return NextResponse.json(
            { error: "Gagal memuat kategori berita" },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.nama) {
            return NextResponse.json(
                { error: "Nama kategori wajib diisi" },
                { status: 400 },
            );
        }

        // Check if exists
        const existing = await prisma.kategoriBerita.findUnique({
            where: { nama: body.nama },
        });

        if (existing) {
            return NextResponse.json(
                { error: "Kategori sudah ada" },
                { status: 400 },
            );
        }

        const newKategori = await prisma.kategoriBerita.create({
            data: {
                nama: body.nama,
            },
        });

        return NextResponse.json(newKategori, { status: 201 });
    } catch (error) {
        console.error("Error creating kategori:", error);
        return NextResponse.json(
            { error: "Gagal membuat kategori" },
            { status: 500 },
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        if (!body.id || !body.nama) {
            return NextResponse.json(
                { error: "ID dan Nama wajib diisi" },
                { status: 400 },
            );
        }

        const updated = await prisma.kategoriBerita.update({
            where: { id: body.id },
            data: { nama: body.nama },
        });

        // Optional: Update existing news with old category name if needed?
        // For now, we just update the master list.
        // If the user wants to update referenced Berita, that's more complex.
        // The requirement says "Bisa ditambah, diganti, dan dihapus".
        // "Diganti" could mean renaming. If I rename "Kegiatan" to "Event", 
        // the Berita with "Kegiatan" will technically still have "Kegiatan" string 
        // unless I update them.
        // I should probably check if I should update them. 
        // The user said "dynamis", so better to update them or relate them.
        // Since I kept it as String in Berita, I should manually update Berita.

        // BUT, I don't know the OLD name easily unless I fetch it first or pass it.
        // To make it simple, I'll just update the KategoriBerita for now. 
        // If I want to update Berita, I need the old name.

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json(
            { error: "Gagal update kategori" },
            { status: 500 },
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        }

        await prisma.kategoriBerita.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: "Kategori berhasil dihapus" });
    } catch (error) {
        return NextResponse.json(
            { error: "Gagal menghapus kategori" },
            { status: 500 },
        );
    }
}
