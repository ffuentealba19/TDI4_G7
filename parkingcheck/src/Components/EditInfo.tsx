"use client";
import { useEffect, useState } from "react";
import Popup from './Popup'; 
import { useRouter } from 'next/navigation';

const EditInfo = () => {
    const [userInfo, setUserInfo] = useState<any>(null); // Tipo any para manejar el objeto de usuario
    const [error, setError] = useState<string | null>(null); 
    const [popupContent, setPopupContent] = useState<{ title: string; content: JSX.Element } | null>(null);
    const [token, setToken] = useState<string | null>(null); // Almacenamos el token
    const router = useRouter(); // Usamos el router para redirigir si no hay token

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push('/');
            return;
        }
        setToken(token); // Guardamos el token en el estado

        // Fetch para obtener la información del perfil usando el token
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
                    profileImage: data.profileImage,  
                    Plan: data.Plan,
                    createdAt: data.createdAt
                });
            })
            .catch(err => {
                console.error("Error al obtener el perfil:", err);
                setError("No se pudo cargar el perfil.");
            });
    }, [router]);

    const openPopup = (title: string, content: JSX.Element) => {
        setPopupContent({ title, content });
    };

    const closePopup = () => {
        setPopupContent(null);
    };

    const handleProfilePicture = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newEmail = event.currentTarget.NewEmail.value;
        const userPass = event.currentTarget.UserPass.value;

        if (!token) {
            setError("Token no disponible.");
            return;
        }

        try {
            const response = await fetch('http://localhost:4001/auth/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ NewEmail: newEmail, UserPass: userPass }),
            });

            if (!response.ok) {
                throw new Error('Error al cambiar el email');
            }

            const data = await response.json();
            setUserInfo(data.user); 
            closePopup();
        } catch (err) {
            setError(err.message);
        }
    };


    const handleChangeEmail = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newEmail = event.currentTarget.NewEmail.value;
        const userPass = event.currentTarget.UserPass.value;

        if (!token) {
            setError("Token no disponible.");
            return;
        }

        try {
            const response = await fetch('http://localhost:4001/auth/change-email', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ NewEmail: newEmail, UserPass: userPass }),
            });

            if (!response.ok) {
                throw new Error('Error al cambiar el email');
            }

            const data = await response.json();
            setUserInfo(data.user); 
            closePopup();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newPass = event.currentTarget.NewPass.value;
        const userPass = event.currentTarget.UserPass.value;

        if (!token) {
            setError("Token no disponible.");
            return;
        }

        try {
            const response = await fetch('http://localhost:4001/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ NewPass: newPass, UserPass: userPass }),
            });

            if (!response.ok) {
                throw new Error('Error al cambiar la contraseña');
            }

            closePopup();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteAccount = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userPass = event.currentTarget.UserPass.value; 

        if (!token) {
            setError("Token no disponible.");
            return;
        }

        try {
            const response = await fetch('http://localhost:4001/auth/delete-account', { 
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ UserPass: userPass }), 
            });
    
            if (!response.ok) {
                throw new Error('Error al eliminar la cuenta');
            }
    
            closePopup(); 
            localStorage.removeItem("token");
            router.push('/')
        } catch (err) {
            setError(err.message); 
        }
    };

    return (
        <div className="main-EditProfile">
            <h1 className="font-bold p-3 text-lg">Información del usuario</h1>
            {error && <div className="text-red-500">{error}</div>}
            {userInfo ? (
                <>
                    <div className="Rounded-img">
                        <img src={userInfo.profileImage || '/default-avatar.png'} alt="Foto de perfil" />
                    </div>
                    <div className="Changer-div rounded-xl">
                        <h3 className="font-bold p-3 text-lg">Nombre del usuario</h3>
                        <div className="p-3 text-lg">{userInfo.UserName}</div>
                    </div>
                    <div className="Changer-div rounded-xl">
                        <h3 className="font-bold p-3 text-lg">Email del usuario</h3>
                        <div className="p-3 text-lg">{userInfo.UserEmail}</div>
                        <button onClick={() => openPopup(
                            'Cambiar email', 
                            <div>
                                <form onSubmit={handleChangeEmail}>
                                    <input type="email" name="NewEmail" id="NewEmail" placeholder="Por favor ingrese el nuevo email" required/>
                                    <input type="password" name="UserPass" id="UserPass" placeholder="Por favor ingrese la contraseña actual" required/>
                                    <button type='submit'>Cambiar</button>
                                </form>
                            </div>
                        )} className="font-bold p-3 text-lg bg-sky-500 text-white rounded-xl">Cambiar mi email</button>
                    </div>
                    <div className="Changer-div rounded-xl">
                        <h3 className="font-bold p-3 text-lg">Fecha de creación de la cuenta</h3>
                        <div className="p-3 text-lg">{new Date(userInfo.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="Changer-div rounded-xl">
                        <button onClick={() => openPopup(
                            'Cambiar contraseña', 
                            <div>
                                <form onSubmit={handleChangePassword}>
                                    <input type="password" name="NewPass" id="NewPass" placeholder="Por favor ingrese la nueva contraseña" required/>
                                    <input type="password" name="UserPass" id="UserPass" placeholder="Por favor ingrese la antigua contraseña" required/>
                                    <button type='submit'>Cambiar</button>
                                </form>
                            </div>
                        )} className="font-bold p-3 text-lg bg-sky-500 text-white rounded-xl">Cambiar mi contraseña</button>
                        <button onClick={() => openPopup(
                            'Cambiar foto', 
                            <div>
                                <form onSubmit={handleChangeProfilePicture}>
                                    <input type="file" name="file" id="file" accept="image/*" required/>
                                    <button type="submit" >Subir nueva foto</button>
                                </form>
                            </div>
                        )} className="font-bold p-3 text-lg bg-[#e18432] text-white rounded-xl">Cambiar foto de perfil</button>
                        <button onClick={() => openPopup(
                            'Eliminar cuenta', 
                            <div>
                                <form onSubmit={handleDeleteAccount}>
                                    <input type="password" name="UserPass" id="UserPass" placeholder="Por favor ingrese la contraseña actual" required/>
                                    <button type="submit">ELIMINAR</button>
                                </form>
                            </div>
                        )} className="font-bold p-3 text-lg bg-[#e13232] text-white rounded-xl">Eliminar mi cuenta</button>
                    </div>

                    {popupContent && (
                        <Popup 
                            onClose={closePopup} 
                            title={popupContent.title}
                        >
                            {popupContent.content}
                        </Popup>
                    )}
                </>
            ) : (
                <div>Cargando información del usuario...</div>
            )}
        </div>
    );
};

export default EditInfo;
