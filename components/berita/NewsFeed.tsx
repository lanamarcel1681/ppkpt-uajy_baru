// src/components/berita/NewsFeed.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";

// Define interface matching (or compatible with) our Prisma model
export interface NewsItem {
  id: number;
  slug: string;
  judul: string;
  kategori: string;
  penulis: string;
  experpt?: string; // Note: typo in prisma model might be 'excerpt', check schema. Schema says 'excerpt'.
  excerpt: string;
  konten: string;
  gambarUrl: string | null;
  createdAt: string | Date;
}

interface NewsFeedProps {
  initialNews: NewsItem[];
}

// Categories will be fetched dynamically
// const CATEGORIES = [
//   "Semua",
//   "Kegiatan",
//   "Pengumuman",
//   "Kerja Sama",
//   "Edukasi",
//   "Pelatihan",
//   "Kampanye",
//   "Berita",
//   "Artikel",
// ];

const ITEMS_PER_PAGE = 6;

const NewsFeed = ({ initialNews }: NewsFeedProps) => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<string[]>(["Semua"]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/cms/kategori-berita");
        if (res.ok) {
          const data = await res.json();
          // Assuming the API returns objects with { id, nama }
          const categoryNames = data.map((item: { nama: string }) => item.nama);
          setCategories(["Semua", ...categoryNames]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Helper to format date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper to estimate read time (simple word count)
  // const getReadTime = (content: string) => {
  //   const words = content.split(" ").length;
  //   const minutes = Math.ceil(words / 200);
  //   return `${minutes} mnt`;
  // };

  // 1. Filter Data
  const filteredNews =
    activeCategory === "Semua"
      ? initialNews
      : initialNews.filter((item) => item.kategori === activeCategory);

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);

  const displayedNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* --- FILTER TABS --- */}
      <div className="border-b border-gray-100 sticky top-[96px] bg-white z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto py-6 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-2 text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${activeCategory === cat
                  ? "border-[#245399] text-[#245399]"
                  : "border-transparent text-gray-600 hover:border-[#245399]/10"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- LIST BERITA (GRID) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Grid News */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {displayedNews.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Gambar (Fallback jika null) */}
              <div className="relative h-56 w-full bg-gray-200 overflow-hidden">
                {item.gambarUrl ? (
                  <img
                    src={item.gambarUrl}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                    <span className="text-sm">No Image</span>
                  </div>
                )}
              </div>

              {/* Konten */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="mb-4">
                  <span className="bg-[#FEF3C7] text-[#92400E] text-xs font-bold px-4 py-1.5 rounded-full">
                    {item.kategori}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-eras leading-tight group-hover:text-[#245399] transition">
                  <Link href={`/berita/${item.slug}`}>{item.judul}</Link>
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {item.excerpt}
                </p>
                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-3 text-xs text-gray-500 font-medium">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />{" "}
                      {formatDate(item.createdAt)}
                    </div>
                    {/* <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> {getReadTime(item.konten)}
                    </div> */}
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4" /> {item.penulis}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- STATE KOSONG --- */}
        {filteredNews.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p>Tidak ada berita dalam kategori ini.</p>
          </div>
        )}

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-3 rounded-full border ${currentPage === 1
                ? "text-gray-300 border-gray-200 cursor-not-allowed"
                : "text-[#245399] border-[#245399] hover:bg-blue-50"
                }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-full font-bold transition-colors ${currentPage === page
                      ? "bg-[#245399] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-3 rounded-full border ${currentPage === totalPages
                ? "text-gray-300 border-gray-200 cursor-not-allowed"
                : "text-[#245399] border-[#245399] hover:bg-blue-50"
                }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NewsFeed;
