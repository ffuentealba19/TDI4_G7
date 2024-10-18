import { run } from "@/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { messages } from "@/utils/messages";
import { isValidEmail } from "@/utils/isValidEmail";
import Operario from "@/models/operarios"; // Cambiar el modelo a Operarios
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await run();

    const { OperatorName, OperatorEmail, OperatorPass, ConfirmPass } = await req.json();

    // Verificar que todos los campos requeridos estén presentes
    if (!OperatorName || !OperatorEmail || !OperatorPass || !ConfirmPass) {
      return NextResponse.json({
        message: messages.error.needProps,
      }, { status: 400 });
    }

    // Validar el formato del email
    if (!isValidEmail(OperatorEmail)) {
      return NextResponse.json({
        message: messages.error.InvalidEmail,
      }, { status: 400 });
    }

    // Verificar que las contraseñas coincidan
    if (OperatorPass !== ConfirmPass) {
      return NextResponse.json({
        message: messages.error.PassNotMatch,
      }, { status: 400 });
    }

    // Verificar si el operador ya existe
    const OperarioFind = await Operario.findOne({ OperatorEmail });
    if (OperarioFind) {
      return NextResponse.json({
        message: messages.error.EmailExits,
      }, { status: 400 });
    }

    // Hashear la contraseña del operador
    const HashedPass = await bcrypt.hash(OperatorPass, 10);

    // Crear un nuevo operario y guardarlo en la base de datos
    const newOperario = new Operario({
      OperatorName,
      OperatorEmail,
      OperatorPass: HashedPass,
      profilePic: "https://res.cloudinary.com/dhlfth3i0/image/upload/v1727491033/i6sxdq4xgfkti4hnidot.jpg",
      role: "operario", // Añadido el rol por si es necesario en el sistema
    });
    await newOperario.save();

    // Generar el token JWT
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET no está configurado en las variables de entorno');
    }

    const token = jwt.sign(
      { operarioId: newOperario._id, email: newOperario.OperatorEmail },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Devolver la respuesta exitosa
    return NextResponse.json({
      message: 'Registro exitoso de operario',
      token,
      redirectUrl: '/loginOperators', // Puedes ajustar la URL de redirección según sea necesario
    }, { status: 200 });

  } catch (error) {
    console.error("Error en la operación:", error);
    return NextResponse.json({
      error: messages.error.RegisterError,
    }, { status: 500 });
  }
}
