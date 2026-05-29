"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type TopbarProps = {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
};

export default function Topbar({ onToggleSidebar, sidebarOpen }: TopbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Dynamic user data
  const [userData, setUserData] = useState({
    name: "Pengguna",
    role: "User",
    email: "",
    avatar: "https://i.pravatar.cc/40?img=12",
  });

  useEffect(() => {
    // Load data from localStorage
    const name = localStorage.getItem("ppkpt_name") || "Pengguna";
    const email = localStorage.getItem("ppkpt_email") || "";
    const role = localStorage.getItem("ppkpt_role") || "User";
    const avatar = localStorage.getItem("ppkpt_avatar") || "https://i.pravatar.cc/40?img=12";

    setUserData((prev) => ({ ...prev, name, role, email, avatar }));
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("ppkpt_logged_in");
    localStorage.removeItem("ppkpt_username");
    localStorage.removeItem("ppkpt_role");
    localStorage.removeItem("ppkpt_login_time");

    // Redirect to login
    router.push("/login");
  };

  const handleViewProfile = () => {
    setProfileOpen(false);
    router.push("/dashboard/profil");
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
          >
            <Menu size={20} className="text-gray-700" />
          </button>

          {/* Title */}
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Dashboard Satgas PPKPT
            </h1>
            <p className="text-xs text-gray-500 hidden md:block">
              Sistem Manajemen Laporan Kekerasan
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Menu profil"
            >
              <img
                src={userData.avatar}
                alt={userData.name}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-gray-200"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                  {userData.name}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">
                  {userData.role}
                </p>
              </div>
              <ChevronDown
                size={16}
                className={`hidden md:block transition-transform duration-200 ${profileOpen ? "rotate-180" : ""
                  } text-gray-500`}
              />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-12 w-56 md:w-64 bg-white rounded-xl shadow-lg border overflow-hidden z-50">
                {/* Profile Info */}
                <div className="px-4 py-4 border-b bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={userData.avatar}
                        alt={userData.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {userData.name}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {userData.role}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {userData.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={handleViewProfile}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={16} className="text-gray-500" />
                    <span>Profil Saya</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
