import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const layanan = await prisma.layanan.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(layanan);
    } catch (error) {
        console.error("Error in GET /api/cms/layanan:", error);
        return NextResponse.json(
            { error: "Failed to fetch layanan" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const layanan = await prisma.layanan.create({
            data: {
                title: body.title,
                desc: body.desc,
                iconBg: body.iconBg,
                icon: body.icon,
            },
        });
        return NextResponse.json(layanan);
    } catch (error) {
        console.error("Error in POST /api/cms/layanan:", error);
        return NextResponse.json(
            { error: "Failed to create layanan" },
            { status: 500 }
        );
    }
}
