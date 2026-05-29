import { Shield, Target } from "lucide-react"; // Pastikan sudah install lucide-react

interface VisiMisiProps {
  deskripsi: string;
  visi: string;
  misi: string;
}

const VisiMisi = ({ deskripsi, visi, misi }: VisiMisiProps) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Intro Text */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-[#245399] font-eras mb-6">
          Tentang Kami
        </h2>
        <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
          <p>{deskripsi}</p>
        </div>
      </div>

      {/* Grid Visi & Misi */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* VISI */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-md transition border border-gray-100">
          <div className="w-14 h-14 bg-[#245399] rounded-2xl flex items-center justify-center text-white mb-6">
            <Shield className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 font-eras">
            Visi
          </h3>
          <p className="text-gray-600 leading-relaxed">{visi}</p>
        </div>

        {/* MISI */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-md transition border border-gray-100">
          <div className="w-14 h-14 bg-[#245399] rounded-2xl flex items-center justify-center text-white mb-6">
            <Target className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 font-eras">
            Misi
          </h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {misi}
          </p>
        </div>
      </div>
    </section>
  );
};
export default VisiMisi;
