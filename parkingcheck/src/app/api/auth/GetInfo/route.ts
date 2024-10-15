import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken"; 
import { run } from '@/libs/mongodb';
import User from '@/models/users';
import { cookies } from "next/headers";
import { messages } from "@/utils/messages"; 

export async function GET() {
  try {
    const galleta = cookies();
    const token = galleta.get('token')?.value; 

    // Si no hay token, devolvemos un error
    if (!token) {
      return NextResponse.json({ error: messages.error.tokenNotFound || 'Token no encontrado' }, { status: 401 });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

    
    if (typeof decoded === 'string' || !('userId' in decoded)) {
      return NextResponse.json({ error: messages.error.InvalidToken || 'Token inválido' }, { status: 401 });
    }

    const { userId } = decoded as JwtPayload;  

    
    await run();

   
    const UserFind = await User.findById(userId);

    
    if (!UserFind) {
      return NextResponse.json({ error: messages.error.userNotFound || 'Usuario no encontrado' }, { status: 404 });
    }

    
    return NextResponse.json({ message: messages.success.tokenValid || 'Token válido', user: UserFind });
    
  } catch (err) {
    
    if (err instanceof Error) {
      console.error('Error al verificar el token:', err);

      if (err.name === 'TokenExpiredError') {
        return NextResponse.json({ error: messages.error.tokenExpired || 'Token expirado' }, { status: 401 });
      }

      if (err.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: messages.error.InvalidToken || 'Token inválido' }, { status: 401 });
      }
    }

    
    return NextResponse.json({ error: messages.error.somethingWentWrong || 'Algo salió mal' }, { status: 500 });
  }
}
