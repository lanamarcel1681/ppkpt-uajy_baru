"use client";

import { useEffect, useState } from "react";

const Stats = () => {
  const [stats, setStats] = useState([
    { number: "0", label: "Laporan Ditangani" },
    { number: "0%", label: "Tingkat Penyelesaian" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/statistics");
        if (res.ok) {
          const data = await res.json();
          setStats([
            { number: `${data.summary.total}`, label: "Laporan Ditangani" },
            { number: data.summary.completionRate, label: "Tingkat Penyelesaian" },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="bg-[#245399] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 font-eras">
            Dampak Kami
          </h2>
          <p className="text-blue-100">
            Komitmen kami dalam menciptakan kampus yang aman tercermin dalam
            angka-angka berikut yang terus bertumbuh seiring kepercayaan civitas
            akademika.
          </p>
        </div>

        {/* Grid Box Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center hover:bg-white/20 transition duration-300"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 font-eras">
                {item.number.includes("+") || item.number.includes("%") ? (
                  <>
                    {item.number.replace(/[\+%]/g, "")}
                    <span className="text-[#EDA60E]">
                      {item.number.slice(-1)}
                    </span>
                  </>
                ) : (
                  item.number
                )}
              </h3>
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
