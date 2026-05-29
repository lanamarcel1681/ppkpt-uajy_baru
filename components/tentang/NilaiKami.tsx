import { Shield, Heart, Scale, BookOpen, Star } from "lucide-react";

interface NilaiKamiProps {
  values: {
    id: number;
    judul: string;
    deskripsi: string;
  }[];
}

const NilaiKami = ({ values }: NilaiKamiProps) => {
  // Fallback if no values
  if (!values || values.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <h2 className="text-3xl font-bold text-[#245399] font-eras mb-10 text-center">
        Nilai-Nilai Kami
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((val, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-lg transition border border-gray-100 text-center flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-[#FEF3C7] rounded-2xl flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-[#92400E]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 font-eras">
              {val.judul}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {val.deskripsi}
            </p>
          </div>
        ))}
      </div> 
    </section>
  );
};
export default NilaiKami;
