// src/app/berita/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Header from "@/components/berita/Header";
import NewsFeed from "@/components/berita/NewsFeed";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import FloatingPanduan from "@/components/beranda/FloatingPanduan";

import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function BeritaPage() {
  const berita = await prisma.berita.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="pt-[96px]">
        {/* Komponen Header (Statis) */}
        <Header />

        {/* Komponen Berita (Dinamis: Filter + Pagination) */}
        <ScrollAnimation>
          <NewsFeed initialNews={berita} />
        </ScrollAnimation>
      </div>
      <Footer />
      <FloatingPanduan />
    </main>
  );
}
