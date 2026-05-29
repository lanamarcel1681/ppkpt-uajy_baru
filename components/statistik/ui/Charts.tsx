import React from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { Card } from "./Card";

interface ChartsProps {
    monthlyData: any[];
    pieData: any[];
    sanksiData: any[];
    statusData: any[];
    durationData: any[];
}

export function Charts({
    monthlyData,
    pieData,
    sanksiData,
    statusData,
    durationData,
}: ChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-black">
            <Card title="Tren Laporan Bulanan">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={monthlyData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="masuk"
                            name="Masuk"
                            stroke="#3b82f6"
                        />
                        <Line
                            type="monotone"
                            dataKey="selesai"
                            name="Selesai"
                            stroke="#10b981"
                        />
                        <Line
                            type="monotone"
                            dataKey="tolak"
                            name="Tolak"
                            stroke="#ff2929ff"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            <Card title="Distribusi Jenis Kekerasan">
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={120}
                            label
                        >
                            {pieData.map((entry: any, index: number) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>

            <Card title="Distribusi Sanksi">
                {sanksiData && sanksiData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={sanksiData}>
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8b5cf6" name="Jumlah" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[350px] flex items-center justify-center text-gray-400">
                        Belum ada data sanksi
                    </div>
                )}
            </Card>

            <Card title="Status Laporan">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={statusData}>
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" name="Jumlah" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card title="Waktu Penyelesaian">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart layout="vertical" data={durationData}>
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#10b981" name="Jumlah" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}
