import {NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import {run} from '@/libs/mongodb';
import Parking from '@/models/parking';

export async function POST(req : NextRequest) {
    const galleta = cookies();
    const token = galleta.get("token")?.value;
    const secret = process.env.JWT_SECRET;
    const user = verify(token, secret) as {userId : string};
    const id = user.userId;
    const data = await req.formData()
    const park = data.get("Park")
    const Section = park.split("-",1)[0]
    const numero = park.split("-",2)[1]

    await run()
    return NextResponse.json({message: "Estacionamiento reservado"})



}

