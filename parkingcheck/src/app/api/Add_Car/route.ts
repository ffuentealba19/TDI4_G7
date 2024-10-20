import Vehicule2 from "@/models/vehicle copy";
import User2 from "@/models/users copy";
import { run } from "@/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { v2 as cloudinary } from 'cloudinary';

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.Cloud_name,
    api_key: process.env.Api_key,
    api_secret: process.env.Api_secret
});

export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get("content-type");

        
        if (!contentType || !contentType.includes("multipart/form-data")) {
            return NextResponse.json({ message: "Content-Type must be multipart/form-data" }, { status: 400 });
        }

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

        
        const formData = await req.formData();
        const file = formData.get('file');  

        if (!file) {
            return NextResponse.json({ message: "No image uploaded" }, { status: 410 });
        }

        const bytes = await file.arrayBuffer();
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

        await run();

        
        const nuevo_vehiculo = new Vehicule2({
            ...Object.fromEntries(formData),  
            urlCar: response.secure_url  
        });


        const usuario = await User2.findById(id);
        if (!usuario) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }


        const vehiculosActualizados = usuario.Vehiculos.length > 0 ? [...usuario.Vehiculos, nuevo_vehiculo] : [nuevo_vehiculo];

        const data_vehiculo = {
            Vehiculos: vehiculosActualizados,
        };


        const n_usuario = await User2.findByIdAndUpdate(id, data_vehiculo, { new: true });

        return NextResponse.json({
            message: "Vehículo actualizado con la imagen",
            user: n_usuario,
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: "Error en el servidor", error: error.message }, { status: 500 });
    }
}
