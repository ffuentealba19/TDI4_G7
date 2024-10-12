// src/app/api/updateConfig/route.ts
import { NextRequest, NextResponse } from "next/server";
import { run } from "@/libs/mongodb"; 
import { Config } from "@/models/config";

export async function POST(req: NextRequest) {
    try {
        await run(); 

        const { configKey, configValue } = await req.json(); 

        
        const updatedConfig = await Config.findOneAndUpdate(
            { key: configKey }, 
            { value: configValue }, 
            { new: true } 
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
