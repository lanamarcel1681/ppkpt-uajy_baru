
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const data = await prisma.fakultas.findMany({
            include: {
                prodi: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching fakultas:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data fakultas" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nama } = body;

        if (!nama) {
            return NextResponse.json(
                { error: "Nama Fakultas wajib diisi" },
                { status: 400 }
            );
        }

        const newFakultas = await prisma.fakultas.create({
            data: {
                nama,
            },
        });

        return NextResponse.json(newFakultas);
    } catch (error: any) {
        console.error("Error creating fakultas:", error);
        return NextResponse.json(
            { error: error?.message || "Gagal menambahkan fakultas" },
            { status: 500 }
        );
    }
}
