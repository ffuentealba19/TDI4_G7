import { NextResponse } from 'next/server';
import User from '@/models/users';
import Operario from '@/models/operarios';
import transporter from '@/utils/GmailRes';
import { run } from "@/libs/mongodb";


export async function POST(req: Request) {
  await run();
  try {
    const { userId, servicio } = await req.json();

    if (!userId || !servicio) {
      return NextResponse.json({ success: false, message: 'Parámetros faltantes' }, { status: 400 });
    }

    // Buscar al usuario en la base de datos
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar si el usuario es VIP
    if (!user.vip) {
      return NextResponse.json({ success: false, message: 'El usuario no tiene acceso a este servicio' }, { status: 403 });
    }

    // Buscar todos los operarios
    const operarios = await Operario.find({});
    if (operarios.length === 0) {
      return NextResponse.json({ success: false, message: 'No hay operarios disponibles' }, { status: 404 });
    }

    // Preparar los detalles del servicio solicitado
    const subject = 'Solicitud de servicio VIP';
    const message = `El usuario VIP ${user.UserName} ha solicitado el siguiente servicio: ${servicio}.`;

    // Enviar un correo a todos los operarios
    try {
      for (const operario of operarios) {
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: operario.OperatorEmail,
          subject: subject,
          text: message,
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Solicitud enviada a los operarios',
      }, { status: 200 });

    } catch (error) {
      console.error('Error al enviar el correo:', error);
      return NextResponse.json({ success: false, message: 'Error al enviar el correo a los operarios' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json({ success: false, message: 'Error en el servidor' }, { status: 500 });
  }
}
