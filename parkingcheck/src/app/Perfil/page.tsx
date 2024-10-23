"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import React from 'react';
import { Navbar } from '../components/Navbar';
import Image from 'next/image';
import Popup from '../components/Popup'; 

export default function Perfil() {
    const [UserName, setUserName] = useState('');
    const [UserId, setUserId] = useState('');
    const [isVip, setIsVip] = useState<boolean | null>(null);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [vehiculos, setVehiculos] = useState([]);    
    const router = useRouter();

    const redirectToVehiculo = () => {
        router.push('/Vehiculo');
    };

    const fetchUserInfo = async () => {
        try {
            const response = await fetch('/api/auth/GetInfo', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Error al obtener la información del usuario');
            }

            const data = await response.json();
            console.log(data);
            setUserInfo(data.user);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchVehiculos = async () => {
        try {
            const response = await fetch('/api/Get_Car', { 
                method: 'GET',
                credentials: 'include',
            });
    
            if (!response.ok) {
                throw new Error('Error al obtener vehículos');
            }
    
            const data = await response.json();
            setVehiculos(data.vehicle);
            setShowPopup(true); // Muestra el popup
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
        }
    };
    
    const eliminarVehiculo = async (placa: string) => {
        try {
            const response = await fetch('/api/Delete_Car', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ placa }),
            });

            if (!response.ok) {
                throw new Error('Error al eliminar vehículo');
            }

            const data = await response.json();
            console.log(data.message);

            setVehiculos(vehiculos.filter((vehiculo: any) => vehiculo.Placa !== placa));
        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

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
                if (decodedToken.userId) {
                    setUserId(decodedToken.userId);
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
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/changerange', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: UserId, changeToVip: true })
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
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Sesión cerrada:', data);
                document.cookie = 'token=; Max-Age=0; path=/';
                router.push(data.redirectUrl || '/');
            } else {
                console.error('Error al cerrar sesión:', data.message);
            }
        } catch (error) {
            console.error('Error en la solicitud de cierre de sesión:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="main">
                <div className="container">
                    <h1 className="title">MI PERFIL</h1>
                    <div className='Rounded-img'>
                        {userInfo ? (
                            <img src={userInfo.url} alt="Foto de perfil" className="rounded-full w-full h-full object-cover" />
                        ) : (
                            <p>Cargando imagen de perfil...</p>
                        )}
                    </div>
                    <h2 className='font-bold'>Bienvenido, {UserName}!</h2>
                    {isVip ? (
                        <div className="w-[100%] flex justify-center items-center">
                            <button className="w-[90%] font-bold p-3 text-lg mt-5 border-0 rounded-full cursor-pointer bg-[#EDC557] text-black flex justify-center items-center">
                                <p className="text-center">Usuario VIP+</p>
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={changeVip} className="w-[100%] flex justify-center">
                            <button type="submit" className="w-[90%] font-bold p-3 text-lg mt-5 border-0 rounded-full cursor-pointer bg-[#D9D9D9] text-black flex justify-between items-center">
                                <p>Usuario estándar</p>
                                <span className="text-[#008EBB]">Mejorar subscripción!</span>
                            </button>
                        </form>
                    )}
                    <button className="w-[90%] font-bold p-3 text-lg mt-5 border-0 rounded-full cursor-pointer bg-[#D9D9D9] text-black">
                        <a href="/EditProfile">Editar Perfil</a>
                    </button>
                    
                    <div className="w-[90%] font-bold p-3 text-lg mt-5 border-0 rounded-full cursor-pointer bg-[#D9D9D9] text-black">
                        <button 
                            type="button" 
                            onClick={redirectToVehiculo} 
                            className='relative w-full flex justify-center items-center' 
                        >
                            Agregar vehículo
                        </button>  
                    </div>

                    <button className="w-[90%] font-bold p-3 text-lg mt-5 border-0 rounded-full cursor-pointer bg-[#D9D9D9] text-black" onClick={fetchVehiculos}>
                        Mostrar Vehículos
                    </button>

                    {showPopup && (
                        <Popup onClose={() => setShowPopup(false)} title="Mis Vehículos">
                            {vehiculos.length > 0 ? (
                                <ul>
                                    {vehiculos.map((vehiculo: any) => (
                                        <li key={vehiculo._id}>
                                            <p>Placa: {vehiculo.Placa}</p>
                                            <p>Modelo: {vehiculo.Modelo}</p>
                                            <img src={vehiculo.urlCar} alt={`Vehículo ${vehiculo.Modelo}`} width={100} height={60} />
                                            <button
                                                className="bg-red-500 text-white p-2 rounded mt-2"
                                                onClick={() => eliminarVehiculo(vehiculo.Placa)}
                                            >
                                                Eliminar
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay vehículos asociados.</p>
                            )}
                        </Popup>
                    )}

                    <form onSubmit={Logout} className="flex justify-center w-[90%] font-bold text-lg mt-5 border-0 rounded-full cursor-pointer bg-[#5785A4] text-black">
                        <button type="submit" className="w-[90%] flex justify-center items-center">
                            Cerrar sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
