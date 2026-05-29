import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil data profile berdasarkan email
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json(
                { message: "Email parameter wajib diisi" },
                { status: 400 }
            );
        }

        const user = await prisma.pengurus.findUnique({
            where: { email_pengurus: email },
            include: {
                role: true,
                anggotaTim: true
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User tidak ditemukan" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Berhasil mengambil data profile",
            data: {
                nama: user.nama_pengurus,
                email: user.email_pengurus,
                role: user.role.nama_role,
                prodi: user.prodi,
                fakultas: user.fakultas,
                status: user.is_aktif ? "Aktif" : "Tidak Aktif",
                fotoUrl: user.anggotaTim?.[0]?.fotoUrl || null,
                // Format join date jika ada createdAt, jika tidak pakai default/mock
                joinDate: user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
                    : "Januari 2026",
            },
        });
    } catch (error) {
        console.error("Profile API Error:", error);
        return NextResponse.json(
            { message: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

// PUT: Update data profile
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { email, nama, prodi, fakultas, password, passwordBaru } = body;

        if (!email) {
            return NextResponse.json(
                { message: "Identitas user tidak valid" },
                { status: 400 }
            );
        }

        // Cek user eksisting
        const user = await prisma.pengurus.findUnique({
            where: { email_pengurus: email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User tidak ditemukan" },
                { status: 404 }
            );
        }

        // Objek update
        const updateData: any = {
            nama_pengurus: nama,
            prodi: prodi,
            fakultas: fakultas,
        };

        // Jika ingin ubah password
        if (passwordBaru) {
            // Verifikasi password lama (sederhana/plain text sesuai kondisi saat ini)
            // Di production sebaiknya hashing bcrypt
            if (user.password !== password) {
                return NextResponse.json(
                    { message: "Password lama salah. Gagal mengubah password." },
                    { status: 401 }
                );
            }
            updateData.password = passwordBaru;
        }

        const updatedUser = await prisma.pengurus.update({
            where: { email_pengurus: email },
            data: updateData,
        });

        return NextResponse.json({
            message: "Profil berhasil diperbarui",
            data: {
                nama: updatedUser.nama_pengurus,
                email: updatedUser.email_pengurus,
                prodi: updatedUser.prodi,
                fakultas: updatedUser.fakultas,
            }
        });

    } catch (error) {
        console.error("Profile Update Error:", error);
        return NextResponse.json(
            { message: "Gagal memperbarui profil" },
            { status: 500 }
        );
    }
}
