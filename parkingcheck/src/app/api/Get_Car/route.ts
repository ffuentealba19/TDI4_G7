import User2 from "@/models/users copy";
import { run } from "@/libs/mongodb";
import { NextRequest,  NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken"



export async function GET() {
    const galleta = cookies()
    const token = galleta.get("token")?.value
    const secret = process.env.JWT_SECRET
    const user = verify(token, secret) as {userId : string}
    const id =  user.userId

    await run()
    const usuario = await User2.findById(id)
    const vehiculos = usuario.Vehiculos

    return NextResponse.json({
        message: "Vehiculos encontrados",
        vehicle: vehiculos
    })

}