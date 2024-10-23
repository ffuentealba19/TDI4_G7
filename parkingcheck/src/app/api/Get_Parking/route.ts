import Parking from "@/models/parking";
import { run } from "@/libs/mongodb";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    await run()
    const All_park = await Parking.find({
        status: "enabled"
    })
    const tamano = All_park.length
    let i: number;
    const estacionamiento = []
    for(i=0; i < tamano ; i++)
    {
        estacionamiento.push(All_park[i].section+"-"+All_park[i].number)
    }
    console.log(estacionamiento)
    const estacionamientos= {
        Park: estacionamiento
    }
    console.log(estacionamientos)
    return NextResponse.json({estacionamientos})
}