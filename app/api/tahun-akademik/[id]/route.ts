import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const tahunAkademik = await prisma.tahunAkademik.findUnique({
      where: { id_tahunakademik: id },
    });

    if (!tahunAkademik) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(tahunAkademik);
  } catch (error) {
    console.error("Error fetching tahun akademik:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const { nama, is_active } = body;

    // Jika yang di-update di-set active, nonaktifkan yang lain dulu
    if (is_active === true) {
      await prisma.tahunAkademik.updateMany({
        where: {
          id_tahunakademik: { not: id },
          is_active: true,
        },
        data: { is_active: false },
      });
    }

    const updatedData: any = {};
    if (nama !== undefined) updatedData.nama = nama;
    if (is_active !== undefined) updatedData.is_active = is_active;

    const updatedTahunAkademik = await prisma.tahunAkademik.update({
      where: { id_tahunakademik: id },
      data: updatedData,
    });

    return NextResponse.json(updatedTahunAkademik);
  } catch (error) {
    console.error("Error updating tahun akademik:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.tahunAkademik.delete({
      where: { id_tahunakademik: id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting tahun akademik:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
