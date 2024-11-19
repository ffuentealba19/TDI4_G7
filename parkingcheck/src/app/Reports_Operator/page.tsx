"use client";

import { NavbarOperario } from '@/Components/NavBarOperario';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Report {
    _id: string;
    titulo: string;
    descripcion: string;
    usuarioID: string;
    fecha: string;
}

const Reports = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchReports = async () => {
        try {
            const response = await fetch("/api/show_Reports", { method: "POST" });
            if (!response.ok) {
                throw new Error("Failed to fetch reports");
            }

            const text = await response.text();
            const data = JSON.parse(text);
            setReports(data.reports);
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <NavbarOperario />
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                <h1>Reports</h1>
                {error ? (
                    <div>Error: {error}</div>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {reports.length > 0 ? (
                            reports.map((report) => (
                                <li key={report._id} style={{ marginBottom: "20px" }}>
                                    <div style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
                                        <h2><strong>Titulo: </strong>{report.titulo}</h2>
                                        <p><strong>Usuario ID:</strong> {report.usuarioID}</p>
                                        <p><strong>Fecha:</strong> {new Date(report.fecha).toLocaleString()}</p>
                                        <p><strong>Descripción:</strong> {report.descripcion}</p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>No hay reportes por solucionar</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Reports;