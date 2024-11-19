// app/reservar/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/Components/Navbar';

export default function UserReservation() {
    const [isVip, setIsVip] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push('/');
            return;
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