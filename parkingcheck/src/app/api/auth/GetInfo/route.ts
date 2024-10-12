import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { run } from '@/libs/mongodb';
import User from '@/models/users';  


async function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return { error: "Token no proporcionado", status: 401 };
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return { error: "Token no válido", status: 401 };
  }

 
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return { error: "Falta la clave secreta para verificar el token", status: 500 };
  }

  try {
    const decoded = jwt.verify(token, secret);  
    return { decoded };
  } catch (error) {
    return { error: "Token inválido o expirado", status: 401 };
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Verificar el token JWT
    const tokenVerification = await verifyToken(req);
    if (tokenVerification.error) {
      return NextResponse.json({ error: tokenVerification.error }, { status: tokenVerification.status });
    }

    const userId = tokenVerification.decoded.id; 

    // Conectar a MongoDB
    await run();


    const user = await User.findById(userId).select("-UserPass"); 

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }


    const userData = {
      nombre: user.UserName,
      correo: user.UserEmail,
      vehiculos: user.Vehiculos?.map(vehiculo => ({
        placa: vehiculo.Placa,
        modelo: vehiculo.Modelo
      })),
      url: user.url,
    };


    return NextResponse.json({
      success: true,
      message: "Datos del usuario obtenidos correctamente",
      data: userData
    });

  } catch (error) {
    console.error("Error en la solicitud:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
