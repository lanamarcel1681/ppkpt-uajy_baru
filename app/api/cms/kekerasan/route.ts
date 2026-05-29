import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const data = await prisma.jenisKekerasan.findMany({
            include: { contoh: true },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in GET /api/cms/kekerasan:", error);
        return NextResponse.json(
            { error: "Failed to fetch jenis kekerasan" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { judul, deskripsi, examples } = body;

        // Transaction to create JenisKekerasan and multiple ContohKekerasan
        const result = await prisma.$transaction(async (tx) => {
            const newType = await tx.jenisKekerasan.create({
                data: {
                    judul,
                    deskripsi,
                },
            });

            if (examples && examples.length > 0) {
                await tx.contohKekerasan.createMany({
                    data: examples.map((ex: string) => ({
                        isi_contoh: ex,
                        id_jeniskekerasan: newType.id,
                    })),
                });
            }

            // Fetch return data with relations
            return await tx.jenisKekerasan.findUnique({
                where: { id: newType.id },
                include: { contoh: true }
            })
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in POST /api/cms/kekerasan:", error);
        return NextResponse.json(
            { error: "Failed to create jenis kekerasan" },
            { status: 500 }
        );
    }
}
