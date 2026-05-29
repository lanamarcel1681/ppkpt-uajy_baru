import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username dan password wajib diisi" },
        { status: 400 },
      );
    }

    // Cari user berdasarkan email_pengurus
    const user = await prisma.pengurus.findFirst({
      where: {
        email_pengurus: username,
        is_aktif: true,
      },
      include: {
        role: true,
        anggotaTim: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Akun tidak ditemukan atau tidak aktif" },
        { status: 401 },
      );
    }

    // Verifikasi Password (Plain text)
    console.log(
      `[Login] Attempt for ${username}. DB Pass: '${user.password}', Input Pass: '${password}'`,
    );
    if (user.password !== password) {
      console.log(`[Login] Password Mismatch!`);
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    // Login Berhasil - Kembalikan data user
    return NextResponse.json({
      message: "Login berhasil",
      user: {
        username: user.nama_pengurus,
        email: user.email_pengurus,
        role: user.role.nama_role,
        avatar: user.anggotaTim?.[0]?.fotoUrl || null,
      },
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
