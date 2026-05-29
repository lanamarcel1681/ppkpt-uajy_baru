import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { KonfigurasiFooter } from "@prisma/client";
import {
  Shield,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

export default async function Footer() {
  // Fetch config directly from DB (Server Component)
  let config: KonfigurasiFooter | null =
    await prisma.konfigurasiFooter.findFirst();
  const globalConfig = await prisma.konfigurasiBeranda.findFirst();

  // Fallback defaults if not set
  if (!config) {
    config = {
      id: 0,
      footerTitle: "Satgas PPKPT",
      footerDescription:
        "Menciptakan lingkungan kampus yang aman dan bebas dari kekerasan seksual.",
      alamat:
        "Gedung Rektorat Lt. 2\nUniversitas Atma Jaya Yogyakarta\nJl. Babarsari No.44, Yogyakarta",
      email: "satgas@uajy.ac.id",
      telepon: "0800-123-4567",
      footerLogoUrl: null,
      facebookUrl: "",
      instagramUrl: "",
      twitterUrl: "",
      youtubeUrl: "",
    } as KonfigurasiFooter;
  }

  // Tentukan logo final: Prioritas Logo Footer > Logo Global > Default Shield
  const finalLogoUrl = config.footerLogoUrl || globalConfig?.navbarLogoUrl;

  return (
    <footer className="bg-[#245399] text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* KOLOM 1: BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              {/* Logo: Custom Image or Default Shield */}
              {finalLogoUrl ? (
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md overflow-hidden p-1">
                  <img
                    src={finalLogoUrl}
                    alt="Logo Footer"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-[#EDA60E] rounded-lg flex items-center justify-center text-white shadow-md">
                  <Shield size={24} strokeWidth={2} />
                </div>
              )}

              <div className="flex flex-col">
                <span className="text-xl font-bold font-eras leading-none mb-2">
                  {config.footerTitle}
                </span>
                <span className="text-sm text-blue-200">
                  Universitas Atma Jaya Yogyakarta
                </span>
              </div>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed whitespace-pre-line">
              {config.footerDescription}
            </p>
          </div>

          {/* KOLOM 2: TAUTAN CEPAT (Static) */}
          <div>
            <h3 className="text-lg font-bold font-eras mb-6">Tautan Cepat</h3>
            <ul className="space-y-4 text-sm text-blue-100">
              <li>
                <Link
                  href="/tentang"
                  className="hover:text-white hover:underline transition"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/berita"
                  className="hover:text-white hover:underline transition"
                >
                  Berita
                </Link>
              </li>
              <li>
                <Link
                  href="/kontak"
                  className="hover:text-white hover:underline transition"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: KONTAK (Dynamic) */}
          <div>
            <h3 className="text-lg font-bold font-eras mb-6">Kontak</h3>
            <ul className="space-y-4 text-sm text-blue-100">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#EDA60E] shrink-0" />
                <span>{config.telepon}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#EDA60E] shrink-0" />
                <span>{config.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#EDA60E] shrink-0" />
                <span className="whitespace-pre-line">{config.alamat}</span>
              </li>
            </ul>
          </div>

          {/* KOLOM 4: IKUTI KAMI */}
          <div>
            <h3 className="text-lg font-bold font-eras mb-6">Ikuti Kami</h3>

            {/* Social Icons with Lucide */}
            <div className="flex gap-4 mb-8">
              {config.facebookUrl && (
                <SocialLink
                  href={config.facebookUrl}
                  icon={<Facebook size={20} />}
                />
              )}
              {config.instagramUrl && (
                <SocialLink
                  href={config.instagramUrl}
                  icon={<Instagram size={20} />}
                />
              )}
              {config.twitterUrl && (
                <SocialLink
                  href={config.twitterUrl}
                  icon={<Twitter size={20} />}
                />
              )}
              {config.youtubeUrl && (
                <SocialLink
                  href={config.youtubeUrl}
                  icon={<Youtube size={20} />}
                />
              )}
            </div>
          </div>
        </div>

        {/* COPYRIGHT BAR (Dynamic Year) */}
        <div className="border-t border-blue-800 pt-8 text-center text-sm text-blue-300">
          <p>
            &copy; {new Date().getFullYear()} {config.footerTitle}. Semua hak
            dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Komponen Helper untuk Social Media Icons
const SocialLink = ({
  href,
  icon,
}: {
  href: string;
  icon: React.ReactNode;
}) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center text-white hover:bg-[#EDA60E] hover:text-white transition duration-300"
  >
    {icon}
  </Link>
);
