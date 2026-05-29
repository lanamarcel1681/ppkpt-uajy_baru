type StatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "blue" | "yellow" | "orange" | "green";
};

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm text-black">{title}</h3>
        <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
      </div>
      <h2 className="text-2xl font-bold text-black">{value}</h2>
    </div>
  );
}
