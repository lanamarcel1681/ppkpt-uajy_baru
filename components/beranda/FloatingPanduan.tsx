"use client";

import { useState, useEffect } from "react";
import { CircleHelp } from "lucide-react";
import toast from "react-hot-toast";

export default function FloatingPanduan() {
  const [latestPanduanUrl, setLatestPanduanUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestPanduan = async () => {
      try {
        const res = await fetch("/api/panduan?kategori=Publik");
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            // Ambil panduan pertama (terbaru karena diurutkan desc di API)
            setLatestPanduanUrl(json.data[0].file_url);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil panduan terbaru", err);
      }
    };

    fetchLatestPanduan();
  }, []);

  const handleClick = () => {
    if (latestPanduanUrl) {
      window.open(latestPanduanUrl, "_blank");
    } else {
      toast.error("Panduan belum tersedia saat ini.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#245399] hover:bg-blue-800 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center group border-2 border-white"
      title="Panduan Sistem Pelaporan"
    >
      <CircleHelp className="w-7 h-7" />

      <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm font-bold px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none flex items-center gap-2 border border-gray-100">
        Panduan Sistem Pelaporan
        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white transform rotate-45 border-r border-t border-gray-100"></div>
      </span>
    </button>
  );
}
