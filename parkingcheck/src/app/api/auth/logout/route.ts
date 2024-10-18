// src/app/api/logout/route.ts
import { NextResponse } from "next/server";
import { messages } from "@/utils/messages";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const galleta = cookies();

        // Elimina las cookies que se establecieron al iniciar sesión
        galleta.set("token", "", { maxAge: -1 });  // Borra el token
        galleta.set("username", "", { maxAge: -1 });  // Borra el username

        // Envía la respuesta de éxito y redirige a la página de inicio ("/")
        const response = NextResponse.json({
            message: 'Cierre de sesión exitoso',
            redirectUrl: '/',  // Redirige a la página predeterminada
        }, { status: 200 });

        return response;

    } catch (error) {
        console.error("Error en la operación:", error);
        return NextResponse.json({
            error: messages.error.LogoutError,
        }, { status: 500 });
    }
}
