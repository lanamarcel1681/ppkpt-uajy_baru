"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  Router,
  Users,
  Tag,
  ShieldAlert,
  LogOut,
  FileBadge,
  University,
  Calendar,
  Book,
} from "lucide-react";
import { useRouter } from "next/navigation";

type MenuItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  open: boolean;
  active?: boolean;
  danger?: boolean;
};

const MenuItem = ({
  href,
  icon,
  label,
  open,
  active,
  danger,
}: MenuItemProps) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
    ${danger
        ? "text-red-500 hover:bg-red-50"
        : active
          ? "bg-blue-50 text-blue-600 font-medium"
          : "text-gray-600 hover:bg-gray-100"
      }`}
  >
    {icon}
    {open && <span>{label}</span>}
  </Link>
);

type SidebarProps = {
  open: boolean;
};

export default function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  const [logoUrl, setLogoUrl] = useState("/Logo_satgas1.png"); // Default fallback
  const [logoLoading, setLogoLoading] = useState(true);

  useEffect(() => {
    // Ambil role dari localStorage saat component mount (client-side)
    const storedRole = localStorage.getItem("ppkpt_role");
    setRole(storedRole);

    // Fetch Logo Global
    fetch("/api/cms/navbar")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.navbarLogoUrl) {
          setLogoUrl(data.navbarLogoUrl);
        }
      })
      .catch((err) => console.error("Error fetching logo:", err))
      .finally(() => setLogoLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ppkpt_logged_in");
    localStorage.removeItem("ppkpt_username");
    localStorage.removeItem("ppkpt_role");
    localStorage.removeItem("ppkpt_login_time");
    localStorage.removeItem("ppkpt_name");
    localStorage.removeItem("ppkpt_email");
    router.push("/login");
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-white border-r transition-all duration-300 flex flex-col 
      ${open ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-16"}`}
    >
      {/* LOGO */}
      <div className="flex items-center gap-2 px-4 py-6 border-b">
        <div className="relative w-[50px] h-[50px] flex-shrink-0">
          {/* Menggunakan img tag biasa agar fleksibel dengan URL eksternal/upload */}
          <img
            src={logoUrl}
            alt="Logo Satgas"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>

        {open && (
          <div>
            <h1 className="font-semibold text-blue-600 leading-tight">
              Satgas PPKPT
            </h1>
            <p className="text-xs text-gray-400">
              {role === "Tim Satgas" ||
                role === "Ketua" ||
                role === "Sekretaris"
                ? "Panel Satgas"
                : "Admin Panel"}
            </p>
          </div>
        )}
      </div>

      {/* MENU */}
      <nav className="mt-4 space-y-1 px-2 text-sm flex-1 overflow-y-auto pb-4 custom-scrollbar">
        {role !== "Admin CMS" && (
          <>
            <MenuItem
              href="/dashboard"
              icon={<LayoutDashboard />}
              label="Dashboard"
              open={open}
              active={pathname === "/dashboard"}
            />
            <MenuItem
              href="/dashboard/daftar_Laporan"
              icon={<FileText />}
              label="Daftar Laporan"
              open={open}
              active={pathname === "/dashboard/daftar_Laporan"}
            />
            <MenuItem
              href="/dashboard/statistik"
              icon={<BarChart2 />}
              label="Statistik"
              open={open}
              active={pathname === "/dashboard/statistik"}
            />
            <MenuItem
              href="/dashboard/laporan_akhir"
              icon={<FileText />}
              label="Laporan Akhir"
              open={open}
              active={pathname === "/dashboard/laporan_akhir"}
            />
          </>
        )}

        {/* Menu Khusus Ketua & Sekretaris */}
        {(role === "Ketua" || role === "Sekretaris") && (
          <MenuItem
            href="/dashboard/arsip"
            icon={<FileBadge />} // Reusing FileBadge or other icon
            label="Arsip"
            open={open}
            active={pathname === "/dashboard/arsip"}
          />
        )}

        {/* Akses Panduan Sistem - Untuk Seluruh Role */}
        {(role === "Tim Satgas" ||
          role === "Ketua" ||
          role === "Sekretaris" ||
          role === "Administrator") && (
            <div className="pt-4 mt-4 border-t border-gray-100">
              <p
                className={`px-4 text-xs font-semibold text-gray-400 mb-2 ${!open && "hidden"}`}
              >
                BUKU PANDUAN
              </p>
              <MenuItem
                href="/dashboard/panduan"
                icon={<Book />}
                label="Panduan Sistem"
                open={open}
                active={pathname === "/dashboard/panduan"}
              />
            </div>
          )}

        {/* Menu CMS - Hanya muncul jika login BUKAN sebagai Tim Satgas, Ketua, Sekretaris */}
        {role !== "Tim Satgas" && role !== "Ketua" && role !== "Sekretaris" && (
          <div className={`pt-4 mt-4 border-gray-100 ${role !== "Admin CMS" ? "border-t" : ""}`}>
            <p
              className={`px-4 text-xs font-semibold text-gray-400 mb-2 ${!open && "hidden"}`}
            >
              ADMINISTRATION
            </p>
            {role !== "Admin CMS" && (
              <MenuItem
                href="/dashboard/kelola_panduan"
                icon={<Book />}
                label="Kelola Panduan"
                open={open}
                active={pathname.startsWith("/dashboard/kelola_panduan")}
              />
            )}
            <MenuItem
              href="/dashboard/cms"
              icon={<ShieldAlert />}
              label="Kelola Konten"
              open={open}
              active={pathname.startsWith("/dashboard/cms")}
            />
            {role !== "Admin CMS" && (
              <>
                <MenuItem
                  href="/dashboard/roles"
                  icon={<Tag />}
                  label="Kelola Role"
                  open={open}
                  active={pathname.startsWith("/dashboard/roles")}
                />
                <MenuItem
                  href="/dashboard/pengurus"
                  icon={<Users />}
                  label="Kelola Pengurus"
                  open={open}
                  active={pathname.startsWith("/dashboard/pengurus")}
                />
                <MenuItem
                  href="/dashboard/fakultas_prodi"
                  icon={<University />}
                  label="Kelola Fakultas & Prodi"
                  open={open}
                  active={pathname.startsWith("/dashboard/fakultas_prodi")}
                />
                <MenuItem
                  href="/dashboard/tahun-akademik"
                  icon={<Calendar />}
                  label="Tahun Akademik"
                  open={open}
                  active={pathname.startsWith("/dashboard/tahun-akademik")}
                />
              </>
            )}
          </div>
        )}
      </nav>

      {/* LOGOUT */}
      <div className="mt-auto p-4 border-t border-gray-100 bg-white">
        <button onClick={handleLogout} className="w-full">
          <MenuItem
            href="/login"
            icon={<LogOut />}
            label="Keluar"
            open={open}
            danger
          />
        </button>
      </div>
    </aside>
  );
}
