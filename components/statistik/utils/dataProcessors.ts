import { Report } from "./types";

export const processMonthlyData = (reports: Report[]) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const data = months.map(m => ({ month: m, masuk: 0, selesai: 0, tolak: 0 }));

    reports.forEach(r => {
        const d = new Date(r.tgl_laporan);
        data[d.getMonth()].masuk++;

        if (r.status_laporan === "Selesai") {
            const fd = new Date(r.updatedAt);
            data[fd.getMonth()].selesai++;
        } else if (r.status_laporan === "Ditolak") {
            const fd = new Date(r.updatedAt);
            data[fd.getMonth()].tolak++;
        }
    });
    return data;
};

export const processViolenceData = (reports: Report[]) => {
    const map: Record<string, number> = {};
    reports.forEach(r => {
        const types = r.jenis_kekerasan ? r.jenis_kekerasan.split(",").map(t => t.trim()) : ["Lainnya"];
        types.forEach(t => {
            map[t] = (map[t] || 0) + 1;
        });
    });
    return Object.entries(map).map(([name, value], i) => ({
        name,
        value,
        color: ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ec4899", "#6366f1"][i % 7]
    }));
};

export const processStatusData = (reports: Report[]) => {
    const map: Record<string, number> = { "Diproses": 0, "Selesai": 0 };
    reports.forEach(r => {
        if (r.status_laporan === "Selesai") {
            map["Selesai"]++;
        } else {
            map["Diproses"]++;
        }
    });
    return [
        { name: "Diproses", value: map["Diproses"] },
        { name: "Selesai", value: map["Selesai"] }
    ];
};

export const processDurationData = (reports: Report[]) => {
    const buckets = { "< 7 hari": 0, "7–14 hari": 0, "14–30 hari": 0, "> 30 hari": 0 };
    reports.forEach(r => {
        if (r.status_laporan === "Selesai") {
            const start = new Date(r.tgl_laporan).getTime();
            const end = new Date(r.updatedAt).getTime();
            const diff = Math.ceil((end - start) / (86400000));
            if (diff < 7) buckets["< 7 hari"]++;
            else if (diff <= 14) buckets["7–14 hari"]++;
            else if (diff <= 30) buckets["14–30 hari"]++;
            else buckets["> 30 hari"]++;
        }
    });
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
};

export const processSanksiData = (reports: Report[]) => {
    const map: Record<string, number> = {};
    reports.forEach(r => {
        if (r.sanksi) {
            map[r.sanksi] = (map[r.sanksi] || 0) + 1;
        }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
};
