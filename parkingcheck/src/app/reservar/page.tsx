// app/reservar/page.tsx
"use client";
import { useEffect, useState } from 'react';
import ClientLayout from '../layout-client'; 
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default function UserReservation() {
    const [isVip, setIsVip] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (!token) {
            router.push('/login');
            return;
        }

        const tokenValue = token.split('=')[1];
        try {
            const decodedToken: any = jwt.decode(tokenValue);
            if (decodedToken && decodedToken.vip !== undefined) {
                setIsVip(decodedToken.vip);
            }
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            router.push('/login');
        }
    }, [router]);

    return (
        <ClientLayout>
            {isVip ? (
                <div>
                    <h1>VIP osea sos crack</h1>
                </div>
            ) : (
                <div>
                    <h1>NO VIP ja tonto qlo</h1>
                </div>
            )}
        </ClientLayout>
    );
}
