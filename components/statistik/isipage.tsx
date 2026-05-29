"use client";


import { FileText, Clock, Activity, Filter, Download, Calendar } from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { getAcademicYear } from "@/lib/academicYear";

import { Report } from "./utils/types";
import {
  processMonthlyData,
  processViolenceData,
  processStatusData,
  processDurationData,
  processSanksiData
} from "./utils/dataProcessors";
import { SummaryCard } from "./ui/SummaryCard";

import { Charts } from "./ui/Charts";

// --- Page Component ---
export default function StatistikPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  // -- Global Filter States --
  const currentAcademicYear = getAcademicYear(new Date());
  const [activeTahun] = useState<string>(currentAcademicYear);
  const [selectedTahunAkademik, setSelectedTahunAkademik] = useState("Semua Semester");

  const printRef = useRef<HTMLDivElement>(null);
  const tablesRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    console.log("Starting PDF export...");
    if (!printRef.current) {
      console.error("Print ref is null");
      return;
    }

    try {
      const { toPng } = await import('html-to-image');
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - (margin * 2);

      let currentY = margin;

      // Helper to add image to PDF
      const addImageToPdf = async (element: HTMLElement, title?: string) => {
        const dataUrl = await toPng(element, { cacheBust: true, backgroundColor: "#ffffff" });
        const imgProps = pdf.getImageProperties(dataUrl);
        const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

        // Check if we need a new page
        if (currentY + imgHeight + 10 > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }

        if (title) {
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.text(title, margin, currentY + 5);
          currentY += 10;
        }

        pdf.addImage(dataUrl, "PNG", margin, currentY, contentWidth, imgHeight);
        currentY += imgHeight + 10; // Add some spacing
      };

      // 1. Header
      const titleText = "Laporan Statistik PPKPT";
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      const titleWidth = pdf.getTextWidth(titleText);
      pdf.text(titleText, (pageWidth - titleWidth) / 2, currentY + 5);
      currentY += 15;

      // 3. SECION: Table & Chart Interleaved
      const tables = tablesRef.current?.querySelectorAll('.table-card');
      const charts = printRef.current?.querySelectorAll('.chart-card');

      if (tables && charts) {
        // Assume tables and charts have the same length and order
        for (let i = 0; i < tables.length; i++) {
          const table = tables[i] as HTMLElement;
          const chart = charts[i] as HTMLElement;

          // Add Table
          await addImageToPdf(table);

          // Add corresponding Chart
          await addImageToPdf(chart);

          // Add some spacing between different datasets
          currentY += 10;
        }
      }

      pdf.save("laporan-statistik-ppkpt.pdf");
      console.log("PDF exported successfully");
    } catch (err) {
      console.error("Failed to export PDF", err);
      // alert("Gagal mengexport PDF. Silakan cek console untuk detail.");
    }
  };

  const handleExportExcel = () => {
    try {
      // Helper function to create sheet with title
      const createSheetWithTitle = (title: string, data: any[]) => {
        // Create an empty worksheet
        const ws = XLSX.utils.aoa_to_sheet([
          [title], // Row 1: Title
          []       // Row 2: Empty line for spacing
        ]);

        // Append JSON data starting from Row 3 (index 2)
        XLSX.utils.sheet_add_json(ws, data, { origin: "A3" });
        return ws;
      };

      const monthlyArr = monthlyData.map(d => ({
        "Bulan": d.month,
        "Laporan Masuk": d.masuk,
        "Laporan Selesai": d.selesai,
        "Laporan Ditolak": d.tolak,
      }));
      const wsMonthly = createSheetWithTitle("Tren Laporan Bulanan", monthlyArr);

      const pieArr = pieData.map((d: any) => ({
        "Jenis Kekerasan": d.name,
        "Jumlah": d.value
      }));
      const wsPie = createSheetWithTitle("Distribusi Jenis Kekerasan", pieArr);

      const sanksiArr = sanksiData.map(d => ({
        "Sanksi": d.name,
        "Jumlah": d.value
      }));
      const wsSanksi = createSheetWithTitle("Distribusi Sanksi", sanksiArr);

      const statusArr = statusData.map(d => ({
        "Status": d.name,
        "Jumlah": d.value
      }));
      const wsStatus = createSheetWithTitle("Status Laporan", statusArr);

      const durationArr = durationData.map(d => ({
        "Waktu": d.name,
        "Jumlah": d.value
      }));
      const wsDuration = createSheetWithTitle("Waktu Penyelesaian", durationArr);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsMonthly, "Tren Laporan");
      XLSX.utils.book_append_sheet(wb, wsPie, "Jenis Kekerasan");
      XLSX.utils.book_append_sheet(wb, wsSanksi, "Distribusi Sanksi");
      XLSX.utils.book_append_sheet(wb, wsStatus, "Status Laporan");
      XLSX.utils.book_append_sheet(wb, wsDuration, "Waktu Penyelesaian");

      XLSX.writeFile(wb, `Statistik_PPKPT_${selectedTahunAkademik.replace('/', '-')}.xlsx`);
    } catch (err) {
      console.error("Failed to export Excel", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = localStorage.getItem("ppkpt_role");
        setUserRole(role);

        // Fetch reports (you might want to pass role/email like in laporanTable in the future
        // but for now keeping the existing /api/statistics call if it returns what you need)
        const resReports = await fetch("/api/statistics");

        if (resReports.ok) {
          const json = await resReports.json();
          setReports(json.reports || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // -- Memoized Filters & Data --
  const filteredReports = useMemo(() => {
    let result = [...reports];

    if (userRole === "Tim Satgas") {
      // Satgas ONLY sees reports from the CURRENT active mathematical semester
      result = result.filter((item) => item.semester === currentAcademicYear);
    } else if (userRole === "Ketua" || userRole === "Sekretaris") {
      // Admin sees all, but can use the dynamic semester filter UI
      if (selectedTahunAkademik !== "Semua Semester") {
        result = result.filter(
          (item) => item.semester === selectedTahunAkademik,
        );
      }
    }

    return result;
  }, [reports, selectedTahunAkademik, userRole, currentAcademicYear]);

  // -- Derived Summary Stats --
  const summary = useMemo(() => {
    const total = filteredReports.length;
    let totalDurationDays = 0;
    let completedCount = 0;

    filteredReports.forEach(r => {
      if (r.status_laporan === "Selesai") {
        const start = new Date(r.tgl_laporan).getTime();
        const end = new Date(r.updatedAt).getTime();
        const diffDays = Math.ceil((end - start) / (86400000));
        totalDurationDays += diffDays;
        completedCount++;
      }
    });

    const avgDuration = completedCount > 0 ? Math.round(totalDurationDays / completedCount) : 0;
    const completionRate = total > 0 ? ((completedCount / total) * 100).toFixed(1) : "0";

    return {
      total,
      avgDuration: `${avgDuration} hari`,
      completionRate: `${completionRate}%`
    };
  }, [filteredReports]);

  // -- Derived Chart Data --
  const monthlyData = useMemo(() => processMonthlyData(filteredReports), [filteredReports]);
  const pieData = useMemo(() => processViolenceData(filteredReports), [filteredReports]);
  const statusData = useMemo(() => processStatusData(filteredReports), [filteredReports]);
  const durationData = useMemo(() => processDurationData(filteredReports), [filteredReports]);
  const sanksiData = useMemo(() => processSanksiData(filteredReports), [filteredReports]);


  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded-xl"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-black">Statistik Laporan</h1>
          <p className="text-sm text-gray-500">
            Analisis data laporan Satgas PPKPT dengan filter global
          </p>
        </div>

        {/* Global Filter Bar */}
        {userRole === "Tim Satgas" ? (
          <div className="text-sm text-gray-700 bg-white px-3 py-1.5 rounded-lg border flex items-center gap-2 font-medium shadow-sm">
            <Calendar size={16} className="text-blue-500" />
            Tahun Ajaran Aktif:{" "}
            <span className="font-bold text-blue-700">{activeTahun}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm border">
            <Filter size={20} className="text-gray-500" />
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap hidden sm:inline">
              Filter Semester:
            </span>
            <select
              value={selectedTahunAkademik}
              onChange={(e) => setSelectedTahunAkademik(e.target.value)}
              className="bg-transparent border-none text-sm font-medium focus:outline-none focus:ring-0 min-w-[150px] text-black cursor-pointer"
            >
              <option value="Semua Semester">Semua Semester</option>
              {Array.from(new Set(reports.map((r) => r.semester).filter(Boolean) as string[])).map(
                (sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ),
              )}
            </select>
          </div>
        )}
      </div>

      <div ref={printRef} className="space-y-6">
        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-black summary-section">
          <SummaryCard
            icon={<FileText />}
            title="Total Laporan"
            value={summary.total}
            note="Berdasarkan Filter"
          />
          <SummaryCard
            icon={<Clock />}
            title="Rata-rata Waktu Penyelesaian"
            value={summary.avgDuration}
          />
          <SummaryCard
            icon={<Activity />}
            title="Tingkat Penyelesaian"
            value={summary.completionRate}
          />
        </div>

        {/* CHARTS */}
        <Charts
          monthlyData={monthlyData}
          pieData={pieData}
          sanksiData={sanksiData}
          statusData={statusData}
          durationData={durationData}
        />

        {/* EXPORT */}
        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl">
          <span className="text-sm text-gray-600">
            Unduh laporan statistik lengkap dalam format PDF atau Excel
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Download size={16} />
              Export PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Hidden container for PDF export table data */}
      <div className="fixed left-[-9999px] top-[-9999px]">
        <div ref={tablesRef} className="w-[800px] bg-white text-black p-4 space-y-8">

          <div className="table-card p-6 bg-white rounded-lg">
            <h3 className="font-bold text-center mb-4 text-xl">Judul: Tren Laporan Bulanan</h3>
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Bulan</th>
                  <th className="p-3 text-center">Laporan Masuk</th>
                  <th className="p-3 text-center">Laporan Selesai</th>
                  <th className="p-3 text-center">Laporan Ditolak</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((d, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{d.month}</td>
                    <td className="p-2 text-center">{d.masuk}</td>
                    <td className="p-2 text-center">{d.selesai}</td>
                    <td className="p-2 text-center">{d.tolak}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-card p-6 bg-white rounded-lg">
            <h3 className="font-bold text-center mb-4 text-xl">Judul: Distribusi Jenis Kekerasan</h3>
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Jenis Kekerasan</th>
                  <th className="p-3 text-center">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {pieData.map((d: any, i: number) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{d.name}</td>
                    <td className="p-2 text-center">{d.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-card p-6 bg-white rounded-lg">
            <h3 className="font-bold text-center mb-4 text-xl">Judul: Distribusi Sanksi</h3>
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Sanksi</th>
                  <th className="p-3 text-center">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {sanksiData.map((d, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{d.name}</td>
                    <td className="p-2 text-center">{d.value}</td>
                  </tr>
                ))}
                {(!sanksiData || sanksiData.length === 0) && (
                  <tr>
                    <td colSpan={2} className="p-4 text-center text-gray-500 border-b">
                      Belum ada data sanksi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-card p-6 bg-white rounded-lg">
            <h3 className="font-bold text-center mb-4 text-xl">Judul: Status Laporan</h3>
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {statusData.map((d, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{d.name}</td>
                    <td className="p-2 text-center">{d.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-card p-6 bg-white rounded-lg">
            <h3 className="font-bold text-center mb-4 text-xl">Judul: Waktu Penyelesaian</h3>
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Waktu</th>
                  <th className="p-3 text-center">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {durationData.map((d, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{d.name}</td>
                    <td className="p-2 text-center">{d.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


