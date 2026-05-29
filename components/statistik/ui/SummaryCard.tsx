import React from "react";

export function SummaryCard({
    icon,
    title,
    value,
    note,
}: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    note?: string;
}) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-xl font-bold">{value}</p>
                {note && <p className="text-xs text-gray-400">{note}</p>}
            </div>
        </div>
    );
}
