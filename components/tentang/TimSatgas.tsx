import Image from "next/image";

interface TimSatgasProps {
  members: {
    id: number;
    nama: string;
    jabatan: string;
    fotoUrl: string | null;
    pengurus?: {
      nama_pengurus: string;
      role: {
        nama_role: string;
      };
    } | null;
  }[];
}

const TimSatgas = ({ members }: TimSatgasProps) => {
  if (!members || members.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <h2 className="text-3xl font-bold text-[#245399] font-poppins mb-12 text-center">
        Tim Satgas PPKPT
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {members.map((member, idx) => {
          // Priority: Dynamic Pengurus Data > Static Data
          const displayName = member.pengurus?.nama_pengurus || member.nama;
          const displayRole =
            member.pengurus?.role?.nama_role || member.jabatan;

          return (
            <div
              key={idx}
              className="rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group h-full flex flex-col bg-white"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                {member.fotoUrl ? (
                  <Image
                    src={member.fotoUrl}
                    alt={displayName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                    No Img
                  </div>
                )}
              </div>
              <div className="p-4 text-center flex-1 flex flex-col justify-center bg-gray-50/50">
                <h3 className="text-base font-bold text-[#1E4278] mb-1 font-poppins group-hover:text-[#245399] transition-colors line-clamp-2">
                  {displayName}
                </h3>
                <p className="text-xs text-gray-600 font-poppins font-medium line-clamp-2">
                  {displayRole}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default TimSatgas;
