import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: List semua role
export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      orderBy: {
        id_role: "asc",
      },
      include: {
        _count: {
          select: { pengurus: true },
        },
      },
    });
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data role" },
      { status: 500 },
    );
  }
}

// POST: Tambah role baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama_role } = body;

    if (!nama_role) {
      return NextResponse.json(
        { message: "Nama role wajib diisi" },
        { status: 400 },
      );
    }

    const newRole = await prisma.role.create({
      data: {
        nama_role: nama_role,
      },
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { message: "Gagal membuat role" },
      { status: 500 },
    );
  }
}

// PUT: Update role
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id_role, nama_role } = body;

    if (!id_role || !nama_role) {
      return NextResponse.json(
        { message: "ID role dan nama role wajib diisi" },
        { status: 400 },
      );
    }

    const updatedRole = await prisma.role.update({
      where: { id_role: Number(id_role) },
      data: {
        nama_role: nama_role,
      },
    });

    return NextResponse.json(updatedRole);
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { message: "Gagal mengupdate role" },
      { status: 500 },
    );
  }
}

// DELETE: Hapus role
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID role diperlukan" },
        { status: 400 },
      );
    }

    // Cek apakah ada pengurus yang menggunakan role ini
    const count = await prisma.pengurus.count({
      where: { id_role: Number(id) },
    });

    if (count > 0) {
      return NextResponse.json(
        {
          message:
            "Role tidak dapat dihapus karena sedang digunakan oleh Pengurus",
        },
        { status: 400 },
      );
    }

    await prisma.role.delete({
      where: { id_role: Number(id) },
    });

    return NextResponse.json({ message: "Role berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { message: "Gagal menghapus role" },
      { status: 500 },
    );
  }
}
