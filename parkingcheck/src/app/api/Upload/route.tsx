import { NextRequest, NextResponse } from "next/server";
import {v2 as cloudinary} from 'cloudinary';
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

    return NextResponse.json({
        message: "Imagen subida", 
        url: response.secure_url
    });
}