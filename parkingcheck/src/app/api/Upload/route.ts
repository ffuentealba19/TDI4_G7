import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { run } from '@/libs/mongodb';
import User from '@/models/users';

cloudinary.config({
    cloud_name: process.env.Cloud_name,
    api_key: process.env.Api_key,
    api_secret: process.env.Api_secret
});

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const arc = data.get('file');

        if (!arc) {
            return NextResponse.json({ message: "No image uploaded" }, { status: 410 });
        }

        const bytes = await arc.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const response = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({}, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }).end(buffer);
        });

        console.log(response);

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
        const dataurl = {
            url: response.secure_url,
        };


        await run();
        const usuario = await User.findByIdAndUpdate(id, dataurl, { new: true });

        if (!usuario) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        console.log(usuario);

        return NextResponse.json({
            message: "Imagen subida",
            user: usuario,
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: "Error en el servidor", error: error.message }, { status: 500 });
    }
}
