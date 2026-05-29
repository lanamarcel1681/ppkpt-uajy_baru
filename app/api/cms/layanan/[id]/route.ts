import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const id = parseInt(params.id);
        const body = await request.json();

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const layanan = await prisma.layanan.update({
            where: { id },
            data: {
                title: body.title,
                desc: body.desc,
                iconBg: body.iconBg,
                icon: body.icon,
            },
        });
        return NextResponse.json(layanan);
    } catch (error) {
        console.error("Error update layanan:", error);
        return NextResponse.json(
            { error: "Failed to update layanan" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        await prisma.layanan.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Layanan deleted successfully" });
    } catch (error) {
        console.error("Error delete layanan:", error);
        return NextResponse.json(
            { error: "Failed to delete layanan" },
            { status: 500 }
        );
    }
}
