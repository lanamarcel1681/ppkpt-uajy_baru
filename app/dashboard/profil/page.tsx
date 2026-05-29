import DashboardLayout from "@/components/dashboard/dashboardLayout";
import ProfilForm from "@/components/dashboard_admin/ProfilForm_admin";

export default function ProfilPage() {
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50/50">
                <ProfilForm />
            </div>
        </DashboardLayout>
    );
}
