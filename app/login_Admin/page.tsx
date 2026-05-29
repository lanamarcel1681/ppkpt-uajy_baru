"use client";

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Cek jika sudah login, redirect ke dashboard
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('ppkpt_logged_in');
    if (isLoggedIn === 'true') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulasi loading
    setTimeout(() => {
      // Hardcoded credentials untuk development
      const validCredentials = [
        { username: 'admin', password: 'admin123', role: 'Administrator' },
      ];

      const isValid = validCredentials.find(
        cred => cred.username === username && cred.password === password
      );

      if (isValid) {
        // Simpan data ke localStorage
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_username', isValid.username);
        localStorage.setItem('admin_role', isValid.role);
        localStorage.setItem('admin_login_time', new Date().toISOString());

        // Redirect ke dashboard
        router.push('/dashboard');
      } else {
        setError('Username atau password salah!');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleBackToHome = () => {
    // Redirect ke website UAJY atau halaman beranda lain
    window.open('https://www.uajy.ac.id', '_blank');
    // Atau: router.push('/');
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast('Fitur reset password dalam pengembangan.\n\nGunakan akun demo:\n• admin / admin123\n• satgas / satgas123\n• demo / demo123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Bagian Kiri - Informasi */}
        <div className="
          bg-[#1E4278] text-white
          p-8 md:p-10
          flex flex-col justify-center
          order-1 md:order-1
        ">
          <h2 className="text-2xl font-bold mb-4 leading-snug">
            Halaman Login
            <br />
            Admin CMS Satgas PPKPT UAJY
          </h2>
          <p className="text-sm leading-relaxed opacity-90">
            Selamat datang di halaman login Admin CMS Satgas PPKPT UAJY. Silakan masukkan
            kredensial Anda untuk mengakses CMS dan mengelola sistem CMS website PPKPT UAJY 
            .Pastikan untuk menjaga kerahasiaan informasi login Anda.
          </p>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-white/10 rounded-lg">
            <p className="text-sm font-semibold mb-2">🔐 Akun Demo:</p>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>admin / admin123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bagian Kanan - Form Login */}
        <div className="
          p-6 sm:p-10
          flex flex-col justify-center
          order-2 md:order-2
        ">
          {/* Tombol Kembali */}
          <button
            type="button"
            onClick={handleBackToHome}
            className="
              mb-6
              w-full md:w-1/2
              flex items-center gap-2
              text-[#1E4278]
              px-4 py-2
              rounded-md
              text-sm
              transition
              duration-300
              hover:bg-[#1E4278] hover:text-white
              active:bg-[#1E4278] active:text-white
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-[#1E4278]
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Kembali ke Beranda
          </button>

          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-md"></div>
              <Image
                src="/logo_satgas.png"
                alt="Logo PPKPT UAJY"
                width={100}
                height={100}
                className="relative z-10 mb-4"
              />
            </div>
            <h1 className="text-xl font-semibold text-gray-800 text-center">
              Admin Satgas PPKPT UAJY
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sistem CMS Website PPKPT UAJY
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-4 text-center md:text-left">
            Please login to your account
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="
                w-full
                px-4 py-3
                border rounded-md
                text-gray-800
                placeholder-gray-500
                focus:outline-none
                focus:ring-2 focus:ring-[#1E4278]
                disabled:bg-gray-100 disabled:cursor-not-allowed
                transition duration-200
              "
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="
                w-full
                px-4 py-3
                border rounded-md
                text-gray-800
                placeholder-gray-500
                focus:outline-none
                focus:ring-2 focus:ring-[#1E4278]
                disabled:bg-gray-100 disabled:cursor-not-allowed
                transition duration-200
              "
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full
                bg-[#1E4278]
                text-white
                py-3
                rounded-md
                font-medium
                transition
                duration-300
                hover:shadow-lg hover:shadow-black/30
                active:shadow-md
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-[#1E4278]
                disabled:opacity-70 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  MEMPROSES...
                </>
              ) : 'LOGIN'}
            </button>
          </form>

          <div className="flex justify-center items-center mt-4 text-sm">
            <button
              onClick={handleForgotPassword}
              className="
                text-gray-400
                transition
                hover:text-[#1E4278]
                active:text-[#1E4278]
                focus-visible:outline-none
                focus-visible:underline
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          {/* Demo Info Tambahan */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700 text-center">
              <strong>Note:</strong> Sistem dalam mode pengembangan. Gunakan akun demo di sebelah kiri untuk login.
            </p>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Satgas PPKPT UAJY
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Sistem Pelaporan v2.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}