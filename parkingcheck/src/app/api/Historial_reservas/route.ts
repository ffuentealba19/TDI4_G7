import { NextResponse } from "next/server";
import Reserva from "@/models/reserva";
import { run } from "@/libs/mongodb";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export async function GET() {
    try {
        const galleta = cookies();
        const token = galleta.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const secret = process.env.JWT_SECRET;
        const user = verify(token, secret) as { userId: string };
        const id = user.userId;

        await run();
        const reservas = await Reserva.find({ id_usuario: id });

        return NextResponse.json(reservas);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
