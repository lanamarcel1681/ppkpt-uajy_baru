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
    const { nama } = body;

    const updatedFakultas = await prisma.fakultas.update({
      where: { id },
      data: { nama },
    });

    return NextResponse.json(updatedFakultas);
  } catch (error) {
    console.error("Error updating fakultas:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate fakultas" },
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

    await prisma.fakultas.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Fakultas berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting fakultas:", error);
    return NextResponse.json(
      { error: "Gagal menghapus fakultas" },
      { status: 500 },
    );
  }
}
