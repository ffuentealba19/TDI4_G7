import {  NextResponse } from "next/server";
import User from '@/models/users';
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import {run} from '@/libs/mongodb'
export async function GET() {

    await run()
    const galleta = cookies()
    const token = String(galleta.get("token")?.value)
    const secret = String(process.env.JWT_SECRET) 
    const user =  verify(token, secret )
    const id = String(user.userId)
    const usuario = await User.findById(id)
    const url = usuario.url
    
    return NextResponse.json({
        ImgUrl: url,
    });   
}