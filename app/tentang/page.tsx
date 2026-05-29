import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Header from "@/components/tentang/Header";
import VisiMisi from "@/components/tentang/VisiMisi";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import TimSatgas from "@/components/tentang/TimSatgas";
import { prisma } from "@/lib/prisma";
import FloatingPanduan from "@/components/beranda/FloatingPanduan";

export const dynamic = 'force-dynamic';
// Revalidate every 60 seconds
export const revalidate = 60;

async function getTentangData() {
  const profil = await prisma.profilSatgas.findFirst();

  const tim = await prisma.anggotaTim.findMany({
    orderBy: { urutan: "asc" },
    include: {
      pengurus: {
        include: {
          role: true,
        },
      },
    },
  });

  return { profil, tim };
}

export default async function TentangPage() {
  const { profil, tim } = await getTentangData();

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="pt-[96px]">
        <Header />
        <ScrollAnimation>
          <VisiMisi
            deskripsi={profil?.deskripsi_profil || ""}
            visi={profil?.visi || ""}
            misi={profil?.misi || ""}
          />
        </ScrollAnimation>
        <ScrollAnimation>
          <TimSatgas members={tim} />
        </ScrollAnimation>
      </div>
      <Footer />
      <FloatingPanduan />
    </main>
  );
}
