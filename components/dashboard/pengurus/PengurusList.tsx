"use client";

import { Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

interface Role {
  id_role: number;
  nama_role: string;
}

interface Pengurus {
  id_pengurus: number;
  nama_pengurus: string;
  email_pengurus: string;
  prodi: string | null;
  fakultas: string | null;
  is_aktif: boolean;
  role: Role;
}

interface PengurusListProps {
  data: Pengurus[];
  onEdit: (pengurus: Pengurus) => void;
  loading: boolean;
}

export default function PengurusList({
  data,
  onEdit,
  loading,
}: PengurusListProps) {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1E4278] mx-auto"></div>
        <p className="mt-4 text-gray-500">Memuat data pengurus...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <p className="text-gray-500">Belum ada data pengurus.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Fakultas</th>
              <th className="px-6 py-4">Prodi</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {data.map((item) => (
              <tr
                key={item.id_pengurus}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {item.nama_pengurus}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.email_pengurus}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.role.nama_role === "Administrator"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.role.nama_role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.fakultas || <span className="text-gray-300">-</span>}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.prodi || <span className="text-gray-300">-</span>}
                </td>
                <td className="px-6 py-4 text-center">
                  {item.is_aktif ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded-full">
                      <CheckCircle size={12} /> Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 text-xs font-semibold bg-red-50 px-2 py-1 rounded-full">
                      <XCircle size={12} /> Nonaktif
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-gray-400 hover:text-[#1E4278] p-1.5 hover:bg-blue-50 rounded-lg transition"
                    title="Edit Pengurus"
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
