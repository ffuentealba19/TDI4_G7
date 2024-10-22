import Vehicule2 from "@/models/vehicle copy";
import User2 from "@/models/users copy";
import { run } from "@/libs/mongodb";
import { NextRequest,  NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken"



export async function GET() {
    const galleta = cookies()
    const token = galleta.get("token")?.value
    const secret = process.env.JWT_Secret
    const usuario = verify(token, secret)
    const id =  "66f077a9ab5ea5a1b85f9a5f"

    await run()
    const usuario = await User2.findById(id)
    const vehiculos = usuario.Vehiculos

    return NextResponse.json({
        message: "Vehiculo no encontrado",
        vehicle: vehiculos
    })

}