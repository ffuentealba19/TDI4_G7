"use client";

import { useState } from 'react';
import Image from "next/image";
import '/styles/style1.css';

export default function Login() {
    const [showRegisterElements, setShowRegisterElements] = useState(false);

    const showRegisterForm = () => {
        setShowRegisterElements(true);
    };

    const showLoginForm = () => {
        setShowRegisterElements(false);
    };

    const registerData = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
    
        const formData = new FormData(event.currentTarget);
        const data = {
            UserEmail: formData.get('UserEmail'),
            UserName: formData.get('UserName'),
            UserPass: formData.get('UserPass'),
            ConfirmPass: formData.get('ConfirmPass'),
        };

        // Check if passwords match
        if (data.UserPass !== data.ConfirmPass) {
            alert('Passwords do not match');
            return;
        }

        // Send data to the API route
        try {
            const response = await fetch('/api/Register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Registro Exitoso');
            } else {
                console.log(`Error: ${result.error || 'Algo ha salido mal'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al registrar');
        }
    };

    return (
        <div>
            <header className="bg-sky-500 text-white dark:bg-sky-550 lg:text-left">
                <div className="flex items-center justify-between border-b-2 border-sky-200 p-2 dark:border-sky-400">
                    <div className="flex items-center space-x-4 text-3xl font-extrabold">
                        <img src="/Logo_UCT.webp" alt="Avatar" className="w-20 rounded-full" />
                        <p>PARKING CHECK</p>
                    </div>
                </div>
            </header>

            <main className="main"> {/* Centrado en el medio */}
                <div className="logo-container">
                    <Image 
                        src="/Logo_UCT.webp"
                        alt="Logo UCT"
                        width={700}
                        height={700}
                        className="logo-image"
                        style={{ opacity: 0.5 }}
                    />
                </div>
                <div className="container">
                    <div className="button-group">
                        <button onClick={showLoginForm} className={`toggle-button ${!showRegisterElements ? 'active' : ''}`}>Login</button>
                        <button onClick={showRegisterForm} className={`toggle-button ${showRegisterElements ? 'active' : ''}`}>Register</button>
                    </div>

                    {showRegisterElements ? (
                        <div id="RegisterForm" className="form">
                            <h2 className="title">Registro</h2>
                            <form onSubmit={registerData}>
                                <input id="UserEmail" name="UserEmail" type="text" placeholder="Ingrese su email" className="input" required />
                                <input id="UserName" name="UserName" type="text" placeholder="Nombre Completo" className="input" required />
                                <input id="UserPass" name="UserPass" type="password" placeholder="Contraseña" className="input" required />
                                <input id="ConfirmPass" name="ConfirmPass" type="password" placeholder="Repetir Contraseña" className="input" required />
                                <button className="button" type="submit">REGISTRARSE</button>
                            </form>
                        </div>
                    ) : (
                        <div id="LoginForm" className="form">
                            <h2 className="title">Iniciar Sesión</h2>
                            <form>
                                <input id="UserEmail" name="UserEmail" type="text" placeholder="Ingrese su email" className="input" />
                                <input id="UserPass" name="UserPass" type="password" placeholder="Contraseña" className="input" />
                                <a href='/LostmyPassword' className="link">¿Olvidó su contraseña?</a>
                                <button className="button">INICIAR SESIÓN</button>
                            </form>
                            <p>¿No tienes una cuenta? <a href="/Guest" className="link">Sesión de invitado</a></p>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
