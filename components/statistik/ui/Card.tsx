import React from "react";

export function Card({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm chart-card">
            <h2 className="font-semibold mb-2">{title}</h2>
            {children}
        </div>
    );
}
