"use client";
import ClientLayout from '../layout-client';
import '../../styles/style1.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default function Upload() {
    const [UserName, setUserName] = useState('');
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
            const decodedToken = jwt.decode(tokenValue);
            console.log("Token Decodificado:", decodedToken); 
            
            if (decodedToken && typeof decodedToken === 'object') {
                if (decodedToken.username) {
                    setUserName(decodedToken.username);
                } else {
                    console.warn("UserName no encontrado en el token.");
                }
                if (decodedToken.vip !== undefined) {
                    setIsVip(decodedToken.vip);
                }
            } else {
                console.warn("El token decodificado no es un objeto válido.");
            }
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            router.push('/');
        }
    }, [router]);
    
    const changeVip = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Previene que el formulario se envíe por defecto
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            const tokenValue = token ? token.split('=')[1] : null;
    
            if (!tokenValue) {
                console.error("No se encontró el token");
                return;
            }
    
            const response = await fetch('/api/changerange', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({changeToVip: true })
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log('Estado VIP cambiado:', data);
                setIsVip(true);
            } else {
                console.error('Error al cambiar el estado VIP:', data.message);
            }
        } catch (error) {
            console.error('Error en la solicitud de cambio de VIP:', error);
        }
    };
    

    const Logout = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if(response.ok){
                console.log('Sesión cerrada:', data);
                document.cookie = 'token=; Max-Age=0';
                router.push(data.redirectUrl || '/');
            } else {
                console.error('Error al cerrar sesión:', data.message);
            }
        } catch (error) {
            console.error('Error en la solicitud de cierre de sesión:', error);
        }
    };

    return (
        <ClientLayout>
            <div className="main">
                <div className="container">
                    <h1 className="title">MI PERFIL</h1>
                    <h2 className='font-bold'>Bienvenido, {UserName}!</h2>
                    {isVip ? (
                        <div>
                        <form onSubmit={changeVip}>
                            <button type="submit" 
                            className="w-[90%] font-bold p-3 text-lg mt-5 border-0 rounded-full cursor-pointer bg-[#EDC557] text-black flex justify-between items-center"
                            >
                            <p>Usuario VIP+</p>
                            <span className="text-[#008EBB]">Mejorar subscripción!</span>
                            </button>
                        </form> 
                        </div>
                    ) : (
                        <button className="w-[90%] font-bold p-3 text-lg mt-5 border-0 rounded-full cursor-pointer bg-[#D9D9D9] text-black flex justify-between items-center">
                            <p>Usuario estándar</p>
                            <span className="text-[#008EBB]">Mejorar subscripción!</span>
                        </button>
                    )}
                    <button className="w-[90%] font-bold p-3 text-lg mt-5 border-0 rounded-full cursor-pointer bg-[#D9D9D9] text-black">
                        Editar Perfil
                    </button>
                    <form onSubmit={Logout} className="flex justify-center w-[90%] font-bold text-lg mt-5 border-0 rounded-full cursor-pointer bg-[#5785A4] text-blacks">
                        <button type="submit" className="w-[90%] font-bold p-3 text-lg bg-[#5785A4] text-black">
                            <span className="text-[#D9D9D9]">Cerrar sesión</span>
                        </button>
                    </form> 
                </div>
            </div>
        </ClientLayout>
    );
}
