import React, { useEffect, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CMSAlurConfig() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    gambar_url: "",
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/alur");
      if (res.ok) {
        const data = await res.json();
        setFormData({
          judul: data.judul || "",
          deskripsi: data.deskripsi || "",
          gambar_url: data.gambar_url || "",
        });
      }
    } catch (error) {
      console.error("Gagal memuat konfigurasi alur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
        setFormData((prev) => ({ ...prev, gambar_url: data.url }));
        toast.success("Berhasil mengupload gambar");
      } else {
        toast.error("Gagal mengupload gambar");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat upload");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, gambar_url: "" }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/alur", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Konfigurasi alur kerja berhasil disimpan!");
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
        <h2 className="text-xl font-bold text-[#1E4278]">
          Konfigurasi Alur Kerja
        </h2>
      </div>

      {/* Judul */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Judul Section
        </label>
        <input
          type="text"
          name="judul"
          value={formData.judul}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all text-gray-800 font-medium"
          placeholder="Alur Pelaporan Kekerasan"
        />
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Deskripsi Singkat
        </label>
        <textarea
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E4278] transition-all text-gray-800 resize-none"
          placeholder="Deskripsi mengenai alur pelaporan..."
        />
      </div>

      {/* Gambar Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Gambar Diagram Alur
        </label>
        {!formData.gambar_url ? (
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
              <p className="text-sm font-medium">
                Klik untuk upload gambar diagram
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, JPEG (Max. 2MB)</p>
            </div>
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <img
              src={formData.gambar_url}
              alt="Preview"
              className="w-full h-autom object-contain max-h-[400px]"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-sm"
            >
              <Trash2 size={16} />
            </button>
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
