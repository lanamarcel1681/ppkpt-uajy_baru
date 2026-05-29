import { Shield } from "lucide-react";

const Notice = () => {
  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-2xl p-6 md:p-8 shadow-sm border border-yellow-300 flex flex-col md:flex-row gap-6 items-start"
          style={{ backgroundColor: "#FFEFC7" }}
        >
          <div className="shrink-0" style={{ color: "#3E2E00" }}>
            <Shield className="w-10 h-10 md:w-12 md:h-12" strokeWidth={1.5} />
          </div>
          <div>
            <h2
              className="text-xl md:text-2xl font-bold mb-4 font-eras"
              style={{ color: "#3E2E00" }}
            >
              Jaminan Kerahasiaan Data
            </h2>
            <ul
              className="space-y-3 text-base md:text-lg leading-relaxed"
              style={{ color: "#3E2E00" }}
            >
              <li className="flex items-start gap-2">
                <span
                  className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: "#3E2E00" }}
                />
                <span>
                  Semua data dan identitas pelapor akan dijaga kerahasiaannya
                  dengan ketat
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: "#3E2E00" }}
                />
                <span>
                  Hanya tim Satgas PPKPT yang berwenang yang dapat mengakses
                  informasi laporan
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: "#3E2E00" }}
                />
                <span>
                  Data akan dienkripsi dan disimpan dengan sistem keamanan
                  tinggi
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Notice;
