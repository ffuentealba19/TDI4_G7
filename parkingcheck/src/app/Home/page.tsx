"use client";

import { Navbar } from '@/Components/Navbar';
import ParkingMap from '@/Components/ParkingMap';
import Popup from '@/Components/Popup'; 
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
        const token = localStorage.getItem("token");
        console.log("token Home", token);
        if (!token) {
            router.push('/');  
            return;
        }

    }, [router]);

    const handleClosePopup = () => {
        setShowPopup(false);  // Cierra el popup
    };


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