import Link from "next/link";
import { Calendar, User, ArrowLeft, ChevronRight, Clock, House } from "lucide-react";

interface NewsItem {
  id: number;
  slug: string;
  judul: string;
  kategori: string;
  penulis: string;
  createdAt: Date | string;
  konten: string;
  gambarUrl: string | null;
  dokumentasi1?: string | null;
  dokumentasi2?: string | null;
}

interface NewsDetailProps {
  berita: NewsItem;
  latestNews: NewsItem[];
}

const NewsDetail = ({ berita, latestNews }: NewsDetailProps) => {

  const renderDocPhoto = (url: string | null | undefined, alt: string) => {
    if (!url) return null;
    return (
      <figure className="my-10">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <img
            src={url}
            alt={alt}
            className="w-full h-auto max-h-[500px] object-cover hover:scale-105 transition duration-500 ease-in-out"
          />
        </div>
      </figure>
    );
  };

  // Function to split content and intersperse images
  const renderContentWithPhotos = () => {
    if (!berita.konten) return null;

    // Split by double newline to identify potential paragraph breaks
    const paragraphs = berita.konten.split(/\n\n+/);
    const total = paragraphs.length;

    // If content is short or minimal paragraphs, just append images at the end
    if (total < 3) {
      return (
        <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-line mb-12">
          {berita.konten}
          {renderDocPhoto(berita.dokumentasi1, "Dokumentasi Tambahan 1")}
          {renderDocPhoto(berita.dokumentasi2, "Dokumentasi Tambahan 2")}
        </div>
      );
    }

    // Determine split indices
    // Example: 6 paragraphs -> split at 2 (1/3) and 4 (2/3)
    const idx1 = Math.max(1, Math.floor(total / 3));
    const idx2 = Math.max(idx1 + 1, Math.floor(2 * total / 3));

    const part1 = paragraphs.slice(0, idx1).join("\n\n");
    const part2 = paragraphs.slice(idx1, idx2).join("\n\n");
    const part3 = paragraphs.slice(idx2).join("\n\n");

    return (
      <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-line mb-12">
        {part1}

        {renderDocPhoto(berita.dokumentasi1, "Dokumentasi Tambahan 1")}

        {part2}

        {renderDocPhoto(berita.dokumentasi2, "Dokumentasi Tambahan 2")}

        {part3}
      </div>
    );
  };

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb / Back */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-gray-500">
          <li>
            <Link href="/" className="hover:text-[#1E4278] transition flex items-center gap-1.5">
              <House size={16} />
              Beranda
            </Link>
          </li>
          <li>
            <ChevronRight size={16} />
          </li>
          <li>
            <Link href="/berita" className="hover:text-[#1E4278] transition">
              Berita
            </Link>
          </li>
          <li>
            <ChevronRight size={16} />
          </li>
          <li>
            <span className="text-gray-900 font-medium line-clamp-1">
              {berita.judul}
            </span>
          </li>
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {/* Header */}
          <div className="mb-8">
            <span className="bg-[#FEF3C7] text-[#92400E] px-4 py-1.5 rounded-full text-sm font-bold">
              {berita.kategori}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mt-6 mb-6 font-eras leading-tight">
              {berita.judul}
            </h1>

            <div className="flex items-center gap-6 text-gray-500 text-sm border-b border-gray-100 pb-8">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                {new Date(berita.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <User size={18} />
                {berita.penulis}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {berita.gambarUrl && (
            <div className="relative w-full h-[240px] md:h-[400px] rounded-2xl overflow-hidden mb-12 shadow-sm">
              <img
                src={berita.gambarUrl}
                alt={berita.judul}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {renderContentWithPhotos()}
        </div>

        {/* Sidebar - Latest News */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 top-24 sticky">
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-eras border-b border-gray-200 pb-4">
              Berita Terbaru
            </h3>
            <div className="space-y-6">
              {latestNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="flex gap-4 group items-start"
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
                    {item.gambarUrl ? (
                      <img
                        src={item.gambarUrl}
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-[#245399] mb-1 block">
                      {item.kategori}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 mb-1 leading-snug group-hover:text-[#245399] transition line-clamp-2">
                      {item.judul}
                    </h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              ))}

              {latestNews.length === 0 && (
                <p className="text-sm text-gray-500">Belum ada berita terbaru lainnya.</p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link href="/berita" className="text-sm font-semibold text-[#245399] hover:underline flex items-center gap-1">
                Lihat Semua Berita <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
};

export default NewsDetail;
