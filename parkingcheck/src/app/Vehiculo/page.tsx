"use client";

import AddCar from "@/Components/addcar";
import ListaAuto from "@/Components/ListaCar";
import { Navbar } from "@/Components/Navbar";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Vehicule() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        // Verificar el token solo después de que el componente se haya montado en el cliente
        const token = localStorage.getItem("token");
        if (!token) {
            router.push('/'); // Redirige a la página principal si no hay token
        } else {
            setIsAuthenticated(true); // Si hay token, se considera autenticado
        }
    }, [router]);

    // Mientras se verifica la autenticación, podemos mostrar un loading o un estado por defecto
    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <ListaAuto />
            <AddCar />
        </div>
    );
}
