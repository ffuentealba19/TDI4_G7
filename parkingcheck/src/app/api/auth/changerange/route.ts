import { NextRequest, NextResponse } from "next/server";
import { run } from "@/libs/mongodb"; 
import User from "@/models/users";  
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        await run(); 

        const { userId, changeToVip } = await req.json(); 

        console.log('userId:', userId, 'changeToVip:', changeToVip);

        // Validación de datos
        if (!userId || typeof changeToVip !== 'boolean') {
            return NextResponse.json({ message: "Datos de entrada inválidos" }, { status: 400 });
        }

        // Buscar y actualizar el usuario
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { vip: changeToVip },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
        }

        // Generar un nuevo token solo para ese usuario
        const newToken = jwt.sign(
            {
                userId: updatedUser._id,  // ID del usuario
                vip: updatedUser.vip,     // Estado VIP
                username: updatedUser.username  // Nombre de usuario
            }, 
            process.env.JWT_SECRET!,  // Asegúrate de tener una clave secreta configurada en tu entorno
            { expiresIn: '30d' }      // El token expira en 30 días
        );

        const response = NextResponse.json({ message: "Estado VIP actualizado", updatedUser }, { status: 200 });
        response.cookies.set('token', newToken, { 
            httpOnly: true,             // Protege la cookie para que solo sea accesible desde el servidor
            secure: process.env.NODE_ENV === 'production', // Asegura que la cookie solo se envíe a través de HTTPS en producción
            path: '/',                  // Hacer que la cookie esté disponible en toda la aplicación
            maxAge: 30 * 24 * 60 * 60   // Expiración de 30 días (en segundos)
        });

        return response;

    } catch (error) {
        console.error("Error al cambiar el estado VIP:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
