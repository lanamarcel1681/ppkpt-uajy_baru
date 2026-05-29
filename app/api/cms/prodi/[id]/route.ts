import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { nama, id_fakultas } = body;

    const updatedProdi = await prisma.programStudi.update({
      where: { id },
      data: {
        nama,
        ...(id_fakultas && { id_fakultas: parseInt(id_fakultas) }), // Update ID fakultas if provided
      },
    });

    return NextResponse.json(updatedProdi);
  } catch (error) {
    console.error("Error updating prodi:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate program studi" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id);

    await prisma.programStudi.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Program Studi berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting prodi:", error);
    return NextResponse.json(
      { error: "Gagal menghapus program studi" },
      { status: 500 },
    );
  }
}
