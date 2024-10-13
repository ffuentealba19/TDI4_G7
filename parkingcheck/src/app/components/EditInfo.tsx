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
                                <form action="">
                                    <input type="text" name="NewName" id="NewName" placeholder="Por favor ingrese el nuevo nombre" required/>
                                    <input type="text" name="UserPass" id="UserPass" placeholder="Por favor ingrese la contraseña actual" required/>
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
                                <form action="">
                                    <input type="text" name="NewName" id="NewName" placeholder="Por favor ingrese el nuevo email" required/>
                                    <input type="text" name="UserPass" id="UserPass" placeholder="Por favor ingrese la contraseña actual" required/>
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
                                <form action="">
                                    <input type="text" name="NewName" id="NewName" placeholder="Por favor ingrese la nueva contraseña" required/>
                                    <input type="text" name="UserPass" id="UserPass" placeholder="Por favor ingrese la antigua contraseña" required/>
                                    <button type='submit'>Cambiar</button>
                                </form>
                            </div>
                    )} className="font-bold p-3 text-lg bg-[#e18432] text-white rounded-xl">Cambiar mi contraseña</button>
                        <button onClick={() => openPopup(
                            'Cambiar foto de perfil', 
                            <div>Stand BY</div>
                            )} className="font-bold p-3 text-lg bg-sky-500 text-white rounded-xl">Cambiar mi foto de perfil</button>
                        <button onClick={() => openPopup(
                            'Eliminar cuenta', 
                            <div>
                                <form action="">
                                    <input type="text" name="UserPass" id="UserPass" placeholder="Por favor ingrese la actual contraseña" required/>
                                    <button type="submit">ELIMINAR  </button>
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
