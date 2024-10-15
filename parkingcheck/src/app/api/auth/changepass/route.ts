import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { run } from '@/libs/mongodb';
import User from '@/models/users';


export async function POST(req: NextRequest) {
  const { email, newPassword, confirmPassword } = await req.json();


  if (!email || !newPassword || !confirmPassword) {
    return NextResponse.json({ message: 'Email, nueva contraseña y confirmación de contraseña son requeridos' }, { status: 400 });
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json({ message: 'Las contraseñas no coinciden' }, { status: 400 });
  }

  try {
    await run();  


    const user = await User.findOne({ UserEmail: email });
    
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);


    user.UserPass = hashedPassword;
    await user.save();

    return NextResponse.json({ message: 'Contraseña actualizada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
