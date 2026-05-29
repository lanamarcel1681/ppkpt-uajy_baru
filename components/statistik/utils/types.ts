export interface Report {
    id_laporan: number;
    tgl_laporan: string;
    updatedAt: string;
    status_laporan: string;
    jenis_kekerasan: string | null;
    sanksi?: string | null;
    korban?: {
        fakultas_korban: string | null;
    };
    semester?: string;
}
