"use client";

import { Navbar } from '../components/Navbar';
import ParkingMap from '../components/ParkingMap';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default function Home() {
    const [isVip, setIsVip] = useState<boolean | null>(null);
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
            console.log(decodedToken)
            if (decodedToken && decodedToken.vip !== undefined) {
                setIsVip(decodedToken.vip);
            }
        } catch (error) {
            console.error("Error al decodificar el token:", error);
        }
    }, [router]);

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

        </div>
    );
};
