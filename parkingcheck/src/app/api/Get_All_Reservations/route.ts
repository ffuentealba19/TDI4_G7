import { NextResponse } from 'next/server';
import Reserva from "@/models/reserva";  // Asegúrate de que el modelo está correctamente importado

// Función que maneja las solicitudes GET
export async function GET() {
    try {
        const reservas = await Reserva.find({ status: 'active' });  // Obtener solo las reservas activas
        return NextResponse.json({ reservas });
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener las reservas', error }, { status: 500 });
    }
}
