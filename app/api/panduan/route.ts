import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const kategori = searchParams.get("kategori");

        // Filter based on kategori if provided
        const whereClause = kategori ? { kategori } : {};

        const panduans = await prisma.panduanSistem.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ data: panduans }, { status: 200 });
    } catch (error) {
        console.error("Error fetching panduans:", error);
        return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const judul = formData.get("judul") as string | null;
        const kategori = formData.get("kategori") as string | null || "Internal";

        if (!file || !judul) {
            return NextResponse.json({ message: "File and Judul are required" }, { status: 400 });
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json({ message: "Only PDF files are allowed" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define upload directory and ensure it exists
        const uploadDir = path.join(process.cwd(), "public/uploads/panduan");
        await fs.mkdir(uploadDir, { recursive: true });

        // Build a unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileName = `${uniqueSuffix}-${file.name.replace(/\s+/g, "_")}`;
        const filePath = path.join(uploadDir, fileName);

        // Save the actual file
        await fs.writeFile(filePath, buffer);

        // Save info to database
        const newPanduan = await prisma.panduanSistem.create({
            data: {
                judul,
                kategori,
                file_url: `/uploads/panduan/${fileName}`,
            },
        });

        return NextResponse.json({ message: "Upload success", data: newPanduan }, { status: 201 });
    } catch (error) {
        console.error("Error uploading panduan:", error);
        return NextResponse.json({ message: "Error uploading file" }, { status: 500 });
    }
}
