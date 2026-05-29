"use client";

import StatCard from "@/components/dashboard/statcard";
import ReportTable from "@/components/dashboard/reporttable";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Clock, AlertTriangle, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    review: 0,
    proses: 0,
    selesai: 0,
  });

  useEffect(() => {
    // Redirection for Admin CMS
    const role = localStorage.getItem("ppkpt_role");
    if (role === "Admin CMS") {
      router.push("/dashboard/cms");
      return;
    }

    const fetchStats = async () => {
      try {
        const role = localStorage.getItem("ppkpt_role");
        const email = localStorage.getItem("ppkpt_email");

        const params = new URLSearchParams();
        if (role) params.append("role", role);
        if (email) params.append("email", email);

        const res = await fetch(`/api/dashboard/stats?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-gray-500">Memuat dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Laporan"
          value={stats.total.toString()}
          icon={<FileText />}
          color="blue"
        />
        <StatCard
          title="Menunggu Review"
          value={stats.review.toString()}
          icon={<Clock />}
          color="yellow"
        />
        <StatCard
          title="Dalam Proses"
          value={stats.proses.toString()}
          icon={<AlertTriangle />}
          color="orange"
        />
        <StatCard
          title="Selesai"
          value={stats.selesai.toString()}
          icon={<CheckCircle />}
          color="green"
        />
      </div>
      <ReportTable />
    </DashboardLayout>
  );
}
