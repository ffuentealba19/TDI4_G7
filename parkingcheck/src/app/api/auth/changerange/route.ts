// src/app/api/changerange/route.ts
import { NextRequest, NextResponse } from "next/server";
import { run } from "@/libs/mongodb"; 
import User from "@/models/users";  // Asegúrate de importar tu modelo de usuario

export async function POST(req: NextRequest) {
    try {
        await run(); 

        const { userId, changeToVip } = await req.json(); 
        
        // Encuentra al usuario y actualiza su estado VIP
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { vip: changeToVip },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ message: "Estado VIP actualizado", updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error al cambiar el estado VIP:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
