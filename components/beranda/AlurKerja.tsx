"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function AlurKerja() {
  const [data, setData] = useState({
    judul: "Alur Pelaporan Kekerasan",
    deskripsi:
      "Berikut adalah alur pelaporan kekerasan seksual di Universitas Atma Jaya Yogyakarta.",
    gambar_url: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cms/alur")
      .then((res) => res.json())
      .then((data) => {
        if (data && (data.judul || data.gambar_url)) {
          setData({
            judul: data.judul || "Alur Pelaporan Kekerasan",
            deskripsi:
              data.deskripsi ||
              "Berikut adalah alur pelaporan kekerasan seksual di Universitas Atma Jaya Yogyakarta.",
            gambar_url: data.gambar_url || "",
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (!data.gambar_url) return null; // Don't show if no image? Or show placeholder?
  // Request says "Nantinya ini akan muncul sebuah gambar...". If no image, maybe hide the section.

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" id="alur-kerja">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1E4278] font-eras mb-4">
            {data.judul}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {data.deskripsi}
          </p>
        </div>

        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:h-auto rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          {/* Fallback or actual image */}
          <img
            src={data.gambar_url}
            alt="Diagram Alur Kerja"
            className="w-full h-full object-contain bg-gray-50"
          />
        </div>
      </div>
    </section>
  );
}
