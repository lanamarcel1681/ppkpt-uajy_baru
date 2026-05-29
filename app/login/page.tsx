"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [logoUrl, setLogoUrl] = useState("/logo_satgas.png"); // Default fallback
  const [title, setTitle] = useState("Satgas PPKPT UAJY");

  // Cek jika sudah login & Fetch Logo
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("ppkpt_logged_in");

    if (isLoggedIn === "true") {
      router.push("/dashboard");
    }

    // Fetch Global Config
    fetch("/api/cms/navbar")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.navbarLogoUrl) setLogoUrl(data.navbarLogoUrl);
          if (data.navbarTitle) setTitle(data.navbarTitle);
        }
      })
      .catch((err) => console.error("Error config:", err));
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Simpan data ke localStorage
        localStorage.setItem("ppkpt_logged_in", "true");
        localStorage.setItem("ppkpt_name", data.user.username); // Nama Pengurus (Super Admin)
        localStorage.setItem("ppkpt_email", data.user.email); // Email
        localStorage.setItem("ppkpt_role", data.user.role);
        localStorage.setItem("ppkpt_avatar", data.user.avatar || "");
        localStorage.setItem("ppkpt_login_time", new Date().toISOString());

        // Redirect ke dashboard (Unified)
        router.push("/dashboard");
      } else {
        setError(data.message || "Login gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    // Redirect ke website UAJY atau halaman beranda lain
    router.push("/");
  };

  return (
    <div className="min-h-screen w-screen bg-[#f0f2f5] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-[1200px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative max-h-none md:max-h-[95vh]">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        {/* Bagian Kiri - Informasi */}
        <div
          className="
          bg-[#1E4278] text-white
          p-8 md:p-14
          flex flex-col justify-center
          relative overflow-hidden w-full md:w-1/2 shrink-0
        "
        >
          {/* Pattern Background Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          <div className="relative z-10 flex flex-col h-full items-center text-center pt-2 justify-center">
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-blue-100 opacity-70 rounded-full blur-xl scale-110"></div>
              {/* Use dynamic logoUrl instead of hardcoded path */}
              <Image
                src={logoUrl}
                alt="Logo PPKPT UAJY"
                width={150}
                height={150}
                className="relative z-10 w-28 md:w-36 h-auto drop-shadow-2xl"
              />
            </div>

            <div className="mb-8 max-w-lg">
              <h2 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
                Halaman Login <br /> Satgas PPKPT UAJY
              </h2>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed opacity-90">
                Selamat datang di halaman login Satgas PPKPT UAJY. Halaman ini
                digunakan untuk melihat pelaporan yang masuk ke dalam sistem
                PPKPT UAJY. Pastikan Anda memiliki kredensial yang valid untuk
                mengakses informasi ini.
              </p>
            </div>
          </div>
        </div>

        {/* Bagian Kanan - Form Login */}
        <div
          className="
          p-6 sm:p-8 md:px-12 md:py-10
          flex flex-col justify-center
          h-full w-full md:w-1/2
          overflow-y-auto
        "
        >
          {/* Header Kanan */}
          <div className="flex justify-between items-center mb-8">
            <button
              type="button"
              onClick={handleBackToHome}
              className="
                group flex items-center gap-2
                text-gray-500 font-medium
                transition-colors hover:text-[#1E4278]
                rounded-md
                text-sm
                transition
                duration-300
                active:bg-[#1E4278] active:text-white
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-[#1E4278]
                px-2 py-1.5 hover:bg-gray-50
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              Kembali ke Beranda
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              Selamat Datang
            </h1>
            <p className="text-base text-gray-500">
              Silakan masuk ke akun Anda untuk melanjutkan.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm flex items-start gap-3 animate-pulse shadow-sm">
              <svg
                className="w-5 h-5 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                Email / Username
              </label>
              <input
                type="text"
                placeholder="Masukkan email atau username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="
                  w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl
                  text-gray-900 text-base placeholder-gray-400
                  focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1E4278]/10 focus:border-[#1E4278]
                  transition-all duration-200 shadow-sm
                "
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="
                    w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl
                    text-gray-900 text-base placeholder-gray-400
                    focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1E4278]/10 focus:border-[#1E4278]
                    transition-all duration-200 shadow-sm
                  "
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none" disabled={isLoading}>
                  {showPassword ? (<EyeOff className="w-5 h-5" />) : (<Eye className="w-5 h-5" />)}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full bg-[#1E4278] text-white py-3.5 rounded-xl font-bold text-base
                transition-all duration-300 transform
                hover:bg-[#15325f] hover:shadow-xl hover:-translate-y-1
                active:translate-y-0 active:shadow-sm
                disabled:opacity-70 disabled:cursor-not-allowed
                flex items-center justify-center gap-2.5 mt-2
              "
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                "Masuk Sekarang"
              )}
            </button>
          </form>
          {/* Copyright */}
          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Satgas PPKPT UAJY
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              Sistem Pelaporan v1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
