// src/app/page.tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/beranda/Hero";
import AlurKerja from "@/components/beranda/AlurKerja";
import Services from "@/components/beranda/Layanan";
import ViolenceTypes from "@/components/beranda/TipeKekerasan";
import Stats from "@/components/beranda/Stats";
import CallToAction from "@/components/beranda/BuatLaporan";
import Footer from "@/components/Footer"; // Import Footer
import FloatingPanduan from "@/components/beranda/FloatingPanduan";
import { prisma } from "@/lib/prisma";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const config = await prisma.konfigurasiBeranda.findFirst({
    where: { id: 1 },
  });

  const layananData = await prisma.layanan.findMany({
    orderBy: { createdAt: "desc" },
  });

  const kekerasanData = await prisma.jenisKekerasan.findMany({
    include: { contoh: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="pt-[96px]">
        <ScrollAnimation>
          <Hero
            heroTitle={config?.heroTitle}
            heroSubtitle={config?.heroSubtitle}
            heroHotlineNumber={config?.heroHotlineNumber}
            heroImageUrl={config?.heroImageUrl}
          />
        </ScrollAnimation>

        <ScrollAnimation>
          <AlurKerja />
        </ScrollAnimation>

        <ScrollAnimation>
          <Services data={layananData} />
        </ScrollAnimation>

        <ScrollAnimation>
          <ViolenceTypes data={kekerasanData} />
        </ScrollAnimation>

        <ScrollAnimation>
          <Stats />
        </ScrollAnimation>

        <ScrollAnimation>
          <CallToAction />
        </ScrollAnimation>
      </div>

      {/* Tambahkan Footer di paling bawah */}
      <Footer />

      {/* Floating Button untuk Panduan Sistem */}
      <FloatingPanduan />
    </main>
  );
}
