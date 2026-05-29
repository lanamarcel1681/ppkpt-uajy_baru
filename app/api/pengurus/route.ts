import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: List semua pengurus
export async function GET() {
  try {
    const pengurus = await prisma.pengurus.findMany({
      include: {
        role: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(pengurus);
  } catch (error) {
    console.error("Error fetching pengurus:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data pengurus" },
      { status: 500 },
    );
  }
}

// POST: Tambah pengurus baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, email, password, id_role, is_aktif, prodi, fakultas } = body;

    // Validasi dasar
    if (!nama || !email || !password || !id_role) {
      return NextResponse.json(
        {
          message:
            "Data tidak lengkap (nama, email, password, role wajib diisi)",
        },
        { status: 400 },
      );
    }

    // Cek email unik
    const existingUser = await prisma.pengurus.findUnique({
      where: { email_pengurus: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 },
      );
    }

    // Create user
    // NOTE: Password disimpan plain text sesuai request user (existing pattern)
    // Di production sebaiknya di-hash (bcrypt)
    const newUser = await prisma.pengurus.create({
      data: {
        nama_pengurus: nama,
        email_pengurus: email,
        password: password,
        id_role: Number(id_role),
        is_aktif: is_aktif ?? true,
        prodi: prodi || null,
        fakultas: fakultas || null,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating pengurus:", error);
    return NextResponse.json(
      { message: "Gagal membuat pengurus" },
      { status: 500 },
    );
  }
}

// PUT: Update pengurus (Edit Info / Reset Password)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, nama, email, id_role, is_aktif, password, prodi, fakultas } =
      body;

    if (!id) {
      return NextResponse.json(
        { message: "ID pengurus diperlukan" },
        { status: 400 },
      );
    }

    // Data yang akan diupdate
    const updateData: any = {
      nama_pengurus: nama,
      email_pengurus: email,
      id_role: Number(id_role),
      is_aktif: is_aktif,
      prodi: prodi || null,
      fakultas: fakultas || null,
    };

    // Jika password dikirim (tidak kosong), maka update password (Reset)
    if (password && password.trim() !== "") {
      updateData.password = password;
    }

    const updatedUser = await prisma.pengurus.update({
      where: { id_pengurus: id },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating pengurus:", error);

    // Handle unique constraint error (email duplicate)
    // @ts-ignore
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Email sudah digunakan oleh pengguna lain" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Gagal mengupdate pengurus" },
      { status: 500 },
    );
  }
}
