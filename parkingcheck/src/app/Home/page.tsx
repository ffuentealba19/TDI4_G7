"use client";

import { Navbar } from '../components/Navbar';
import ParkingMap from '../components/ParkingMap';
import Popup from '../components/Popup'; // Asegúrate de importar el componente Popup
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Image from 'next/image';

export default function Home() {
    const [isVip, setIsVip] = useState<boolean | null>(null);
    const [showPopup, setShowPopup] = useState<boolean>(false); // Nuevo estado para controlar el popup
    const router = useRouter();

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (!token) {
            router.push('/');
            return;
        }

        const tokenValue = token.split('=')[1];
        try {
            const decodedToken: any = jwt.decode(tokenValue);
            console.log(decodedToken);
            if (decodedToken && decodedToken.vip !== undefined) {
                setIsVip(decodedToken.vip);
                setShowPopup(true); // Mostrar el popup para ambos tipos de usuarios
            }
        } catch (error) {
            console.error("Error al decodificar el token:", error);
        }
    }, [router]);

    const handleClosePopup = () => {
        setShowPopup(false); // Cierra el popup
    };

    return ( 
        <div>
            <Navbar></Navbar>
            {isVip ? (
                <div>
                    vip
                    <ParkingMap isVip={true}/>
                </div>
            ) : (
                <div>
                    no vip
                    <ParkingMap isVip={false}/>
                </div>
            )}

            {showPopup && (
                <Popup onClose={handleClosePopup} title={isVip ? "Bienvenido VIP" : "Bienvenido"}>
                    {isVip ? (
                        <Image 
                        src="/vip.png" 
                        alt="Papelera" 
                        width={1280} 
                        height={720}
                    />
                    ) : (
                        <Image 
                        src="/no-vip.png" 
                        alt="Papelera" 
                        width={1280} 
                        height={720}
                    />
                    )}
                </Popup>
            )}
        </div>
    );
}
