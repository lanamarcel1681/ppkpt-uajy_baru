import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    request: Request,
    props: { params: Promise<{ id: string }> },
) {
    const params = await props.params;
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { message: "Invalid ID format" },
                { status: 400 },
            );
        }

        const report = await prisma.laporan.findUnique({
            where: {
                id_laporan: id,
            },
            include: {
                logPelaporan: {
                    orderBy: {
                        waktu: "asc",
                    },
                },
            },
        });

        if (!report) {
            return NextResponse.json(
                { message: "Laporan tidak ditemukan" },
                { status: 404 },
            );
        }

        if (report.status_laporan !== "Diproses") {
            return NextResponse.json(
                { message: "Laporan tidak sedang diproses" },
                { status: 400 },
            );
        }

        // Calculate start processing date
        const processedLog = report.logPelaporan.find(log => log.deskripsi_log === "Laporan Diproses");
        if (!processedLog) {
            return NextResponse.json(
                { message: "Laporan belum pernah diproses" },
                { status: 400 },
            );
        }
        const processedDate = new Date(processedLog.waktu);

        // Calculate extensions
        const extensionLogs = report.logPelaporan.filter(log => log.deskripsi_log === "Tenggat Waktu Diperpanjang");
        const jumlah_perpanjangan = extensionLogs.length;

        if (jumlah_perpanjangan >= 2) {
            return NextResponse.json(
                { message: "Maksimal perpanjangan telah tercapai" },
                { status: 400 },
            );
        }

        // Calculate CURRENT deadline that we are comparing against (before this action)
        let deadline: Date;
        if (jumlah_perpanjangan > 0) {
            const latestExtensionDate = new Date(extensionLogs[extensionLogs.length - 1].waktu);
            deadline = new Date(latestExtensionDate);
            deadline.setDate(deadline.getDate() + 30);
        } else {
            deadline = new Date(processedDate);
            deadline.setDate(deadline.getDate() + 30);
        }

        // Check if it's within 7 days of the deadline
        const now = new Date();
        const timeDiffMs = deadline.getTime() - now.getTime();
        const diffDays = Math.ceil(timeDiffMs / (1000 * 60 * 60 * 24));

        if (diffDays > 7) {
            return NextResponse.json(
                { message: "Hanya dapat diperpanjang H-7 sebelum tenggat waktu" },
                { status: 400 },
            );
        }

        // Create a new log for the extension
        const result = await prisma.logPelaporan.create({
            data: {
                id_laporan: id,
                deskripsi_log: "Tenggat Waktu Diperpanjang",
                waktu: new Date(),
            },
        });

        return NextResponse.json({
            message: "Tenggat waktu berhasil diperpanjang",
            data: result,
        });
    } catch (error) {
        console.error("Error extending deadline:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
        );
    }
}
