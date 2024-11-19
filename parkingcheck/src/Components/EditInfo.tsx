"use client";
import { useEffect, useState } from "react";
import Popup from './Popup';
import { useRouter } from 'next/navigation';

const EditInfo = () => {
    const [userInfo, setUserInfo] = useState<any>(null); 
    const [error, setError] = useState<string | null>(null);
    const [popupContent, setPopupContent] = useState<{ title: string; content: JSX.Element } | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push('/');
            return;
        }
        setToken(token);

        fetch('http://localhost:4001/auth/profile', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar el perfil');
                }
                return response.json();
            })
            .then(data => {
                setUserInfo({
                    UserName: data.UserName,
                    UserEmail: data.UserEmail,
                    profileImage: data.profileImage || '/default-avatar.png',
                    Plan: data.Plan,
                    createdAt: data.createdAt,
                });
            })
            .catch(err => setError(err.message));
    }, [router]);

    const openPopup = (title: string, content: JSX.Element) => {
        setPopupContent({ title, content });
    };

    const closePopup = () => {
        setPopupContent(null);
        setError(null); // Limpiar el error al cerrar el popup
    };

    const handleProfilePicture = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        // Obtener los valores del formulario
        const form = event.currentTarget;
        const image = (form.elements.namedItem('image') as HTMLInputElement)?.files?.[0];
        const userPass = (form.elements.namedItem('UserPass') as HTMLInputElement)?.value;
    
        // Validar que el token, imagen y contraseña estén disponibles
        if (!token) {
            setError("El token no está disponible. Por favor, inicia sesión nuevamente.");
            return;
        }
    
        if (!image) {
            setError("Por favor selecciona una imagen.");
            return;
        }
    
        if (!userPass) {
            setError("Por favor ingresa tu contraseña.");
            return;
        }
    
        try {
            // Crear el objeto FormData con los datos requeridos
            const formData = new FormData();
            formData.append('file', image);
            formData.append('UserPass', userPass);
    
            // Hacer la solicitud al servidor
            const response = await fetch('http://localhost:4001/auth/upload/profile', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
    
            // Manejar errores en la respuesta del servidor
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar la imagen de perfil.');
            }
    
            // Actualizar la imagen de perfil en el estado
            const data = await response.json();
            setUserInfo((prev: any) => ({ ...prev, profileImage: data.user.profileImage }));
    
            closePopup(); // Cerrar el popup si todo salió bien
        } catch (err: any) {
            console.error("Error al actualizar la imagen de perfil:", err);
            setError(err.message || "Error inesperado al actualizar la imagen.");
        }
    };
    

    const handleChangeEmail = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newEmail = (event.currentTarget.NewEmail as HTMLInputElement).value;
        const userPass = (event.currentTarget.UserPass as HTMLInputElement).value;

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

            if (!response.ok) throw new Error('Error al cambiar el email');

            const data = await response.json();
            setUserInfo((prev: any) => ({ ...prev, UserEmail: data.user.UserEmail }));
            closePopup();
        } catch (err: any) {
            setError(err.message || "Error inesperado");
        }
    };

    const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newPass = (event.currentTarget.NewPass as HTMLInputElement).value;
        const userPass = (event.currentTarget.UserPass as HTMLInputElement).value;

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

            if (!response.ok) throw new Error('Error al cambiar la contraseña');
            closePopup();
        } catch (err: any) {
            setError(err.message || "Error inesperado");
        }
    };

    const handleDeleteAccount = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const userPass = (event.currentTarget.UserPass as HTMLInputElement).value;

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

            if (!response.ok) throw new Error('Error al eliminar la cuenta');

            closePopup();
            localStorage.removeItem("token");
            router.push('/');
        } catch (err: any) {
            setError(err.message || "Error inesperado");
        }
    };

    return (
        <div className="main-EditProfile">
            <h1 className="font-bold p-3 text-lg">Información del usuario</h1>
            {error && <div className="text-red-500">{error}</div>}
            {userInfo ? (
                <>
                    <div className="Rounded-img">
                        <img src={userInfo.profileImage} alt="Foto de perfil" />
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
                            <form onSubmit={handleChangeEmail}>
                                <input type="email" name="NewEmail" placeholder="Nuevo email" required />
                                <input type="password" name="UserPass" placeholder="Contraseña actual" required />
                                <button type="submit">Cambiar</button>
                            </form>
                        )} className="font-bold p-3 text-lg bg-sky-500 text-white rounded-xl">Cambiar mi email</button>
                    </div>
                    <div className="Changer-div rounded-xl">
                        <h3 className="font-bold p-3 text-lg">Fecha de creación</h3>
                        <div className="p-3 text-lg">{new Date(userInfo.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="Changer-div rounded-xl">
                        <button onClick={() => openPopup(
                            'Cambiar contraseña',
                            <form onSubmit={handleChangePassword}>
                                <input type="password" name="NewPass" placeholder="Nueva contraseña" required />
                                <input type="password" name="UserPass" placeholder="Contraseña actual" required />
                                <button type="submit">Cambiar</button>
                            </form>
                        )} className="font-bold p-3 text-lg bg-sky-500 text-white rounded-xl">Cambiar mi contraseña</button>
                        <button onClick={() => openPopup(
                            'Cambiar foto',
                            <form onSubmit={handleProfilePicture}>
                                <input type="file" name="image" accept="image/*" required />
                                <input type="password" name="UserPass" placeholder="Contraseña actual" required />
                                <button type="submit">Subir nueva foto</button>
                            </form>
                        )} className="font-bold p-3 text-lg bg-[#e18432] text-white rounded-xl">Cambiar foto de perfil</button>
                        <button onClick={() => openPopup(
                            'Eliminar cuenta',
                            <form onSubmit={handleDeleteAccount}>
                                <input type="password" name="UserPass" placeholder="Contraseña actual" required />
                                <button type="submit">Eliminar cuenta</button>
                            </form>
                        )} className="font-bold p-3 text-lg bg-[#e13232] text-white rounded-xl">Eliminar mi cuenta</button>
                    </div>
                    {popupContent && (
                        <Popup onClose={closePopup} title={popupContent.title}>
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
