import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { judul, deskripsi, examples } = await request.json();
        const typeId = parseInt(id);

        const result = await prisma.$transaction(async (tx) => {
            // 1. Update main detail
            const updatedType = await tx.jenisKekerasan.update({
                where: { id: typeId },
                data: {
                    judul,
                    deskripsi,
                },
            });

            // 2. Handle examples (simplest strategy: delete all and recreate)
            // This avoids complex diffing logic for this simple use case
            await tx.contohKekerasan.deleteMany({
                where: { id_jeniskekerasan: typeId },
            });

            if (examples && examples.length > 0) {
                await tx.contohKekerasan.createMany({
                    data: examples.map((ex: string) => ({
                        isi_contoh: ex,
                        id_jeniskekerasan: typeId,
                    })),
                });
            }

            return await tx.jenisKekerasan.findUnique({
                where: { id: typeId },
                include: { contoh: true },
            });
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in PUT /api/cms/kekerasan/[id]:", error);
        return NextResponse.json(
            { error: "Failed to update jenis kekerasan" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const typeId = parseInt(id);

        // Cascade delete is not set in DB level, so we handle it manually in transaction or let Prisma handle it if configured
        // Since we didn't configure cascade in schema explicitly (though relation might handle it), strict approach is better
        await prisma.$transaction(async (tx) => {
            await tx.contohKekerasan.deleteMany({
                where: { id_jeniskekerasan: typeId },
            });
            await tx.jenisKekerasan.delete({
                where: { id: typeId },
            });
        });

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Error in DELETE /api/cms/kekerasan/[id]:", error);
        return NextResponse.json(
            { error: "Failed to delete jenis kekerasan" },
            { status: 500 }
        );
    }
}
