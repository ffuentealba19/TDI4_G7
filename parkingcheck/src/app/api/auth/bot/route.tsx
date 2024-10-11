import { NextApiRequest, NextApiResponse } from 'next';
import transporter from '@/utils/GmailRes';

export async function POST(req: Request) {
    const { email, subject, message } = await req.json();

    // Validación de entradas
    if (!email || !subject || !message) {
        return new Response(JSON.stringify({ success: false, message: 'Por favor, proporciona un correo, asunto y mensaje.' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: subject,
            text: message,
        });
        return new Response(JSON.stringify({ success: true, message: 'Correo enviado correctamente.' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return new Response(JSON.stringify({ success: false, message: 'Error al enviar el correo. Inténtalo de nuevo más tarde.' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
