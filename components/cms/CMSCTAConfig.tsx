"use client";

import React, { useState, useEffect } from "react";
import { Save, Info, Video } from "lucide-react";
import toast from "react-hot-toast";

export default function CMSCTAConfig() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ctaTitle: "",
    ctaSubtitle: "",
    ctaVideoUrl: "",
  });

  useEffect(() => {
    fetchCTAConfig();
  }, []);

  const fetchCTAConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/cta");
      const data = await res.json();
      if (data) {
        setFormData({
          ctaTitle: data.ctaTitle || "",
          ctaSubtitle: data.ctaSubtitle || "",
          ctaVideoUrl: data.ctaVideoUrl || "",
        });
      }
    } catch (error) {
      console.error("Error fetching CTA config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/cta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Konfigurasi CTA berhasil disimpan!");
      } else {
        toast.error("Gagal menyimpan konfigurasi.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#1E4278]">
          Konfigurasi Call To Action (CTA)
        </h2>
      </div>

      <div className="space-y-6">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-blue-800 text-sm">
          <Info className="shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-semibold mb-1">Panduan Bagian CTA</p>
            <p>
              Bagian ini adalah area ajakan bertindak yang muncul di halaman
              depan. Anda dapat mengubah judul, deskripsi, dan menyertakan link
              video YouTube sebagai media pendukung.
            </p>
          </div>
        </div>

        {/* CTA Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Judul CTA
          </label>
          <input
            type="text"
            name="ctaTitle"
            value={formData.ctaTitle}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all text-gray-800 font-medium"
            placeholder="Contoh: Jangan Takut Melapor"
          />
        </div>

        {/* CTA Subtitle */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Deskripsi CTA
          </label>
          <textarea
            name="ctaSubtitle"
            value={formData.ctaSubtitle}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all text-gray-800 leading-relaxed resize-none"
            placeholder="Tuliskan pesan ajakan yang meyakinkan..."
          ></textarea>
        </div>

        {/* CTA Video URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Video YouTube URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Video size={18} />
            </div>
            <input
              type="text"
              name="ctaVideoUrl"
              value={formData.ctaVideoUrl}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all text-gray-800 font-mono text-sm"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            *Pastikan link video dari YouTube. Video akan ditampilkan di bawah
            deskripsi.
          </p>
        </div>

        {/* Preview Video (Optional) */}
        {formData.ctaVideoUrl && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Preview Video
            </p>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
              {/* Simple embed logic for preview */}
              {(() => {
                try {
                  let videoId = "";
                  if (formData.ctaVideoUrl.includes("youtube.com/watch?v=")) {
                    videoId = formData.ctaVideoUrl.split("v=")[1].split("&")[0];
                  } else if (formData.ctaVideoUrl.includes("youtu.be/")) {
                    videoId = formData.ctaVideoUrl.split("youtu.be/")[1];
                  }

                  if (videoId) {
                    return (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        className="absolute inset-0 w-full h-full"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    );
                  } else {
                    return (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        URL Video Tidak Valid
                      </div>
                    );
                  }
                } catch {
                  return (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      Error Loading Preview
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end pt-8 border-t border-gray-100 mt-8">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1E4278] text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-50"
        >
          <Save size={16} /> {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
