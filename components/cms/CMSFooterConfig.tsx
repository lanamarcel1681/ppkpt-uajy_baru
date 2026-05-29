"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  Globe,
  Phone,
  MapPin,
  Mail,
  LayoutTemplate,
  Plus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CMSFooterConfig() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // State for form data
  const [formData, setFormData] = useState({
    footerTitle: "",
    footerDescription: "",
    alamat: "",
    email: "",
    telepon: "",
    footerLogoUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/cms/footer");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            footerTitle: data.footerTitle || "",
            footerDescription: data.footerDescription || "",
            alamat: data.alamat || "",
            email: data.email || "",
            telepon: data.telepon || "",
            footerLogoUrl: data.footerLogoUrl || "",
            facebookUrl: data.facebookUrl || "",
            instagramUrl: data.instagramUrl || "",
            twitterUrl: data.twitterUrl || "",
            youtubeUrl: data.youtubeUrl || "",
          });
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/cms/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Konfigurasi Footer berhasil disimpan!");
      } else {
        toast.error("Gagal menyimpan data.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1E4278] flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6" />
            Konfigurasi Footer
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Kelola informasi yang tampil di bagian bawah website (Footer).
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Informasi Umum */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#EDA60E]" /> Informasi Umum
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Judul Footer (Brand Name)
              </label>
              <input
                type="text"
                name="footerTitle"
                value={formData.footerTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-800"
                placeholder="Ex: Satgas PPKPT"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi Singkat
              </label>
              <textarea
                name="footerDescription"
                value={formData.footerDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-800 resize-none"
                placeholder="Deskripsi singkat di bawah logo..."
              />
            </div>
          </div>
        </div>



        {/* SECTION 3: Kontak & Alamat */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#EDA60E]" /> Kontak & Alamat
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alamat Lengkap
              </label>
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-800 resize-none"
                placeholder="Alamat kantor..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Kontak
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-800"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor Telepon
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-800"
                  placeholder="0812-3456-7890"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Social Media */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#EDA60E]" /> Social Media (Opsional)
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Kosongkan jika tidak ingin menampilkan icon social media tersebut.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL Facebook
              </label>
              <input
                type="url"
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-800"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL Instagram
              </label>
              <input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-800"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL Twitter / X
              </label>
              <input
                type="url"
                name="twitterUrl"
                value={formData.twitterUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-800"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL Youtube
              </label>
              <input
                type="url"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] text-gray-800"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-[#1E4278] text-white font-medium rounded-lg hover:bg-blue-800 transition shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Menyimpan...
              </>
            ) : (
              <>
                <Save size={20} /> Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
