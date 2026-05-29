import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        if (isNaN(id)) {
            return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
        }

        const panduan = await prisma.panduanSistem.findUnique({
            where: { id_panduan: id },
        });

        if (!panduan) {
            return NextResponse.json({ message: "Panduan not found" }, { status: 404 });
        }

        // Hapus file fisik jika ada di public/uploads
        if (panduan.file_url && panduan.file_url.startsWith("/uploads/")) {
            const fileName = path.basename(panduan.file_url);
            const filePath = path.join(process.cwd(), "public", "uploads", fileName);
            try {
                await fs.unlink(filePath);
            } catch (err: any) {
                if (err.code !== 'ENOENT') {
                    console.error("Failed to delete physical file:", err);
                }
            }
        }

        // Hapus data dari DB
        await prisma.panduanSistem.delete({
            where: { id_panduan: id },
        });

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Error deleting panduan:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
