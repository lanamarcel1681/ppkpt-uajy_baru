"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Save,
  Info,
  HelpCircle,
  Eye,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import LayananCMS from "@/components/cms/layanan/LayananCMS";
import toast from "react-hot-toast";
import KekerasanCMS from "@/components/cms/kekerasan/KekerasanCMS";
import CMSBeritaConfig from "./CMSBeritaConfig";
import CMSTentangConfig from "./CMSTentangConfig";
import CMSNavbarConfig from "./CMSNavbarConfig";
import CMSAlurConfig from "./CMSAlurConfig";
import CMSFooterConfig from "./CMSFooterConfig";
import CMSCTAConfig from "./CMSCTAConfig";

interface CMSContentProps {
  activeTab: string;
}

export default function CMSContent({ activeTab }: CMSContentProps) {
  const [loading, setLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroHotlineNumber: "",
    heroImageUrl: "",
  });

  // Fetch data on mount
  useEffect(() => {
    if (activeTab === "Hero") {
      setLoading(true);
      fetch("/api/cms/landing-page/hero")
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setFormData({
              heroTitle: data.heroTitle || "",
              heroSubtitle: data.heroSubtitle || "",
              heroHotlineNumber: data.heroHotlineNumber || "",
              heroImageUrl: data.heroImageUrl || "",
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/landing-page/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Perubahan berhasil disimpan!");
      } else {
        toast.error("Gagal menyimpan perubahan.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran gambar terlalu besar (Maksimal 5MB)!");
      return;
    }

    setIsUploadingImage(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!res.ok) {
        throw new Error("Gagal mengunggah gambar");
      }

      const { url } = await res.json();
      setFormData((prev) => ({ ...prev, heroImageUrl: url }));
      toast.success("Gambar berhasil diunggah! Jangan lupa klik Simpan.");
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8">
        {activeTab !== "Kekerasan" &&
          activeTab !== "Navbar" &&
          activeTab !== "Alur Kerja" &&
          activeTab !== "CTA" &&
          activeTab !== "Footer" && (
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-[#1E4278]">
                Edit {activeTab} Section
              </h2>
            </div>
          )}

        {/* HERO FORM content */}
        {activeTab === "Hero" && (
          <div className="space-y-6">
            {/* Judul Utama */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Judul Utama
              </label>
              <input
                type="text"
                name="heroTitle"
                value={formData.heroTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all text-gray-800 font-medium"
                placeholder="Satgas Pencegahan..."
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                name="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all text-gray-800 min-h-[120px] leading-relaxed resize-none"
                placeholder="Deskripsi singkat..."
              ></textarea>
            </div>

            {/* Hotline Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor Hotline
              </label>
              <input
                type="text"
                name="heroHotlineNumber"
                value={formData.heroHotlineNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all text-gray-800"
                placeholder="0800-123-4567"
              />
            </div>

            {/* Gambar Hero */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gambar Hero Background
              </label>
              <div className="flex flex-col gap-4">
                {formData.heroImageUrl && (
                  <div className="relative w-full max-w-md h-48 rounded-xl overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.heroImageUrl}
                      alt="Hero Background Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isUploadingImage ? (
                      <span className="animate-pulse">Mengunggah...</span>
                    ) : (
                      <>
                        <Upload size={16} /> Unggah Gambar Baru
                      </>
                    )}
                  </button>
                  {formData.heroImageUrl && (
                    <button
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, heroImageUrl: "" }))
                      }
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Hapus Gambar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Layanan" && <LayananCMS />}
        {activeTab === "Kekerasan" && <KekerasanCMS />}
        {activeTab === "Navbar" && <CMSNavbarConfig />}
        {activeTab === "Alur Kerja" && <CMSAlurConfig />}
        {activeTab === "CTA" && <CMSCTAConfig />}
        {activeTab === "Berita" && <CMSBeritaConfig />}
        {activeTab === "Tentang Kami" && <CMSTentangConfig />}
        {activeTab === "Footer" && <CMSFooterConfig />}

        {activeTab === "Hero" && (
          <div className="flex justify-end pt-8 border-t border-gray-100 mt-8">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1E4278] text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-50"
            >
              <Save size={16} /> {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        )}

        {activeTab !== "Hero" &&
          activeTab !== "Layanan" &&
          activeTab !== "Kekerasan" &&
          activeTab !== "Berita" &&
          activeTab !== "Tentang Kami" &&
          activeTab !== "Navbar" &&
          activeTab !== "Alur Kerja" &&
          activeTab !== "CTA" &&
          activeTab !== "Footer" && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <HelpCircle size={32} className="text-gray-300" />
              </div>
              <p className="font-medium">
                Konten untuk tab {activeTab} segera hadir
              </p>
              <p className="text-sm mt-1">
                Silakan selesaikan konfigurasi Hero section terlebih dahulu
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
