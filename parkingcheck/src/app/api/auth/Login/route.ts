// src/app/api/login/route.ts
import { run } from "@/libs/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { messages } from "@/utils/messages";
import User from "@/models/users"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        await run();

        const { UserEmail, UserPass } = await req.json();
        
        if (!UserEmail || !UserPass) {
            return NextResponse.json({
                message: messages.error.needProps,
            }, { status: 400 });
        }

        const UserFind = await User.findOne({ UserEmail });
        if (!UserFind) {
            return NextResponse.json({
                message: messages.error.EmailNotExits,
            }, { status: 400 });
        }

        const isCorrect: boolean = await bcrypt.compare(UserPass, UserFind.UserPass);
        if (!isCorrect) {
            return NextResponse.json({
                message: messages.error.IncorectPass,
            }, { status: 400 });
        }

        const token = jwt.sign(
            { userId: UserFind._id, email: UserFind.UserEmail, userName: UserFind.userName, vip: UserFind.vip },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '8h' }
        );

        // Establecer la cookie
        const response = NextResponse.json({
            message: 'Inicio de sesión exitoso',
<<<<<<< HEAD
            redirectUrl: '/reservar',
=======
            token,
            redirectUrl: '/Home',
>>>>>>> 290c266a9d50090b60373c89e1d5e7ecec404073
        }, { status: 200 });
        
        // Configurar la cookie en la respuesta
        response.cookies.set("token", token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        return response;

    } catch (error) {
        console.error("Error en la operación:", error);
        return NextResponse.json({
            error: messages.error.LoginError,
        }, { status: 500 });
    }
}
