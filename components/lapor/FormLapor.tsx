// src/components/lapor/FormLapor.tsx
"use client";

import { Shield, Upload, AlertCircle, FileText, X } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const FormLapor = () => {
  const [loading, setLoading] = useState(false);
  // const [fileName, setFileName] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; url: string; type: string }>
  >([]);

  // Tipe Data untuk Fakultas & Prodi
  type Prodi = {
    id: number;
    nama: string;
    id_fakultas: number;
  };

  type Fakultas = {
    id: number;
    nama: string;
    prodi: Prodi[];
  };

  const [fakultasList, setFakultasList] = useState<Fakultas[]>([]);

  // State Utama
  const [rolePelapor, setRolePelapor] = useState("");
  const [statusPelapor, setStatusPelapor] = useState("");

  const [pelaporData, setPelaporData] = useState({
    nama: "",
    email: "",
    noHp: "",
    gender: "",
    fakultas: "", // Tetap simpan sebagai string gabungan atau nama prodi
  });

  // Helper State untuk Dropdown Pelapor
  const [selectedFakultasPelapor, setSelectedFakultasPelapor] = useState("");
  const [selectedProdiPelapor, setSelectedProdiPelapor] = useState("");

  const [korbanData, setKorbanData] = useState({
    nama: "",
    email: "",
    noHp: "",
    gender: "",
    status: "",
    fakultas: "",
  });

  // Helper State untuk Dropdown Korban
  const [selectedFakultasKorban, setSelectedFakultasKorban] = useState("");
  const [selectedProdiKorban, setSelectedProdiKorban] = useState("");

  const [terlaporData, setTerlaporData] = useState({
    nama: "",
    status: "",
    fakultas: "",
  });

  // Helper State untuk Dropdown Terlapor
  const [selectedFakultasTerlapor, setSelectedFakultasTerlapor] = useState("");
  const [selectedProdiTerlapor, setSelectedProdiTerlapor] = useState("");

  // Validation State
  const [emailError, setEmailError] = useState("");
  const [linkVideoError, setLinkVideoError] = useState("");

  const [laporanData, setLaporanData] = useState({
    jenisKekerasan: [] as string[],
    waktuKejadian: "",
    tkp: "",
    lokasiDetail: "",
    kronologi: "",
    tindakLanjut: "",
    pendampinganSegera: null as boolean | null,
    buktiUrl: "",
    linkVideo: "",
  });

  const [showVideoInput, setShowVideoInput] = useState<boolean | null>(null);

  // 1. Fetch Data Fakultas & Prodi
  useEffect(() => {
    const fetchFakultas = async () => {
      try {
        const res = await fetch("/api/cms/fakultas");
        if (res.ok) {
          const data = await res.json();
          setFakultasList(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data fakultas", error);
      }
    };
    fetchFakultas();
  }, []);

  // Update string 'fakultas' saat dropdown berubah (Pelapor)
  useEffect(() => {
    if (selectedFakultasPelapor && selectedProdiPelapor) {
      // Format: "Fakultas Teknik - Informatika" atau hanya prodi "Informatika" (sesuai kebutuhan)
      // Disini kita gabungkan agar informatif
      const fak = fakultasList.find((f) => f.nama === selectedFakultasPelapor);
      const prod = fak?.prodi.find((p) => p.nama === selectedProdiPelapor);
      if (fak && prod) {
        setPelaporData((prev) => ({
          ...prev,
          fakultas: `${fak.nama} - ${prod.nama}`,
        }));
      }
    } else if (selectedFakultasPelapor && !selectedProdiPelapor) {
      setPelaporData((prev) => ({
        ...prev,
        fakultas: selectedFakultasPelapor,
      }));
    }
  }, [selectedFakultasPelapor, selectedProdiPelapor, fakultasList]);

  // Update string 'fakultas' saat dropdown berubah (Korban)
  useEffect(() => {
    if (selectedFakultasKorban && selectedProdiKorban) {
      setKorbanData((prev) => ({
        ...prev,
        fakultas: `${selectedFakultasKorban} - ${selectedProdiKorban}`,
      }));
    } else if (selectedFakultasKorban) {
      setKorbanData((prev) => ({ ...prev, fakultas: selectedFakultasKorban }));
    }
  }, [selectedFakultasKorban, selectedProdiKorban]);

  // Update string 'fakultas' saat dropdown berubah (Terlapor)
  useEffect(() => {
    if (selectedFakultasTerlapor && selectedProdiTerlapor) {
      setTerlaporData((prev) => ({
        ...prev,
        fakultas: `${selectedFakultasTerlapor} - ${selectedProdiTerlapor}`,
      }));
    } else if (selectedFakultasTerlapor) {
      setTerlaporData((prev) => ({
        ...prev,
        fakultas: selectedFakultasTerlapor,
      }));
    }
  }, [selectedFakultasTerlapor, selectedProdiTerlapor]);

  const handlePelaporChange = (field: string, value: string) => {
    setPelaporData((prev) => ({ ...prev, [field]: value }));
  };

  const handleKorbanChange = (field: string, value: string) => {
    setKorbanData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTerlaporChange = (field: string, value: string) => {
    setTerlaporData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLaporanChange = (field: string, value: any) => {
    setLaporanData((prev) => ({ ...prev, [field]: value }));
  };

  const handleKekerasanChange = (item: string) => {
    setLaporanData((prev) => {
      const current = prev.jenisKekerasan;
      if (current.includes(item)) {
        return { ...prev, jenisKekerasan: current.filter((i) => i !== item) };
      } else {
        return { ...prev, jenisKekerasan: [...current, item] };
      }
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Determine File Category Let's group based on accepted extensions
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";

      const getFileCategory = (ext: string) => {
        if (["jpg", "jpeg", "png"].includes(ext)) return "Gambar";
        if (["mp3", "wav", "m4v"].includes(ext)) return "Audio";
        if (["pdf", "doc", "docx", "txt"].includes(ext)) return "Dokumen";
        return "Lainnya";
      };

      const fileCategory = getFileCategory(fileExt);

      // Check if this category is already uploaded
      const isCategoryExists = uploadedFiles.some((f) => {
        const existingExt = f.name.split(".").pop()?.toLowerCase() || "";
        return getFileCategory(existingExt) === fileCategory;
      });

      if (isCategoryExists) {
        toast.error(
          `Anda hanya diizinkan untuk mengunggah 1 file dengan format ${fileCategory}.`,
        );
        e.target.value = ""; // Reset input
        return;
      }

      // Upload immediately
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          // Add to uploadedFiles array
          const newFile = {
            name: file.name,
            url: data.url,
            type: file.type,
          };

          setUploadedFiles((prev) => {
            const updated = [...prev, newFile];
            // Update laporanData.buktiUrl with JSON string of all URLs
            // We use the updated array here
            const urls = updated.map((f) => f.url);
            handleLaporanChange("buktiUrl", JSON.stringify(urls));
            return updated;
          });
        }
      } catch (err) {
        console.error("Upload failed", err);
        toast.error("Gagal mengunggah file");
      }
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((_, index) => index !== indexToRemove);
      const urls = updated.map((f) => f.url);
      handleLaporanChange(
        "buktiUrl",
        urls.length > 0 ? JSON.stringify(urls) : "",
      );
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        rolePelapor,
        pelapor: { ...pelaporData, status: statusPelapor },
        korban: korbanData,
        terlapor: terlaporData,
        laporan: laporanData,
      };

      const res = await fetch("/api/lapor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      toast.success("Laporan berhasil dikirim!");
      // Reset or redirect
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      toast.error("Gagal mengirim laporan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-0 pb-20 relative z-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* --- FORM CONTAINER UTAMA --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[2rem] shadow-xl p-5 sm:p-8 md:p-12 border border-gray-100"
        >
          {/* BAGIAN 1: DATA PELAPOR */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-[#245399] mb-8 font-eras border-b pb-4">
              Data Pelapor
            </h2>

            <div className="grid gap-6">
              {/* Nama Pelapor */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nama Pelapor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={pelaporData.nama}
                  onChange={(e) => handlePelaporChange("nama", e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition text-black"
                />
              </div>

              {/* Role Pelapor */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Role/Posisi Pelapor <span className="text-red-500">*</span>
                </label>
                <select
                  value={rolePelapor}
                  onChange={(e) => setRolePelapor(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-black"
                >
                  <option value="">Pilih role</option>
                  <option value="Saksi">Saksi</option>
                  <option value="Korban">Korban</option>
                </select>
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <select
                  value={pelaporData.gender}
                  onChange={(e) =>
                    handlePelaporChange("gender", e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-black"
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              {/* Status Pelapor */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Status Pelapor <span className="text-red-500">*</span>
                </label>
                <select
                  value={statusPelapor}
                  onChange={(e) => setStatusPelapor(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-black"
                >
                  <option value="">Pilih status</option>
                  <option value="Mahasiswa">Mahasiswa</option>
                  <option value="Dosen">Dosen</option>
                  <option value="Tendik">Tenaga Kependidikan</option>
                  <option value="Umum">Masyarakat Umum</option>
                </select>
              </div>

              {/* Asal Fakultas & Prodi (Dropdown) */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Fakultas <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedFakultasPelapor}
                    onChange={(e) => {
                      setSelectedFakultasPelapor(e.target.value);
                      setSelectedProdiPelapor("");
                    }}
                    disabled={statusPelapor === "Umum"}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-black disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">Pilih Fakultas</option>
                    {fakultasList.map((f) => (
                      <option key={f.id} value={f.nama}>
                        {f.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Program Studi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedProdiPelapor}
                    onChange={(e) => setSelectedProdiPelapor(e.target.value)}
                    disabled={
                      statusPelapor === "Umum" || !selectedFakultasPelapor
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-black disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">Pilih Program Studi</option>
                    {fakultasList
                      .find((f) => f.nama === selectedFakultasPelapor)
                      ?.prodi.map((p) => (
                        <option key={p.id} value={p.nama}>
                          {p.nama}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Nomor HP & Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nomor Handphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={pelaporData.noHp}
                    onChange={(e) =>
                      handlePelaporChange("noHp", e.target.value)
                    }
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Pelapor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={pelaporData.email}
                    onChange={(e) => {
                      const val = e.target.value;
                      handlePelaporChange("email", val);

                      // Real-time validation: if error exists, check if fixed
                      if (emailError) {
                        if (val && val.toLowerCase().endsWith("@gmail.com")) {
                          setEmailError("");
                          e.target.setCustomValidity("");
                        }
                      }

                      // Also update custom validity for form submission safety
                      if (val && !val.toLowerCase().endsWith("@gmail.com")) {
                        e.target.setCustomValidity(
                          "Email harus menggunakan domain @gmail.com",
                        );
                      } else {
                        e.target.setCustomValidity("");
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value;
                      if (val && !val.toLowerCase().endsWith("@gmail.com")) {
                        setEmailError(
                          "Email harus menggunakan domain @gmail.com",
                        );
                      }
                    }}
                    placeholder="nama@gmail.com"
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition text-black ${emailError
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:border-[#245399] focus:ring-blue-100"
                      }`}
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {emailError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form DATA KORBAN (Conditional) */}
            {rolePelapor === "Saksi" && (
              <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-xl font-bold text-[#245399] mb-6 font-eras">
                  Data Korban
                </h3>
                <div className="grid gap-6">
                  {/* Nama Korban */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nama Korban <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={korbanData.nama}
                      onChange={(e) =>
                        handleKorbanChange("nama", e.target.value)
                      }
                      placeholder="Masukkan nama korban"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition text-black"
                    />
                  </div>

                  {/* Email & No HP Korban */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email Korban <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={korbanData.email}
                        onChange={(e) =>
                          handleKorbanChange("email", e.target.value)
                        }
                        placeholder="email.korban@example.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Nomor Handphone Korban
                      </label>
                      <input
                        type="tel"
                        value={korbanData.noHp}
                        onChange={(e) =>
                          handleKorbanChange("noHp", e.target.value)
                        }
                        placeholder="08xxxxxxxxxx"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition text-black"
                      />
                    </div>
                  </div>

                  {/* Fakultas & Status Korban */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Fakultas & Prodi Korban */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Fakultas Korban
                        </label>
                        <select
                          value={selectedFakultasKorban}
                          onChange={(e) => {
                            setSelectedFakultasKorban(e.target.value);
                            setSelectedProdiKorban("");
                          }}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-black"
                        >
                          <option value="">Pilih Fakultas</option>
                          {fakultasList.map((f) => (
                            <option key={f.id} value={f.nama}>
                              {f.nama}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Prodi Korban
                        </label>
                        <select
                          value={selectedProdiKorban}
                          onChange={(e) =>
                            setSelectedProdiKorban(e.target.value)
                          }
                          disabled={!selectedFakultasKorban}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-black disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          <option value="">Pilih Program Studi</option>
                          {fakultasList
                            .find((f) => f.nama === selectedFakultasKorban)
                            ?.prodi.map((p) => (
                              <option key={p.id} value={p.nama}>
                                {p.nama}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Status Korban <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={korbanData.status}
                        onChange={(e) =>
                          handleKorbanChange("status", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-black"
                        required
                      >
                        <option value="">Pilih status</option>
                        <option value="Mahasiswa">Mahasiswa</option>
                        <option value="Dosen">Dosen</option>
                        <option value="Karyawan">Karyawan</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  {/* Jenis Kelamin Korban */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Jenis Kelamin Korban
                    </label>
                    <select
                      value={korbanData.gender}
                      onChange={(e) =>
                        handleKorbanChange("gender", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-black"
                      required
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BAGIAN 2: JENIS KEKERASAN */}
          <div className="mb-10">
            <label className="block text-sm font-bold text-gray-700 mb-4">
              Jenis Kekerasan yang Dialami Korban{" "}
              <span className="text-red-500">*</span>
              <br />
              <span className="text-xs font-normal text-gray-500">
                (Dapat memilih lebih dari satu)
              </span>
            </label>
            <div className="space-y-3">
              {[
                "Kekerasan Fisik",
                "Kekerasan Psikis",
                "Kekerasan Seksual",
                "Perundungan (Bullying)",
                "Diskriminasi dan Intoleransi",
                "Kebijakan yang Mengandung Kekerasan",
              ].map((item, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={laporanData.jenisKekerasan.includes(item)}
                    onChange={() => handleKekerasanChange(item)}
                    className="w-5 h-5 rounded border-gray-300 text-[#245399] focus:ring-[#245399]"
                  />
                  <span className="text-gray-700 group-hover:text-[#245399] transition">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* BAGIAN 3: DATA TERLAPOR & KEJADIAN */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-[#245399] mb-8 font-eras border-b pb-4">
              Data Terlapor & Kejadian
            </h2>

            <div className="grid gap-6">
              {/* Nama Terlapor */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nama Terlapor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={terlaporData.nama}
                  onChange={(e) => handleTerlaporChange("nama", e.target.value)}
                  placeholder="Masukkan nama terlapor"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition text-black"
                />
              </div>

              {/* Role Terlapor */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Role/Posisi Terlapor <span className="text-red-500">*</span>
                </label>
                <select
                  value={terlaporData.status}
                  onChange={(e) =>
                    handleTerlaporChange("status", e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-black"
                >
                  <option value="">Pilih role</option>
                  <option value="Mahasiswa">Mahasiswa</option>
                  <option value="Dosen">Dosen</option>
                  <option value="Tendik">Tenaga Kependidikan</option>
                </select>
              </div>

              {/* Asal Fakultas Terlapor (Opsional) */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Fakultas Terlapor (Opsional)
                  </label>
                  <select
                    value={selectedFakultasTerlapor}
                    onChange={(e) => {
                      setSelectedFakultasTerlapor(e.target.value);
                      setSelectedProdiTerlapor("");
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-black"
                  >
                    <option value="">Pilih Fakultas</option>
                    {fakultasList.map((f) => (
                      <option key={f.id} value={f.nama}>
                        {f.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Prodi Terlapor (Opsional)
                  </label>
                  <select
                    value={selectedProdiTerlapor}
                    onChange={(e) => setSelectedProdiTerlapor(e.target.value)}
                    disabled={!selectedFakultasTerlapor}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-black disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">Pilih Program Studi</option>
                    {fakultasList
                      .find((f) => f.nama === selectedFakultasTerlapor)
                      ?.prodi.map((p) => (
                        <option key={p.id} value={p.nama}>
                          {p.nama}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Waktu Kejadian */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Waktu Kejadian <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    required
                    value={laporanData.waktuKejadian}
                    onChange={(e) =>
                      handleLaporanChange("waktuKejadian", e.target.value)
                    }
                    max={new Date().toISOString().slice(0, 0)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition text-black"
                  />
                </div>
              </div>

              {/* Tempat Kejadian */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tempat Kejadian <span className="text-red-500">*</span>
                </label>
                <select
                  value={laporanData.tkp}
                  onChange={(e) => handleLaporanChange("tkp", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 mb-3 bg-white text-black"
                  required
                >
                  <option value="">Pilih lokasi</option>
                  <option value="Gedung Perkuliahan">Gedung Perkuliahan</option>
                  <option value="Area Parkir">Area Parkir</option>
                  <option value="Kantin">Kantin</option>
                  <option value="Luar Kampus">Luar Kampus</option>
                </select>
                <input
                  type="text"
                  value={laporanData.lokasiDetail}
                  onChange={(e) =>
                    handleLaporanChange("lokasiDetail", e.target.value)
                  }
                  placeholder="Detail lokasi kejadian (gedung, ruangan, alamat, dll)"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition text-black"
                />
              </div>

              {/* Kronologi */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Deskripsi Kronologi Kejadian{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={laporanData.kronologi}
                  onChange={(e) =>
                    handleLaporanChange("kronologi", e.target.value)
                  }
                  placeholder="Jelaskan kronologi kejadian secara detail (apa yang terjadi, kapan, dimana, bagaimana kejadiannya)..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#245399] focus:ring-2 focus:ring-blue-100 outline-none transition text-black"
                ></textarea>
              </div>
            </div>
          </div>

          {/* BAGIAN 4: PERSETUJUAN */}
          <div className="mb-10 space-y-8">
            {/* Proses Lanjut */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-4">
                Apakah korban bersedia agar masalah ini diproses lebih lanjut
                oleh tim Satgas PPKPT? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {[
                  "Ya, bersedia untuk diproses lebih lanjut",
                  "Tidak, hanya ingin melaporkan saja",
                ].map((opt, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="consent_process"
                      required
                      checked={laporanData.tindakLanjut === opt}
                      onChange={() => handleLaporanChange("tindakLanjut", opt)}
                      className="w-4 h-4 text-[#245399] focus:ring-[#245399]"
                    />
                    <span className="text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pendampingan Segera */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-4">
                Apakah korban membutuhkan pendampingan segera?{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {[
                  "Ya, membutuhkan pendampingan segera",
                  "Tidak, belum membutuhkan saat ini",
                ].map((opt, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="urgent_help"
                      required
                      checked={laporanData.pendampinganSegera === (i === 0)}
                      onChange={() =>
                        handleLaporanChange("pendampinganSegera", i === 0)
                      }
                      className="w-4 h-4 text-[#245399] focus:ring-[#245399]"
                    />
                    <span className="text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* BAGIAN 5: BUKTI PENDUKUNG */}
          <div className="mb-8 mt-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Bukti Pendukung (opsional)
            </label>
            <div className="text-xs text-gray-500 mb-2">
              Catatan: Bukti pendukung dapat berupa kalimat/text/dokumen, yang
              diupload melalui form ini, atau berupa gambar, audio.
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.mp3,.wav,.m4v,.pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-[#245399] font-bold">
                  Klik untuk upload file
                </span>
                <span className="text-xs text-center text-gray-500 max-w-xs">
                  Format: Gambar (JPG, PNG), Audio (MP3, WAV), Dokumen (PDF,
                  DOC, TXT)
                  <br />
                  (Max 10MB)
                </span>

                {/* File List */}
                <div className="w-full space-y-2 mt-4">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(file.url, "_blank");
                      }}
                      className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all w-full group relative z-20 cursor-pointer"
                    >
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText className="w-6 h-6 text-[#245399]" />
                      </div>
                      <div className="flex-1 text-left overflow-hidden">
                        <p className="text-sm font-semibold text-gray-700 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-green-600 font-medium">
                          Upload Berhasil
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(index);
                        }}
                        className="p-1 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition"
                        title="Hapus file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN 6: Bukti Video */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-4">
              Apakah Anda memiliki bukti lain / berbentuk video?
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="has_video"
                  checked={showVideoInput === true}
                  onChange={() => setShowVideoInput(true)}
                  className="w-4 h-4 text-[#245399] focus:ring-[#245399]"
                />
                <span className="text-gray-700">Ya</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="has_video"
                  checked={showVideoInput === false}
                  onChange={() => {
                    setShowVideoInput(false);
                    handleLaporanChange("linkVideo", "");
                  }}
                  className="w-4 h-4 text-[#245399] focus:ring-[#245399]"
                />
                <span className="text-gray-700">Tidak</span>
              </label>
            </div>

            {showVideoInput && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Masukkan link bukti tambahan{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="text-xs text-gray-500 mb-2">
                  Catatan: Link yang dimasukkan hanya dapat berasal dari Google
                  Drive atau OneDrive. Pastikan link dapat diakses
                  (public/shared).
                </div>
                <input
                  type="url"
                  required
                  value={laporanData.linkVideo}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleLaporanChange("linkVideo", val);

                    const lowerUrl = val.toLowerCase();
                    const isValid =
                      !val ||
                      lowerUrl.includes("drive.google.com") ||
                      lowerUrl.includes("onedrive.live.com") ||
                      lowerUrl.includes("1drv.ms") ||
                      lowerUrl.includes("sharepoint.com");

                    if (linkVideoError && isValid) {
                      setLinkVideoError("");
                      e.target.setCustomValidity("");
                    }

                    if (val && !isValid) {
                      e.target.setCustomValidity(
                        "Link harus berasal dari Google Drive atau OneDrive",
                      );
                    } else {
                      e.target.setCustomValidity("");
                    }
                  }}
                  onBlur={(e) => {
                    const val = e.target.value;
                    const lowerUrl = val.toLowerCase();
                    const isValid =
                      !val ||
                      lowerUrl.includes("drive.google.com") ||
                      lowerUrl.includes("onedrive.live.com") ||
                      lowerUrl.includes("1drv.ms") ||
                      lowerUrl.includes("sharepoint.com");
                    if (val && !isValid) {
                      setLinkVideoError(
                        "Link harus berasal dari Google Drive atau OneDrive",
                      );
                    }
                  }}
                  placeholder="https://drive.google.com/..."
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition text-black ${linkVideoError
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-[#245399] focus:ring-blue-100"
                    }`}
                />
                {linkVideoError && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {linkVideoError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-full bg-[#EDA60E] hover:bg-[#d6960c] disabled:bg-gray-400 font-bold text-white transition w-full sm:w-auto flex-grow text-center shadow-lg"
            >
              {loading ? "Mengirim..." : "Kirim Laporan"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FormLapor;
