// src/app/api/updateConfig/route.ts
import { NextRequest, NextResponse } from "next/server";
import { run } from "@/libs/mongodb"; // Asegúrate de tener tu función de conexión a MongoDB
import { Config } from "@/models/config";
export async function POST(req: NextRequest) {
    try {
        await run(); // Conéctate a MongoDB

        const { configKey, configValue } = await req.json(); // Obtener los datos del cuerpo de la solicitud

        // Actualiza la configuración en la base de datos
        const updatedConfig = await Config.findOneAndUpdate(
            { key: configKey }, // Condición para encontrar el documento
            { value: configValue }, // Nuevo valor
            { new: true } // Devuelve el documento actualizado
        );

        if (!updatedConfig) {
            return NextResponse.json({ message: "Configuración no encontrada" }, { status: 404 });
        }

        return NextResponse.json({ message: "Configuración actualizada", updatedConfig }, { status: 200 });
    } catch (error) {
        console.error("Error al actualizar la configuración:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
