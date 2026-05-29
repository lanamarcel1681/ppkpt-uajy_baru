import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { unlink, writeFile, mkdir } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// DELETE: Hapus Arsip
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

    // Cari Arsip
    const arsip = await prisma.arsip.findUnique({
      where: { id_arsip: id },
    });

    if (!arsip) {
      return NextResponse.json({ error: "Arsip not found" }, { status: 404 });
    }

    // Hapus file fisik
    if (arsip.file_url) {
      const filePath = path.join(process.cwd(), "public", arsip.file_url);
      try {
        await unlink(filePath);
      } catch (err) {
        console.warn("File not found on disk, skipping delete:", filePath);
      }
    }

    // Hapus data
    await prisma.arsip.delete({
      where: { id_arsip: id },
    });

    return NextResponse.json({ message: "Arsip deleted successfully" });
  } catch (error) {
    console.error("Error deleting Arsip:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// PUT: Update Arsip (With optional file replacement)
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
    const judul_arsip = formData.get("judul_arsip") as string;
    const file = formData.get("file") as File | null;

    if (!judul_arsip) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingArsip = await prisma.arsip.findUnique({
      where: { id_arsip: id },
    });

    if (!existingArsip) {
      return NextResponse.json({ error: "Arsip not found" }, { status: 404 });
    }

    let file_url = existingArsip.file_url;

    // If new file uploaded, replace the old one
    if (file && file.size > 0) {
      // 1. Delete old file
      if (existingArsip.file_url) {
        const oldPath = path.join(
          process.cwd(),
          "public",
          existingArsip.file_url,
        );
        try {
          await unlink(oldPath);
        } catch (err) {
          console.warn("Failed to delete old file:", err);
        }
      }

      // 2. Save new file
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `arsip-${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/arsip");

      // Ensure dir exists
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (e) {
        // ignore if exists
      }

      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      file_url = `/uploads/arsip/${filename}`;
    }

    const updatedArsip = await prisma.arsip.update({
      where: { id_arsip: id },
      data: {
        judul_arsip,
        file_url,
      },
    });

    return NextResponse.json(updatedArsip);
  } catch (error) {
    console.error("Error updating Arsip:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
