export function calculatePriority(
    tglLaporan: Date | string,
    updatedAt: Date | string,
    status: string
): "Rendah" | "Sedang" | "Tinggi" {
    const startDate = new Date(tglLaporan);
    let endDate = new Date(); // Default: hari ini

    // Jika laporan sudah selesai atau ditolak, prioritas otomatis kembali ke Rendah
    if (status === "Selesai" || status === "Ditolak") {
        return "Rendah";
    }

    // Hitung selisih dalam milidetik
    let diffTime = endDate.getTime() - startDate.getTime();
    if (diffTime < 0) diffTime = 0; // Guard terhadap waktu mundur

    // Konversi ke hari
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Logika prioritas
    // <= 10 hari -> Rendah
    // 11 - 20 hari -> Sedang
    // > 20 hari -> Tinggi
    if (diffDays <= 10) {
        return "Rendah";
    } else if (diffDays <= 20) {
        return "Sedang";
    } else {
        return "Tinggi";
    }
}
