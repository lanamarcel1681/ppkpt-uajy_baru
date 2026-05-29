import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { unlink, writeFile, mkdir } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// DELETE: Hapus Laporan
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const report = await prisma.laporanAkhirSemester.findUnique({
      where: { id: id },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Delete file if exists
    if (report.fileUrl) {
      const filePath = path.join(process.cwd(), "public", report.fileUrl);
      try {
        await unlink(filePath);
      } catch (err) {
        console.warn("File not found, skipping delete:", filePath);
      }
    }

    await prisma.laporanAkhirSemester.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// PUT: Update Laporan (With optional file replacement)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const formData = await request.formData();
    const judul = formData.get("judul") as string;
    const semester = formData.get("semester") as string;
    const file = formData.get("file") as File | null;

    if (!judul || !semester) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingReport = await prisma.laporanAkhirSemester.findUnique({
      where: { id: id },
    });

    if (!existingReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    let fileUrl = existingReport.fileUrl;
    let tipeFile = existingReport.tipeFile;

    // Replace file if new one provided
    if (file && file.size > 0) {
      // 1. Delete old file
      if (existingReport.fileUrl) {
        const oldPath = path.join(
          process.cwd(),
          "public",
          existingReport.fileUrl,
        );
        try {
          await unlink(oldPath);
        } catch (err) {
          console.warn("Failed to delete old file:", err);
        }
      }

      // 2. Save new file
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `laporan-${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/laporan");

      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (e) {}

      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      fileUrl = `/uploads/laporan/${filename}`;
      const ext = path.extname(file.name).toLowerCase();
      tipeFile = ext === ".pdf" ? "pdf" : "docx";
    }

    const updatedReport = await prisma.laporanAkhirSemester.update({
      where: { id: id },
      data: {
        judul,
        semester,
        fileUrl,
        tipeFile,
      },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
