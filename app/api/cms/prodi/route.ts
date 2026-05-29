
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nama, id_fakultas } = body;

        if (!nama || !id_fakultas) {
            return NextResponse.json(
                { error: "Nama Prodi dan ID Fakultas wajib diisi" },
                { status: 400 }
            );
        }

        const newProdi = await prisma.programStudi.create({
            data: {
                nama,
                id_fakultas: parseInt(id_fakultas),
            },
        });

        return NextResponse.json(newProdi);
    } catch (error) {
        console.error("Error creating prodi:", error);
        return NextResponse.json(
            { error: "Gagal menambahkan program studi" },
            { status: 500 }
        );
    }
}
