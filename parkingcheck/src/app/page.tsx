"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
import '../styles/style1.css';


export default function Login() {
    const [showRegisterElements, setShowRegisterElements] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => setShowMenu(!showMenu);

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

        try {
            const response = await fetch('/api/auth/Register', {
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


    const LoginData = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Evitar el envío del formulario
    
        const formData = new FormData(event.currentTarget);
        const data = {
            UserEmail: formData.get('RegistedEmail'),
            UserPass: formData.get('RegistedPass'),
        };
    
        try {
            const response = await fetch('/api/auth/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                console.log('Éxito:', result);
                window.location.href = '/Home';
            } else {
                console.log(`Error: ${result.message || 'Algo ha salido mal'}`);
                alert(result.message || 'Algo ha salido mal');
            }
    
        } catch (error) {
            console.error('Error:', error);
            alert('Error al iniciar sesión');
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
                    {}
                    <div className="relative menu-container">
                        <button 
                            className="menu-button p-3 rounded-full hover:bg-blue-700" 
                            onClick={() => {
                                console.log("Menu button clicked");
                                toggleMenu();
                            }}
                        >
                            &#9776; {}
                        </button>
                        {showMenu && (
                            <div className="menu-dropdown">
                                <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Mi Perfil</a>
                                <a href="/reservar" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Reservar Estacionamiento</a>
                                <a href="/reporte" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Reporte</a>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="main">
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
                            <form onSubmit={LoginData}>
                                <input id="RegistedEmail" name="RegistedEmail" type="text" placeholder="Ingrese su email" className="input" />
                                <input id="RegistedPass" name="RegistedPass" type="password" placeholder="Contraseña" className="input" />
                                <a href='/LostmyPassword' className="link">¿Olvidó su contraseña?</a>
                                <button type='submit' className="button">INICIAR SESIÓN</button>
                            </form>
                            <p>¿No tienes una cuenta? <a href="/Guest" className="link">Sesión de invitado</a></p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
