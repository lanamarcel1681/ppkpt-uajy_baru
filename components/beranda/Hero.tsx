// src/components/Hero.tsx
import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroHotlineNumber?: string | null;
  heroImageUrl?: string | null;
}

const Hero = ({
  heroTitle,
  heroSubtitle,
  heroHotlineNumber,
  heroImageUrl,
}: HeroProps) => {
  return (
    <section className="relative bg-[#245399] pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* KONTEN KIRI (TEKS) */}
        <div className="relative z-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-6 font-eras">
            {heroTitle}
          </h1>

          <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-lg">
            {heroSubtitle}
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link
              href="/lapor"
              className="bg-[#EDA60E] hover:bg-[#d6960c] text-white font-bold px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105"
            >
              Laporkan Kekerasan
            </Link>
            <Link
              href="/tentang"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-[#245399] text-white font-bold px-8 py-3 rounded-full transition"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>

          {/* Kotak Hotline */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex items-center gap-4 max-w-md">
            <div className="w-12 h-12 bg-[#EDA60E] rounded-xl flex items-center justify-center text-white shrink-0">
              {/* Icon Phone */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.5V4.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <a
              href="https://wa.me/6282220064236"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition text-left"
            >
              <p className="text-blue-100 text-sm">Hotline Darurat</p>
              <p className="text-white text-xl font-bold font-eras">
                {heroHotlineNumber}
              </p>
            </a>
          </div>
        </div>

        {/* KONTEN KANAN (GAMBAR) */}
        <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          {/* Komponen Next.js Image */}
          <Image
            src={heroImageUrl || "/Gambar1.jpg"} // Pastikan file ada di folder 'public'
            alt="Mahasiswa UAJY"
            fill
            className="object-cover"
            priority // Opsional: agar gambar dimuat lebih prioritas (tidak lazy load)
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
