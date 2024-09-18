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

            <main className="flex min-h-screen flex-col items-center justify-between p-16">
                <div className="container">
                    <div className="logo-container">
                        <Image 
                            src="/Logo_UCT.webp"
                            alt="Logo UCT"
                            width={150}
                            height={150}
                            className="logo-image"
                            style={{ opacity: 0.5 }}
                        />
                    </div>
                    <div className="button-group">
                        <button onClick={showLoginForm} className={`toggle-button ${!showRegisterElements ? 'active' : ''}`}>Login</button>
                        <button onClick={showRegisterForm} className={`toggle-button ${showRegisterElements ? 'active' : ''}`}>Register</button>
                    </div>

                    {showRegisterElements ? (
                        <div id="RegisterForm" className="form">
                            <h2 className="title">Registro</h2>
                            <form>
                                <input id="Email" type="text" placeholder="Ingrese su email" className="input" />
                                <input id="UserName" type="text" placeholder="Nombre Completo" className="input" />
                                <input id="PASSWD" type="password" placeholder="Contraseña" className="input" />
                                <input id="ConfirmPASSWD" type="password" placeholder="Repetir Contraseña" className="input" />
                                <button className="button">REGISTRARSE</button>
                            </form>
                        </div>
                    ) : (
                        <div id="LoginForm" className="form">
                            <h2 className="title">Iniciar Sesión</h2>
                            <form>
                                <input id="Email" type="text" placeholder="Ingrese su email" className="input" />
                                <input id="PASSWD" type="password" placeholder="Contraseña" className="input" />
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
