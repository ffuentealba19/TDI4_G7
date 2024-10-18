import { NextApiRequest, NextApiResponse } from 'next';
import Reserva from '@/models/reserva';
import Parking from '@/models/parking';
import User from '@/models/users';
import transporter from '@/utils/GmailRes';
import { run } from "@/libs/mongodb";

export async function POST(req: Request) {
  // Establecer conexión con la base de datos
  await run();

  const { parkingId, userId, fechaReserva, seccion, numero } = await req.json();

  if (!parkingId || !userId || !fechaReserva || !seccion || !numero) {
    return new Response(JSON.stringify({ success: false, message: 'Parámetros faltantes' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {


    // busca el usuario por el id que se le proporciona :)
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'Usuario no encontrado' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }


    // busca el estacionamiento por el id que se le proporciona y verifica si este esta disponible :)
    const parkingSpot = await Parking.findById(parkingId);

    if (!parkingSpot || parkingSpot.status !== 'enabled') {
      return new Response(JSON.stringify({ success: false, message: 'El estacionamiento no está disponible' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const fechaReservaUsuario = new Date(fechaReserva);
    const fechaVencimiento = new Date(fechaReservaUsuario.getTime() + 60 * 60 * 1000); // 1 hora después

    const nuevaReserva = new Reserva({
      seccion: seccion,
      numero: numero,
      id_usuario: userId,
      fechaReserva: fechaReservaUsuario,
      fechaExpiracion: fechaVencimiento,
      status: 'active',
    });

    await nuevaReserva.save();

    parkingSpot.status = 'disabled';
    await parkingSpot.save();

    // Enviar el correo de confirmación
    const subject = 'Confirmación de Reserva de Estacionamiento';
    const message = `Estimado usuario ${user.UserName},\n\nTu reserva para el estacionamiento en la sección ${seccion}, número ${numero}, ha sido confirmada para la fecha ${fechaReservaUsuario.toLocaleString()}.\n\nLa reserva vencerá a las ${fechaVencimiento.toLocaleString()} si no llegas al lugar.\n\nSaludos,\nEquipo de Estacionamientos.`;

    try {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: user.UserEmail,
        subject: subject,
        text: message,
      });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Reserva creada y correo enviado correctamente',
      reserva: nuevaReserva,
      parkingSpot,
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error al crear la reserva:', error);
    return new Response(JSON.stringify({ success: false, message: 'Error al crear la reserva' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
