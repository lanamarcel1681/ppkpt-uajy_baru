import React from "react";
import { Trash2, Edit2 } from "lucide-react";

interface Contoh {
    id: number;
    isi_contoh: string;
}

interface JenisKekerasan {
    id: number;
    judul: string;
    deskripsi: string;
    contoh: Contoh[];
}

interface KekerasanCardProps {
    data: JenisKekerasan;
    onEdit: (data: JenisKekerasan) => void;
    onDelete: (id: number) => void;
}

export default function KekerasanCard({
    data,
    onEdit,
    onDelete,
}: KekerasanCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-gray-900">{data.judul}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(data)}
                        className="p-1.5 text-blue-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(data.id)}
                        className="p-1.5 text-red-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {data.deskripsi}
            </p>

            <div className="mt-auto">
                <p className="text-xs font-semibold text-gray-400 mb-2">
                    {data.contoh.length} contoh
                </p>
            </div>
        </div>
    );
}
