"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import React from 'react';
import { Navbar } from '@/Components/Navbar';
import Image from 'next/image';
import Popup from '@/Components/Popup';

export default function Perfil() {
    const [UserName, setUserName] = useState('');
    const [UserId, setUserId] = useState('');
    const [isVip, setIsVip] = useState<boolean | null>(null);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const decodedToken = jwt.decode(token);
            console.log("Token Decodificado:", decodedToken);

            if (decodedToken && typeof decodedToken === 'object') {
                setUserName(decodedToken.username || '');
                setIsVip(decodedToken.vip || false);
                setUserId(decodedToken.userId || '');
            } else {
                console.warn("El token decodificado no es un objeto válido.");
            }

            fetch('http://localhost:4001/auth/profile', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => response.json())
                .then(data => {
                    setUserInfo({
                        UserName: data.UserName,
                        UserEmail: data.UserEmail,
                        profileImage: data.profileImage , 
                        Plan: data.Plan || 'Basico', 
                    });
                })
                .catch(err => {
                    console.error("Error al obtener el perfil:", err);
                    setError("No se pudo cargar el perfil.");
                });

        } catch (error) {
            console.error("Error al decodificar el token:", error);
            router.push('/');
        }
    }, [router]);

    const handleLogout = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        localStorage.removeItem("token");
        router.push('/');
    };

    return (
        <div>
            <Navbar />
            <div className="main">
                <div className="container">
                    <h1 className="title">MI PERFIL</h1>
                    <div className="Rounded-img">
                        {userInfo ? (
                            <img 
                                src={userInfo.profileImage} 
                                alt="Foto de perfil" 
                                className="rounded-full w-full h-full object-cover" 
                            />
                        ) : (
                            <p>Cargando imagen de perfil...</p>
                        )}
                    </div>
                    <h2 className="font-bold">Bienvenido, {userInfo?.UserName || 'Cargando...'}</h2>
                    <button className="w-[90%] font-bold p-3 text-lg mt-5 border-0 rounded-full cursor-pointer bg-[#D9D9D9] text-black">
                        <a href="/EditProfile">Editar Perfil</a>
                    </button>
                    <form onSubmit={handleLogout} className="flex justify-center w-[90%] font-bold text-lg mt-5 border-0 rounded-full cursor-pointer bg-[#5785A4] text-black">
                        <button type="submit" className="w-[90%] flex justify-center items-center">
                            Cerrar sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
