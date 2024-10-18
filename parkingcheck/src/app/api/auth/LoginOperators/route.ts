import { run } from "@/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Operario from "@/models/operarios"; // Cambiado a Operarios
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        await run();

        const { OperatorEmail, OperatorPass } = await req.json();

        if (!OperatorEmail || !OperatorPass) {
            return NextResponse.json({
                message: 'Faltan campos',
            }, { status: 400 });
        }

        const OperarioFind = await Operario.findOne({ OperatorEmail });
        if (!OperarioFind) {
            return NextResponse.json({
                message: 'Correo no registrado',
            }, { status: 400 });
        }

        const isCorrect = await bcrypt.compare(OperatorPass, OperarioFind.OperatorPass);
        if (!isCorrect) {
            return NextResponse.json({
                message: 'Contraseña incorrecta',
            }, { status: 400 });
        }

        const token = jwt.sign(
            { operarioId: OperarioFind._id, email: OperarioFind.OperatorEmail },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '8h' }
        );

        const galleta = cookies();
        galleta.set("token", token);
        galleta.set("username", OperarioFind.OperatorName);

        return NextResponse.json({
            message: 'Inicio de sesión exitoso',
            token,
            redirectUrl: '/HomeOperators',
        }, { status: 200 });

    } catch (error) {
        console.error("Error en el login:", error);
        return NextResponse.json({
            message: 'Error al iniciar sesión',
        }, { status: 500 });
    }
}
