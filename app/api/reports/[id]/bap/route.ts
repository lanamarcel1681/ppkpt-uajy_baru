import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Updated for Next.js 15
) {
    try {
        const { id } = await params;
        const reportId = parseInt(id);

        if (isNaN(reportId)) {
            return NextResponse.json({ error: "Invalid Report ID" }, { status: 400 });
        }

        const documents = await prisma.dokumenLaporan.findMany({
            where: {
                id_laporan: reportId,
                jenis_file: "BAP",
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ documents });
    } catch (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Updated for Next.js 15
) {
    try {
        const { id } = await params;
        const reportId = parseInt(id);

        if (isNaN(reportId)) {
            return NextResponse.json({ error: "Invalid Report ID" }, { status: 400 });
        }

        const formData = await request.formData();
        const files = formData.getAll("file") as File[];
        const keterangan = formData.get("keterangan") as string || "";

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), "public/uploads/bap");

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            console.error("Error creating directory:", e);
        }

        const savedDocuments = [];

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
            const filepath = path.join(uploadDir, filename);

            await writeFile(filepath, buffer);

            const doc = await prisma.dokumenLaporan.create({
                data: {
                    id_laporan: reportId,
                    nama_file: file.name,
                    url_file: `/uploads/bap/${filename}`,
                    jenis_file: "BAP",
                    keterangan: keterangan,
                },
            });
            savedDocuments.push(doc);
        }

        return NextResponse.json({ message: "Files uploaded successfully", documents: savedDocuments });

    } catch (error) {
        console.error("Error uploading files:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
