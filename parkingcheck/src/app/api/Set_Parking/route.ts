import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { run } from '@/libs/mongodb';
import Parking from '@/models/parking';

export async function POST(req: NextRequest) {
    try {
        const galleta = cookies();
        const token = galleta.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Token missing or invalid" }, { status: 401 });
        }

        const secret = process.env.JWT_SECRET;
        const user = verify(token, secret) as { userId: string };
        const id = user.userId;

        const data = await req.formData();
        const park = data.get("Park");
        if (!park) {
            return NextResponse.json({ message: "Park data is missing" }, { status: 400 });
        }

        const Section = park.split("-", 1)[0];
        const numero = park.split("-", 2)[1];
        if (!Section || !numero) {
            return NextResponse.json({ message: "Invalid park format" }, { status: 400 });
        }

        const ocupado = {
            status: 'disabled',
            occupiedBy: id,
        };

        await run();
        
        // Log Section and numero for debugging
        console.log(`Section: ${Section}, Numero: ${numero}`);
        
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
