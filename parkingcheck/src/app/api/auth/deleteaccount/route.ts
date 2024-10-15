import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { run } from '@/libs/mongodb';
import User from '@/models/users';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {

    const { UserPass } = await req.json();


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


    await run();


    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(UserPass, user.UserPass);
    if (!isMatch) {
      return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 401 });
    }


    await User.deleteOne({ _id: userId });

    return NextResponse.json({ message: 'Cuenta eliminada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar la cuenta:', error); 
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
