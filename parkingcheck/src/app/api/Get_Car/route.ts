import Vehicule2 from "@/models/vehicle copy";
import User2 from "@/models/users copy";
import { run } from "@/libs/mongodb";
import { NextRequest,  NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken"



export async function POST(req:NextRequest ) {
    const id =  "66f077a9ab5ea5a1b85f9a5f"
    const request = await req.json()
    await run()
    const usuario = await User2.findById(id)
    const vehiculos = usuario.Vehiculos
    let i;
    for (i = 0; i < vehiculos.length; i++){
        if (vehiculos[i].Placa == request.placa){
            const response = vehiculos[i]
            return NextResponse.json({
                message: "Vehiculo encontrado",
                vehicle: response,
        })
        }
    }
    return NextResponse.json({
        message: "Vehiculo no encontrado"
    })

}