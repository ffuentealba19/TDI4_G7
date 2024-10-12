export default function handler(req, res) {
    if (req.method === 'POST') {
        res.status(200).json({ message: 'Sesión cerrada exitosamente', redirectUrl: '/' });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}