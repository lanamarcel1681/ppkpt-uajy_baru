import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const nilai = await prisma.nilaiSatgas.findMany({
      orderBy: { urutan: "asc" },
    });
    return NextResponse.json(nilai);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { judul, deskripsi } = body;

    const nilai = await prisma.nilaiSatgas.create({
      data: {
        judul,
        deskripsi,
      },
    });

    return NextResponse.json(nilai);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, judul, deskripsi } = body;

    const nilai = await prisma.nilaiSatgas.update({
      where: { id: Number(id) },
      data: {
        judul,
        deskripsi,
      },
    });

    return NextResponse.json(nilai);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.nilaiSatgas.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
