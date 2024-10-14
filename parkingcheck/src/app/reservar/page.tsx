// app/reservar/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { Navbar } from '../components/Navbar';

export default function UserReservation() {
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
            router.push('/');
        }
    }, [router]);

    return (
        <div>
            <Navbar/>
            {isVip ? (
                <div>
                    <h1>VIP osea sos crack</h1> {/*Dentro de este div se pone el apartado vip*/}
                </div>
            ) : (
                <div>
                    <h1>NO VIP ja tonto qlo</h1>{/*Dentro de este div se pone el apartado no vip*/}
                </div>
            )}

        </div>
    );
}