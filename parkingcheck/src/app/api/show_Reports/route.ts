import { NextRequest, NextResponse } from "next/server"; 
import { run } from '@/libs/mongodb';
import Report from '@/models/reportUsers';

export async function POST(req: NextRequest) {
    try {
        const reports = await getReports();
        console.log("Reports fetched from database: ", reports);
        
        return NextResponse.json({ reports });
    } catch (error) {
        console.error("Error fetching reports: ", error);
        return new NextResponse("Error fetching reports", { status: 500 });
    }
}

export async function getReports() {
    try {
        await run(); // Asegúrate de que `run` establece la conexión con la base de datos
        const reports = await Report.find(); // `Report` es el modelo de Mongoose
        return reports;
    } catch (error) {
        console.error("Error al obtener reportes:", error);
        throw new Error("Error al obtener reportes");
    }
}
