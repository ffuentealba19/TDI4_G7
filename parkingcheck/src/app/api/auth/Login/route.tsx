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
            { userId: UserFind._id, email: UserFind.UserEmail },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '8h' }
        );
        const galleta = cookies()
        galleta.set("token",token)
        return NextResponse.json({
            message: 'Inicio de sesión exitoso',
            token,
        }, { status: 200 });

    } catch (error) {
        console.error("Error en la operación:", error);
        return NextResponse.json({
            error: messages.error.LoginError,
        }, { status: 500 });
    }
}
