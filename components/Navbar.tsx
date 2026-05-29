// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Opsional: untuk mendeteksi menu aktif
import { Shield } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Untuk styling menu aktif (Beranda)
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    navbarTitle: "Satgas PPKPT",
    navbarSubtitle: "Universitas Atma Jaya Yogyakarta",
    navbarLogoUrl: "",
  });

  useEffect(() => {
    fetch("/api/cms/navbar")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setConfig({
            navbarTitle: data.navbarTitle || "Satgas PPKPT",
            navbarSubtitle:
              data.navbarSubtitle || "Universitas Atma Jaya Yogyakarta",
            navbarLogoUrl: data.navbarLogoUrl || "",
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Helper untuk mengecek apakah link sedang aktif
  const isActive = (path: string) => pathname === path;

  return (
    // NAVBAR UTAMA: Fixed di atas
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* --- BAGIAN KIRI: LOGO --- */}
          <Link href="/" className="flex items-center gap-4 group z-50">
            {config.navbarLogoUrl ? (
              <div className="relative w-12 h-12 overflow-hidden items-center justify-center flex">
                <img
                  src={config.navbarLogoUrl}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-[#245399] rounded-xl flex items-center justify-center text-white shadow-sm group-hover:bg-blue-800 transition">
                <Shield className="w-7 h-7" />
              </div>
            )}
            <div className="flex flex-col justify-center">
              <span className="text-xl font-bold text-[#245399] leading-none tracking-wide font-eras">
                {config.navbarTitle}
              </span>
              <span className="text-sm text-gray-500 font-medium leading-tight mt-1">
                {config.navbarSubtitle}
              </span>
            </div>
          </Link>

          {/* --- BAGIAN KANAN: MENU DESKTOP (Hidden di Mobile) --- */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-2 text-black font-medium text-[16px] mr-2">
              <NavLink href="/" active={isActive("/")}>
                Beranda
              </NavLink>
              <NavLink href="/berita" active={isActive("/berita")}>
                Berita
              </NavLink>
              <NavLink href="/tentang" active={isActive("/tentang")}>
                Tentang Kami
              </NavLink>
            </div>
            <Link
              href="/lapor"
              className="ml-4 bg-[#EDA60E] hover:bg-[#d6960c] text-white text-[16px] font-bold px-8 py-3 rounded-full shadow-md transition-all transform hover:scale-105"
            >
              Laporkan Kekerasan
            </Link>
          </div>

          {/* --- HAMBURGER BUTTON (Mobile Only) --- */}
          <div className="lg:hidden z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              // REVISI: Mengubah warna icon menjadi text-black (Hitam)
              className="p-2 text-black hover:bg-gray-100 rounded-lg transition focus:outline-none"
            >
              {isOpen ? (
                // Icon X (Close)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Icon Garis Tiga (Menu)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN (Revisi Layout) --- */}
      {/* 1. absolute top-[96px]: Muncul persis di bawah navbar (h-24 = 96px) 
          2. w-full: Lebar penuh
          3. bg-white: Latar putih
          4. shadow-xl: Memberikan efek bayangan tumpuk di atas konten
          5. Tidak menggunakan h-screen, melainkan h-auto agar konten dibawahnya terdorong/tertutup sebagian
      */}
      <div
        className={`absolute top-[96px] left-0 w-full bg-white shadow-2xl rounded-b-3xl border-t border-gray-100 overflow-y-auto transition-all duration-300 ease-in-out lg:hidden ${
          isOpen ? "max-h-[calc(100vh-96px)] opacity-100 py-6" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="px-6 flex flex-col gap-3">
          {/* Menu Items Rata Kiri */}
          {/* Contoh Beranda diset manual 'active' stylenya agar mirip screenshot, atau pakai logic pathname */}
          <MobileLink
            href="/"
            onClick={() => setIsOpen(false)}
            active={isActive("/")}
          >
            Beranda
          </MobileLink>

          {/* UBAH DISINI: Gunakan isActive("/berita") */}
          <MobileLink
            href="/berita"
            onClick={() => setIsOpen(false)}
            active={isActive("/berita")}
          >
            Berita
          </MobileLink>

          <MobileLink
            href="/tentang"
            onClick={() => setIsOpen(false)}
            active={isActive("/tentang")}
          >
            Tentang Satgas
          </MobileLink>

          {/* Tombol Lapor Full Width */}
          <div className="mt-4 pb-2">
            <Link
              href="/lapor"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-[#EDA60E] hover:bg-[#d6960c] text-white py-4 rounded-full font-bold text-lg shadow-md transition"
            >
              Laporkan Kekerasan
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- KOMPONEN PENDUKUNG ---

const NavLink = ({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) => (
  <Link
    href={href}
    className={`px-2 py-1 transition-all duration-300 border-b-2 ${
      active
        ? "border-[#1E4278] text-[#1E4278] font-bold"
        : "border-transparent text-gray-700 hover:text-[#1E4278] hover:border-gray-300"
    }`}
  >
    {children}
  </Link>
);

const MobileLink = ({
  href,
  onClick,
  children,
  active = false,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`
      block w-full text-left px-5 py-3 font-medium text-lg transition-colors border-l-4
      ${
        active
          ? "border-[#1E4278] text-[#1E4278] bg-blue-50"
          : "border-transparent text-gray-600 hover:text-[#1E4278] hover:bg-gray-50"
      }
    `}
  >
    {children}
  </Link>
);

export default Navbar;
