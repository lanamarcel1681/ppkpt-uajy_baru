"use client";
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import CMSHeader from "@/components/cms/CMSHeader";
import CMSInfoBanner from "@/components/cms/CMSInfoBanner";
import CMSTabs from "@/components/cms/CMSTabs";
import CMSContent from "@/components/cms/CMSContent";
import FloatingSaveButton from "@/components/cms/FloatingSaveButton";
import { CMSProvider } from "@/components/cms/CMSContext";

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState("Hero");
  const tabs = [
    "Hero",
    "Navbar",
    "Alur Kerja",
    "Layanan",
    "Kekerasan",
    "CTA",
    "Footer",
    "Berita",
    "Tentang Kami",
  ];

  return (
    <DashboardLayout>
      <CMSProvider>
        <div className="space-y-8 max-w-7xl mx-auto">
          <CMSHeader />
          <CMSInfoBanner />
          <CMSTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
          />
          <CMSContent activeTab={activeTab} />
          <FloatingSaveButton />
        </div>
      </CMSProvider>
    </DashboardLayout>
  );
}