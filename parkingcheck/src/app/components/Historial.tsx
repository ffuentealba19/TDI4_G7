"use client";
import { useEffect, useState } from "react";

const Historial = () => {
    const [reservas, setReservas] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const response = await fetch('/api/Historial_reservas'); 
                if (!response.ok) {
                    throw new Error('Error al obtener las reservas');
                }
                const data = await response.json();
                setReservas(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchReservas();
    }, []);

    return (
        <div>
            <h1>Historial de Reservas</h1>
            {error && <p>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>ID Reserva</th>
                        <th>Sección</th>
                        <th>Número</th>
                        <th>Fecha Reserva</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.length > 0 ? (
                        reservas.map((reserva) => (
                            <tr key={reserva._id}>
                                <td>{reserva._id}</td>
                                <td>{reserva.seccion}</td>
                                <td>{reserva.numero}</td>
                                <td>{new Date(reserva.fechaReserva).toLocaleString()}</td>
                                <td>{reserva.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay reservas disponibles.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Historial;
