import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { run } from '@/libs/mongodb';
import Parking from '@/models/parking';

export async function POST(req: NextRequest) {
    try {
        // Obtener el token de las cookies
        const galleta = cookies();
        const token = galleta.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Token missing or invalid" }, { status: 401 });
        }

        // Verificar el token
        const secret = process.env.JWT_SECRET;
        const user = verify(token, secret) as { userId: string };
        const id = user.userId;

        // Obtener los datos del formulario
        const data = await req.formData();
        const park = data.get("Park");

        if (!park) {
            return NextResponse.json({ message: "Park data is missing" }, { status: 400 });
        }

        // Separar sección y número
        const [Section, numero] = park.split("-");
        if (!Section || !numero) {
            return NextResponse.json({ message: "Invalid park format" }, { status: 400 });
        }

        // Establecer el estado de ocupación
        const ocupado = {
            status: 'disabled',
            occupiedBy: id,
        };

        // Conectar a la base de datos
        await run();

        // Registro para depuración
        console.log(`Section: ${Section}, Numero: ${numero}`);

        // Buscar el espacio de estacionamiento
        const est = await Parking.findOne({
            section: Section,
            number: numero,
        });

        if (!est) {
            return NextResponse.json({ message: "Parking spot not found" }, { status: 404 });
        }

        const id_park = est._id;
        const new_park = await Parking.findByIdAndUpdate(id_park, ocupado, { new: true });
        
        console.log(new_park);

        return NextResponse.json({ message: "Estacionamiento reservado", park: new_park });
    } catch (error) {
        console.error("Error reserving parking spot:", error);
        return NextResponse.json({ message: "An error occurred" }, { status: 500 });
    }
}
