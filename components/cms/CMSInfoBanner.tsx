import React from "react";
import { Info } from "lucide-react";

export default function CMSInfoBanner() {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 text-blue-800 font-semibold mb-3 text-lg">
        <Info size={24} />
        <h3>Cara Menggunakan CMS</h3>
      </div>
      <ul className="space-y-2 ml-1">
        {[
          'Edit konten di setiap tab dan klik tombol "Simpan" untuk menyimpan perubahan',
          "Perubahan akan langsung terlihat di website utama setelah disimpan",
          'Gunakan tombol "Preview Website" untuk melihat hasil perubahan di tab baru',
          "Data disimpan di browser lokal (localStorage)",
        ].map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2 text-blue-700/80 text-sm"
          >
            <span className="mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
