import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import NewsDetail from "@/components/berita/NewsDetail";

export default async function NewsDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const berita = await prisma.berita.findUnique({
    where: { slug: params.slug },
  });

  const latestNews = await prisma.berita.findMany({
    where: {
      slug: { not: params.slug },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  if (!berita) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Adjusted padding top to avoid collision with navbar */}
      <div className="pt-[140px] pb-20">
        <NewsDetail berita={berita} latestNews={latestNews} />
      </div>

      <Footer />
    </main>
  );
}
