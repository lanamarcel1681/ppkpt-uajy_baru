// src/components/Layanan.tsx
import { Scale, Users, HandHeart } from "lucide-react";

interface LayananItem {
  title: string;
  desc: string;
  iconBg: string;
  icon: string;
}

interface LayananProps {
  data: LayananItem[];
}

const Layanan = ({ data }: LayananProps) => {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-[#245399] font-bold px-4 py-1.5 rounded-full text-sm mb-4">
            Layanan Kami
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#245399] mb-4 font-eras">
            Dukungan Pencegahan dan Penanganan
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Kami menyediakan berbagai layanan untuk mendukung pencegahan dan
            penanganan kekerasan seksual di lingkungan kampus
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col items-start text-left h-full"
            >
              {/* UPDATE DISINI: Menambahkan class untuk efek Hover pada Icon */}
              <div
                className={`w-14 h-14 ${item.iconBg} rounded-2xl flex items-center justify-center mb-6 transform transition-transform duration-300 hover:scale-110 cursor-pointer shadow-md`}
              >
                {item.icon === "Scale" ? (
                  <Scale className="w-6 h-6 text-white" />
                ) : item.icon === "Users" ? (
                  <Users className="w-6 h-6 text-white" />
                ) : item.icon === "HandHeart" ? (
                  <HandHeart className="w-6 h-6 text-white" />
                ) : (
                  <div
                    className="w-6 h-6 text-white"
                    dangerouslySetInnerHTML={{ __html: item.icon }}
                  />
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 font-eras">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Layanan;
