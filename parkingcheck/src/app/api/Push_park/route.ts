import Parking from "@/models/parking";
import { NextRequest,NextResponse } from "next/server";
import { run } from "@/libs/mongodb";

export async function POST(req: NextRequest) {

    const request = await req.json()
    await run()
    let i;
    for(i= 0; i < request.length; i++ ){
        const Nuevo_park = new Parking({
            number: request[i].number,
            section: request[i].section,
            status: request[i].status,
            occupiedBy: request[i].occupiedBy,
            
        })
        await Nuevo_park.save()
    }
    return NextResponse.json("Hola")
    
}