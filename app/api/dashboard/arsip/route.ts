import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// GET: Fetch all Arsip
export async function GET() {
  try {
    const arsip = await prisma.arsip.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(arsip);
  } catch (error) {
    console.error("Error fetching Arsip:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST: Upload new Arsip
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const judul_arsip = formData.get("judul_arsip") as string;

    if (!file || !judul_arsip) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/msword", // .doc
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Hanya file PDF, DOC, dan DOCX yang diperbolehkan" },
        { status: 400 },
      );
    }

    // Save File
    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}_${safeName}`;
    const uploadDir = path.join(process.cwd(), "public/uploads/arsip");

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // dir exists
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/arsip/${filename}`;

    // CREATE Arsip Record
    const newArsip = await prisma.arsip.create({
      data: {
        judul_arsip,
        file_url: fileUrl,
        status_arsip: "Arsip", // Default status
      },
    });

    return NextResponse.json(newArsip);
  } catch (error) {
    console.error("Error uploading Arsip:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
