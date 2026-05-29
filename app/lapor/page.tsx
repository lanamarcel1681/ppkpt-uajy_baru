// src/app/lapor/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Notice from "@/components/lapor/Notice";
import Header from "@/components/lapor/Header";
import FormLapor from "@/components/lapor/FormLapor";

export const dynamic = 'force-dynamic';

export default function LaporPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="pt-[96px]">
        {/* Header Biru */}
        <Header />

        <Notice />

        {/* Form Laporan (Overlap ke atas Header) */}
        <FormLapor />
      </div>

      <Footer />
    </main>
  );
}
