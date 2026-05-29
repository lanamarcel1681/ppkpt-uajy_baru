"use client";

import { Edit, Trash2 } from "lucide-react";

interface Role {
  id_role: number;
  nama_role: string;
  _count?: {
    pengurus: number;
  };
}

interface RoleListProps {
  data: Role[];
  onEdit: (role: Role) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export default function RoleList({
  data,
  onEdit,
  onDelete,
  loading,
}: RoleListProps) {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1E4278] mx-auto"></div>
        <p className="mt-4 text-gray-500">Memuat data role...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <p className="text-gray-500">Belum ada role yang ditambahkan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th className="px-6 py-4 w-20">ID</th>
              <th className="px-6 py-4">Nama Role</th>
              <th className="px-6 py-4">Jumlah Pengguna</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {data.map((item) => (
              <tr
                key={item.id_role}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-gray-500">
                  #{item.id_role}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {item.nama_role}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {item._count?.pengurus || 0} Pengguna
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-gray-400 hover:text-[#1E4278] p-1.5 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Role"
                    >
                      <Edit size={18} />
                    </button>
                    {item._count?.pengurus === 0 && (
                      <button
                        onClick={() => onDelete(item.id_role)}
                        className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition"
                        title="Hapus Role"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
