"use client";

import { NavbarOperario } from '../components/NavBarOperario';
import ParkingMap from '../components/ParkingMap';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeOperarios() {
    const [occupiedSpots, setOccupiedSpots] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (!token) {
            router.push('/');
            return;
        }

        // Llamada a la API para obtener los estacionamientos ocupados
        fetch('/api/parking/taken')  // Asegúrate de que esta ruta coincida con tu API
            .then(response => response.json())
            .then(data => {
                const spots = data.map((parking: any) => `${parking.section}-${parking.number}`);
                setOccupiedSpots(spots); // Guardar los IDs de estacionamientos ocupados
            })
            .catch(error => {
                console.error("Error al obtener los estacionamientos ocupados:", error);
            });
    }, [router]);

    return (
        <div>
            <NavbarOperario />
            <div>
                <h2>Estacionamientos Ocupados</h2>
                <ParkingMap occupiedSpots={occupiedSpots} />
            </div>
        </div>
    );
}
