import User2 from "@/models/users copy";
import { run } from "@/libs/mongodb";
import { NextRequest,  NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken"



export async function POST(req: NextRequest) {
    const galleta = cookies()
    const token = galleta.get("token")?.value
    const secret = process.env.JWT_SECRET
    const user = verify(token, secret) as {userId : string}    
    const request = await req.json()
    const id =  user.userId
    await run()
    const usuario = await User2.findById(id)
    const vehiculos = usuario.Vehiculos
    const array = []
    let i;
    for( i= 0; i < vehiculos.length; i++){
        if (vehiculos[i].Placa != request.placa){
            array.push(vehiculos[i])
        }
    }
    const new_vehicles = await User2.findByIdAndUpdate(id, {
        Vehiculos: array
    }, {new: true})
    console.log(new_vehicles)

    return NextResponse.json({
        message: "Vehiculos eliminado",
    })

}