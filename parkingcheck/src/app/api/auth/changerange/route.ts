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

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { vip: changeToVip },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
        }

        const newToken = jwt.sign(
            {
                userId: updatedUser._id, 
                vip: updatedUser.vip,     
                username: updatedUser.username  
            }, 
            process.env.JWT_SECRET!,  // Asegúrate de tener una clave secreta configurada en tu entorno
            { expiresIn: '30d' }      // El token expira en 30 días
        );
        const response = NextResponse.json({ message: "Estado VIP actualizado", updatedUser }, { status: 200 });
        
        response.cookies.delete('token');
        console.log("token anterior eliminado")

        response.cookies.set('token', newToken, { 
            httpOnly: true,            
            secure: process.env.NODE_ENV === 'production', 
            path: '/',                 
            maxAge: 30 * 24 * 60 * 60   
        });

        return response;

    } catch (error) {
        console.error("Error al cambiar el estado VIP:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
