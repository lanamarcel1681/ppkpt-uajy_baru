// src/components/TipeKekerasan.tsx

interface Contoh {
  id: number;
  isi_contoh: string;
}

interface KekerasanType {
  id: number;
  judul: string;
  deskripsi: string;
  contoh: Contoh[];
}

interface TipeKekerasanProps {
  data: KekerasanType[];
}

const TipeKekerasan = ({ data }: TipeKekerasanProps) => {
  return (
    <section className="relative bg-[#E0E2EC] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#EDA60E] text-white px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Kenali Bentuk Kekerasan
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#245399] mb-4 font-eras">
            Jenis-Jenis Kekerasan
          </h2>
          <p className="text-[#43474E]">
            Pahami berbagai bentuk kekerasan yang dapat terjadi di lingkungan
            kampus
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((type, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold text-[#245399] mb-3 font-eras">
                {type.judul}
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed h-16">
                {type.deskripsi}
              </p>

              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
                  CONTOH:
                </span>
                <ul className="space-y-2">
                  {type.contoh.map((ex, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="w-1.5 h-1.5 bg-[#EDA60E] rounded-full shrink-0"></span>
                      {ex.isi_contoh}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TipeKekerasan;
