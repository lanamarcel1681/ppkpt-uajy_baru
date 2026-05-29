import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tim = await prisma.anggotaTim.findMany({
      orderBy: { urutan: "asc" },
      include: {
        pengurus: {
          include: {
            role: true,
          },
        },
      },
    });
    return NextResponse.json(tim);
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
    const { nama, jabatan, fotoUrl, id_pengurus } = body;

    const tim = await prisma.anggotaTim.create({
      data: {
        nama,
        jabatan,
        fotoUrl,
        id_pengurus: id_pengurus ? Number(id_pengurus) : null,
      },
    });

    return NextResponse.json(tim);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, nama, jabatan, fotoUrl, id_pengurus } = body;

    const tim = await prisma.anggotaTim.update({
      where: { id: Number(id) },
      data: {
        nama,
        jabatan,
        fotoUrl,
        id_pengurus: id_pengurus ? Number(id_pengurus) : null,
      },
    });

    return NextResponse.json(tim);
  } catch (error) {
    console.error(error);
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

    await prisma.anggotaTim.delete({
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
