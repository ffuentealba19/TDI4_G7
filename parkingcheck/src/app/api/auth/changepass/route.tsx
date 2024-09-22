import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { run } from '@/libs/mongodb';
import User from '@/models/users';

// Manejar el método POST
export async function POST(req: NextRequest) {
  const { email, newPassword, confirmPassword } = await req.json();

  // Verificar que los datos sean correctos
  if (!email || !newPassword || !confirmPassword) {
    return NextResponse.json({ message: 'Email, nueva contraseña y confirmación de contraseña son requeridos' }, { status: 400 });
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json({ message: 'Las contraseñas no coinciden' }, { status: 400 });
  }

  try {
    await run();  // Conectar a MongoDB

    // Encontrar al usuario por su correo
    const user = await User.findOne({ UserEmail: email });
    
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña del usuario
    user.UserPass = hashedPassword;
    await user.save();

    return NextResponse.json({ message: 'Contraseña actualizada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
