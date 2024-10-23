import { NextApiRequest, NextApiResponse } from 'next';
import Reserva from '@/models/reserva';
import Parking from '@/models/parking';
import User from '@/models/users';
import Operario from '@/models/operarios';
import Notificacion from '@/models/notificaciones';
import transporter from '@/utils/GmailRes';
import { run } from "@/libs/mongodb";

export async function POST(req: Request) {
  
  const { parkingId, userId, fechaReserva, seccion, numero } = await req.json();
  // Establecer conexión con la base de datos
  await run();

  

  if (!parkingId || !userId || !fechaReserva || !seccion || !numero) {
    return new Response(JSON.stringify({ success: false, message: 'Parámetros faltantes' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // Buscar al usuario por el ID proporcionado
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'Usuario no encontrado' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Buscar el estacionamiento por el ID proporcionado
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

    // Enviar el correo de confirmación al usuario
    const subjectUser = 'Confirmación de Reserva de Estacionamiento';
    const messageUser = `Estimado usuario ${user.UserName},\n\nTu reserva para el estacionamiento en la sección ${seccion}, número ${numero}, ha sido confirmada para la fecha ${fechaReservaUsuario}.\n\nLa reserva vencerá a las ${fechaVencimiento.toLocaleString()} si no llegas al lugar.\n\nSaludos,\nEquipo de Estacionamientos.`;

    try {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: user.UserEmail,
        subject: subjectUser,
        text: messageUser,
      });
    } catch (error) {
      console.error('Error al enviar el correo al usuario:', error);
    }

    const notificacionUsuario = new Notificacion({
      user: userId, // ID del usuario que recibe la notificación
      tipo: 'Reserva', // Tipo de notificación
      mensaje: `Reserva para el estacionamiento en la sección ${seccion}, número ${numero}.`, // Mensaje de la notificación
      fechaEnvio: new Date(), // Fecha y hora de envío
      nombreUsuario: user.UserName, // Nombre del usuario (debes asegurarte de obtener el nombre del usuario)
      horaReserva: fechaReservaUsuario, // Hora de la reserva (debes obtenerla al crear la reserva)
      estadoReserva: nuevaReserva.status, // Estado de la reserva
      detallesReserva: { // Detalles de la reserva
        seccion: seccion,
        numero: numero,
      },
      fechaExpiracion: fechaVencimiento, // Fecha de expiración de la reserva
    });
    
    // Guardar la notificación en la base de datos
    await notificacionUsuario.save();
    

    // Buscar a los operarios
    const operarios = await Operario.find(); // Suponiendo que se quiere notificar a todos los operarios abierto a cambios :)
    if (operarios && operarios.length > 0) {
      const subjectOperario = 'Nueva Reserva Creada';
      const messageOperario = `Estimado Operario,\n\nEl usuario ${user.UserName} ha creado una reserva en la sección ${seccion}, número ${numero}, a la hora ${fechaReservaUsuario}.\n\nSaludos,\nSistema de Estacionamientos.`;

      for (const operario of operarios) {
        try {
          await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: operario.OperatorEmail,
            subject: subjectOperario,
            text: messageOperario,
          });

          // Guardar la notificación para cada operario
          // en una coleccion para operarios operario 

          //const notificacionOperario = new Notificacion({
          //  user: operario._id,
          //  tipo: 'Alerta Operario',
          //  mensaje: `El usuario ${user.UserName} ha creado una reserva en la sección ${seccion}, número ${numero}.`,
          //  fechaEnvio: new Date(),
          //});
          //await notificacionOperario.save();

        } catch (error) {
          console.error(`Error al enviar el correo al operario ${operario.OperatorName}:`, error);
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Reserva creada, correos y notificaciones enviadas correctamente',
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
