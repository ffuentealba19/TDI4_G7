import Vehicule2 from "@/models/vehicle copy";
import User2 from "@/models/users copy";
import { run } from "@/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export async function POST(req: NextRequest) {

    const id = "66f639647e3091d2cb0c4a5b"
    await run()
    const nuevo_vehiculo= new Vehicule2(await req.json())

    const usuario = await User2.findById(id)
    const array= []
    array.push(nuevo_vehiculo)
    const data_vehiculo = {
        Vehiculos : array,
    }
    const n_usuario = await User2.findByIdAndUpdate(id, data_vehiculo, {new: true})
    console.log(n_usuario.Vehiculos[0])

    
    return NextResponse.json({
        message: "Hola"
    })
}