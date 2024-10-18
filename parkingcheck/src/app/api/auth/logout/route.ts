import { NextResponse } from "next/server";
import { messages } from "@/utils/messages";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const galleta = cookies();

        galleta.set("token", "", { maxAge: -1 });  
        galleta.set("username", "", { maxAge: -1 });  

        const response = NextResponse.json({
            message: 'Cierre de sesión exitoso',
            redirectUrl: '/', 
        }, { status: 200 });

        return response;

    } catch (error) {
        console.error("Error en la operación:", error);
        return NextResponse.json({
            error: messages.error.LogoutError,
        }, { status: 500 });
    }
}
