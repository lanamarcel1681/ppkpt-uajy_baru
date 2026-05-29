import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// GET: Fetch all reports or filter by semester
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const semester = searchParams.get("semester");

    const where: any = {};
    if (semester && semester !== "Semua Semester") {
      where.semester = semester;
    }

    const reports = await prisma.laporanAkhirSemester.findMany({
      where,
      include: {
        pengurus: {
          select: {
            nama_pengurus: true,
            role: {
              select: {
                nama_role: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST: Upload new report
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const judul = formData.get("judul") as string;
    const semester = formData.get("semester") as string;
    const id_pengurus = formData.get("id_pengurus") as string;

    if (!file || !judul || !semester || !id_pengurus) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and DOCX are allowed." },
        { status: 400 },
      );
    }

    const tipeFile = file.type === "application/pdf" ? "pdf" : "docx";

    // Save File
    const buffer = Buffer.from(await file.arrayBuffer());
    // Sanitize filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}_${safeName}`;
    const uploadDir = path.join(process.cwd(), "public/uploads/laporan_akhir");

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // dir exists
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/laporan_akhir/${filename}`;

    // Save to DB
    const newReport = await prisma.laporanAkhirSemester.create({
      data: {
        judul,
        semester,
        fileUrl,
        tipeFile,
        id_pengurus: parseInt(id_pengurus),
      },
      include: {
        pengurus: {
          select: {
            nama_pengurus: true,
            role: {
              select: {
                nama_role: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(newReport);
  } catch (error) {
    console.error("Error uploading report:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
