"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BuatLaporan() {
  const [data, setData] = useState({
    ctaTitle: "Jangan Takut Melapor",
    ctaSubtitle:
      "Keamanan dan kerahasiaan Anda adalah prioritas kami. Setiap laporan akan ditangani dengan serius dan profesional.",
    ctaVideoUrl: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cms/cta")
      .then((res) => res.json())
      .then((config) => {
        if (config) {
          setData({
            ctaTitle: config.ctaTitle || "Jangan Takut Melapor",
            ctaSubtitle:
              config.ctaSubtitle ||
              "Keamanan dan kerahasiaan Anda adalah prioritas kami. Setiap laporan akan ditangani dengan serius dan profesional.",
            ctaVideoUrl: config.ctaVideoUrl || "",
          });
        }
      })
      .catch((err) => console.error("Failed to fetch CTA config", err))
      .finally(() => setLoading(false));
  }, []);

  // Helper to extract video ID from URL
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    try {
      let videoId = "";
      if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1].split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1];
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch {
      return null;
    }
  };

  const embedUrl = getEmbedUrl(data.ctaVideoUrl);

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-bold text-[#1E4278] font-eras mb-6">
            {data.ctaTitle}
          </h2>
          <p className="text-gray-600 text-lg lg:text-xl leading-relaxed">
            {data.ctaSubtitle}
          </p>
        </div>

        {/* Video Container */}
        {embedUrl ? (
          <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100">
            <iframe
              src={embedUrl}
              title="Video Panduan Pelaporan"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          /* Fallback if no video is set, maybe show buttons like before or nothing? 
              User specifically asked for video, but let's keep the buttons as a fallback or below the video?
              The user said "judul dan deskripsi kemudian dibawahnya sendiri nanti akan disisipkan video".
              Usually CTA implies an action. I should probably add the "Buat Laporan" button below the video too.
           */
          <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-400 mb-4">Video belum tersedia</p>
          </div>
        )}
      </div>
    </section>
  );
}
