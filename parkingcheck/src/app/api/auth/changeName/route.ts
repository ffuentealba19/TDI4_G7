import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/users";
import { run } from '@/libs/mongodb';
import { cookies } from "next/headers";
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const galleta = cookies();
        const token = galleta.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Token no encontrado' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        if (typeof decoded === 'string' || !('userId' in decoded)) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        const { userId } = decoded as { userId: string };
        const { NewName, UserPass } = await req.json();

        await run();


        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }


        const isPasswordValid = await bcrypt.compare(UserPass, user.UserPass);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
        }

        // Actualiza el nombre de usuario
        user.UserName = NewName;
        await user.save();

        return NextResponse.json({ message: 'Nombre actualizado con éxito' });
    } catch (error) {
        console.error('Error en la actualización del nombre:', error); // Para depuración
        return NextResponse.json({ error: 'Algo salió mal' }, { status: 500 });
    }
}
