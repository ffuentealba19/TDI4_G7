import Vehicule2 from "@/models/vehicle copy";
import User2 from "@/models/users copy";
import { run } from "@/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export async function POST(req: NextRequest) {
    const galleta = cookies();
    const token = galleta.get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET not set in environment variables");
    }


    const user = verify(token, secret) as { userId: string };

    const id = user.userId;
    await run()
    const nuevo_vehiculo= new Vehicule2(await req.json())
    const usuario = await User2.findById(id)
    const array= []
   
    if (usuario.Vehiculos.length > 0){
         let i;
         for (i = 0; i < usuario.Vehiculos.length; i++ ){
            
            array.push(usuario.Vehiculos[i])
         }
    }
    array.push(nuevo_vehiculo)
    console.log(array)
    const data_vehiculo = {
        Vehiculos : array,
    }
    const n_usuario = await User2.findByIdAndUpdate(id, data_vehiculo, {new: true})


    
    return NextResponse.json({
        message: "Hola"
    })
}