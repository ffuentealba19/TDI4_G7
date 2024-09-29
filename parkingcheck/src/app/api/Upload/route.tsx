import { NextRequest, NextResponse } from "next/server";
import {v2 as cloudinary} from 'cloudinary';
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import {run} from '@/libs/mongodb'
import User from '@/models/users'
cloudinary.config({ 
    cloud_name: 'dhlfth3i0', 
    api_key: '191465743562129', 
    api_secret: 'NWAlM-GCDJiRviWGwz9K83Eemrw' 
});

export async function POST(req: NextRequest ){

    const data = await req.formData();

    const arc = data.get('file');

    if (!arc){
        return NextResponse.json("No image uploaded",{status: 410})
    }

    const bytes = await arc.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const response = await new Promise((resolve, reject)=>{
        cloudinary.uploader.upload_stream({},(err, result) =>{
            if (err) {
                reject(err)
            }
            resolve(result)
        }).end(buffer)
    })
    console.log(response)
    const galleta = cookies()
    const token = String(galleta.get("token")?.value)
    const secret = String(process.env.JWT_SECRET) 
    const user =  verify(token, secret )
    const id= String(user.userId)
    const dataurl = {
        "url": response.secure_url,
    }
    await run()
    const usuario = await User.findByIdAndUpdate(id, dataurl, {
        new: true
    })
    console.log(usuario)
    
    return NextResponse.json({
        message: "Imagen subida",
    });
}