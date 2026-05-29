import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    let profil = await prisma.profilSatgas.findFirst();

    if (!profil) {
      profil = await prisma.profilSatgas.create({
        data: {
          deskripsi_profil: "",
          visi: "",
          misi: "",
        },
      });
    }

    return NextResponse.json(profil);
  } catch (error) {
    console.error("Error fetching profil:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { deskripsi_profil, visi, misi } = body;

    let profil = await prisma.profilSatgas.findFirst();

    if (profil) {
      profil = await prisma.profilSatgas.update({
        where: { id_profilsatgas: profil.id_profilsatgas },
        data: {
          deskripsi_profil,
          visi,
          misi,
        },
      });
    } else {
      profil = await prisma.profilSatgas.create({
        data: {
          deskripsi_profil,
          visi,
          misi,
        },
      });
    }

    return NextResponse.json(profil);
  } catch (error) {
    console.error("Error updating profil:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
