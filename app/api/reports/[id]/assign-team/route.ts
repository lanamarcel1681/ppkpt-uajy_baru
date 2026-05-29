import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const reportId = parseInt(id);
        const body = await request.json();
        const { korbanTeamIds, pelakuTeamIds } = body; // Array of IDs

        if (!korbanTeamIds || !pelakuTeamIds) {
            return NextResponse.json(
                { error: "Invalid data" },
                { status: 400 }
            );
        }

        // Transaction to ensure atomicity
        await prisma.$transaction(async (tx) => {
            // 1. Delete existing assignments for this report to avoid duplicates/stale data
            await tx.timPenanganan.deleteMany({
                where: { id_laporan: reportId },
            });

            // 2. Insert Tim Korban
            if (korbanTeamIds.length > 0) {
                await tx.timPenanganan.createMany({
                    data: korbanTeamIds.map((userId: number) => ({
                        id_laporan: reportId,
                        id_pengurus: userId,
                        posisi: "Tim Korban",
                    })),
                });
            }

            // 3. Insert Tim Pelaku
            if (pelakuTeamIds.length > 0) {
                await tx.timPenanganan.createMany({
                    data: pelakuTeamIds.map((userId: number) => ({
                        id_laporan: reportId,
                        id_pengurus: userId,
                        posisi: "Tim Pelaku",
                    })),
                });
            }

            // Optional: Update report status to "Diproses" or "Investigasi" if needed
            // await tx.laporan.update({ where: { id_laporan: reportId }, data: { status_laporan: "Investigasi" } });
        });

        return NextResponse.json({ success: true, message: "Tim berhasil di-assign" });
    } catch (error) {
        console.error("Error assigning team:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
