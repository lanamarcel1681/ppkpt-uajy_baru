import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil semua catatan untuk laporan tertentu
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const id_laporan = parseInt(id);

        if (isNaN(id_laporan)) {
            return NextResponse.json(
                { message: "Invalid ID Laporan" },
                { status: 400 }
            );
        }

        const catatan = await prisma.catatan.findMany({
            where: {
                id_laporan: id_laporan,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return NextResponse.json(catatan);
    } catch (error) {
        console.error("Error fetching notes:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST: Tambah catatan baru
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const id_laporan = parseInt(id);
        const body = await request.json();
        const { isi_catatan, penulis_nama, penulis_role } = body;

        if (isNaN(id_laporan) || !isi_catatan || !penulis_nama) {
            return NextResponse.json(
                { message: "Invalid Data" },
                { status: 400 }
            );
        }

        const newCatatan = await prisma.catatan.create({
            data: {
                id_laporan,
                isi_catatan,
                penulis_nama,
                penulis_role: penulis_role || "Admin",
            },
        });

        return NextResponse.json(newCatatan, { status: 201 });
    } catch (error) {
        console.error("Error creating note:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
