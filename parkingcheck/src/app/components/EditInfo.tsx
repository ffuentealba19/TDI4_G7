"use client";
import { useEffect, useState } from "react";
import Popup from './Popup'; 

const EditInfo = () => {
    const [userInfo, setUserInfo] = useState(null); 
    const [error, setError] = useState(null); 
    const [popupContent, setPopupContent] = useState<{ title: string; content: JSX.Element } | null>(null);

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

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const openPopup = (title: string, content: JSX.Element) => {
        setPopupContent({ title, content });
    };

    const closePopup = () => {
        setPopupContent(null);
    };

    const handleChangeName = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newName = event.currentTarget.NewName.value;
        const userPass = event.currentTarget.UserPass.value;

        try {
            const response = await fetch('/api/auth/changeName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ NewName: newName, UserPass: userPass }),
            });

            if (!response.ok) {
                throw new Error('Error al cambiar el nombre');
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

        try {
            const response = await fetch('/api/auth/changeEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

        try {
            const response = await fetch('/api/auth/changeMypass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
    
        try {
            const response = await fetch('/api/auth/deleteAccount', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ UserPass: userPass }), 
            });
    
            if (!response.ok) {
                throw new Error('Error al eliminar la cuenta');
            }
    
            closePopup(); 
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
                        <img src={userInfo.url} alt="Foto de perfil" />
                    </div>
                    <div className="Changer-div rounded-xl">
                        <h3 className="font-bold p-3 text-lg">Nombre del usuario</h3>
                        <div className="p-3 text-lg">{userInfo.UserName}</div>
                        <button onClick={() => openPopup(
                            'Cambiar nombre',
                             <div>
                                <form onSubmit={handleChangeName}>
                                    <input type="text" name="NewName" id="NewName" placeholder="Por favor ingrese el nuevo nombre" required/>
                                    <input type="password" name="UserPass" id="UserPass" placeholder="Por favor ingrese la contraseña actual" required/>
                                    <button type='submit'>Cambiar</button>
                                </form>
                             </div>
                            )} className="font-bold p-3 text-lg bg-sky-500 text-white rounded-xl">Cambiar mi nombre</button>
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
                                STANDBY
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
