import React, { useEffect, useState } from "react";
import { Save, Eye, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CMSNavbarConfig() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    navbarTitle: "",
    navbarSubtitle: "",
    navbarLogoUrl: "",
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/navbar");
      if (res.ok) {
        const data = await res.json();
        setFormData({
          navbarTitle: data.navbarTitle || "",
          navbarSubtitle: data.navbarSubtitle || "",
          navbarLogoUrl: data.navbarLogoUrl || "",
        });
      }
    } catch (error) {
      console.error("Gagal memuat konfigurasi navbar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, navbarLogoUrl: data.url }));
        toast.success("Berhasil mengupload logo");
      } else {
        toast.error("Gagal mengupload logo");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat upload");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, navbarLogoUrl: "" }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/navbar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Konfigurasi navbar berhasil disimpan!");
      } else {
        toast.error("Gagal menyimpan konfigurasi.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#1E4278]">Konfigurasi Navbar</h2>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Judul Navbar (Baris 1)
        </label>
        <input
          type="text"
          name="navbarTitle"
          value={formData.navbarTitle}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all text-gray-800 font-medium"
          placeholder="Satgas PPKPT"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Subjudul Navbar (Baris 2)
        </label>
        <input
          type="text"
          name="navbarSubtitle"
          value={formData.navbarSubtitle}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all text-gray-800"
          placeholder="Universitas Atma Jaya Yogyakarta"
        />
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Logo Navbar
        </label>
        {!formData.navbarLogoUrl ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <div className="p-3 bg-blue-50 text-[#1E4278] rounded-full">
                <Plus size={24} />
              </div>
              <p className="text-sm font-medium">Klik untuk upload logo</p>
              <p className="text-xs text-gray-400">PNG, JPG, SVG (Max. 2MB)</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-6 mt-4">
            <div className="relative w-fit border border-gray-200 p-2 bg-white rounded-lg shadow-sm">
              <img
                src={formData.navbarLogoUrl}
                alt="Logo Preview"
                className="h-28 object-contain"
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute -top-3 -right-3 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-md hover:shadow-lg"
                title="Hapus Logo"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Logo saat ini
                </p>
                <p className="text-xs text-gray-400">Dimuat dari URL</p>
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  className="px-5 py-2.5 bg-blue-50 text-[#1E4278] border border-blue-200 rounded-lg text-sm font-bold hover:bg-blue-100 transition shadow-sm"
                >
                  Ganti Logo
                </button>
              </div>
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
