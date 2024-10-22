"use client";

import { Navbar } from '../components/Navbar';
import ParkingMap from '../components/ParkingMap';
import Popup from '../components/Popup'; 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Image from 'next/image';

export default function Home() {
    const [status, changeStatus] = useState<String>();
    const [isVip, setIsVip] = useState<boolean | null>(null);
    const [showPopup, setShowPopup] = useState<boolean>(false); 
    const router = useRouter();

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (!token) {
            router.push('/');  // Redirige si no hay token
            return;
        }

        const tokenValue = token.split('=')[1];
        try {
            const decodedToken: any = jwt.decode(tokenValue);
            console.log(decodedToken);

            // Verifica si el token tiene la propiedad "vip"
            if (decodedToken && decodedToken.vip !== undefined) {
                setIsVip(decodedToken.vip);
                setShowPopup(true);  // Muestra el popup basado en VIP
            }
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            router.push('/');  // Redirige si el token es inválido
        }
    }, [router]);

    const handleClosePopup = () => {
        setShowPopup(false);  // Cierra el popup
    };

    // Espera a que se determine si es VIP antes de mostrar el mapa
    if (isVip === null) {
        return <div>Loading...</div>;
    }


    return ( 
        <div>
            <Navbar />
            {isVip ? (
                <div>
                    <h1>Área VIP</h1>
                    <ParkingMap isVip={true}/>
                </div>
            ) : (
                <div>
                    <h1>Área General</h1>
                    <ParkingMap isVip={false}/>
                </div>
            )}
            
            {showPopup && (
                <Popup onClose={handleClosePopup} title={isVip ? "Bienvenido VIP" : "Bienvenido"}>
                    {isVip ? (
                        <Image 
                        src="/vip.png" 
                        alt="VIP Image" 
                        width={1280} 
                        height={720}
                    />
                    ) : (
                        <Image 
                        src="/no-vip.png" 
                        alt="No VIP Image" 
                        width={1280} 
                        height={720}
                    />
                    )}
                </Popup>
            )}
        </div>
    );
}
