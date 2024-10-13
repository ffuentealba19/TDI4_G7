"use client";
import { useEffect, useState } from "react";

const EditInfo = () => {
    const [userInfo, setUserInfo] = useState(null); 
    const [error, setError] = useState(null); 

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
            setUserInfo(data.user); 
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    return (
        <div className="main-EditProfile">
            <h1>Información del usuario</h1>
            
            {/* Muestra el mensaje de error, si existe */}
            {error && <div className="text-red-500">{error}</div>}

            {/* Verifica si hay información del usuario y muéstrala */}
            {userInfo ? (
                <>
                    <div className="Changer-div">
                        <h3>Nombre del usuario</h3>
                        <div className="font-bold p-3 text-lg">{userInfo.username}</div>
                        <button className="font-bold p-3 text-lg bg-sky-500 text-white rounded-xl">Cambiar mi nombre</button>
                    </div>
                    <div className="Changer-div">
                        <h3>Email del usuario</h3>
                        <div className="font-bold p-3 text-lg">{userInfo.email}</div>
                        <button className="font-bold p-3 text-lg bg-sky-500 text-white rounded-xl">Cambiar mi email</button>
                    </div>
                    <div className="Changer-div">
                        <h3>Fecha de creación de la cuenta</h3>
                        <div className="font-bold p-3 text-lg">{new Date(userInfo.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div id="ChangePass" className="Changer-div">
                        <button className="font-bold p-3 text-lg bg-[#e18432] text-white rounded-xl">Cambiar mi contraseña</button>
                        <button className="font-bold p-3 text-lg bg-[#e13232] text-white rounded-xl">Eliminar mi cuenta</button>
                    </div>
                </>
            ) : (
                <div>Cargando información del usuario...</div> // Mensaje mientras se carga la información
            )}
        </div>
    );
};

export default EditInfo;



