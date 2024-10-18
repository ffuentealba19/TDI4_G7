import { run } from "@/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Report from "@/models/reportUsers";  
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"; 

export async function POST(req: NextRequest) {
    try {
        await run();

        const { titulo, descripcion } = await req.json();
        const galleta = cookies();
        const token = galleta.get("token");

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!titulo || !descripcion) {
            return NextResponse.json({ message: "Propiedades faltantes" }, { status: 400 });
        }

        const decodedToken: any = jwt.verify(token.value, process.env.JWT_SECRET || 'default_secret');
        const usuarioID = decodedToken.userId;

        const newReport = new Report({
            usuarioID,
            titulo,
            descripcion,
            fecha: new Date(),
        });

        await newReport.save();

        return NextResponse.json({
            message: 'Reporte creado con éxito',
            report: newReport,
        }, { status: 201 });

    } catch (error) {
        console.error("Error al crear el reporte:", error);
        return NextResponse.json({ message: "Error al crear el reporte" }, { status: 500 });
    }
}
