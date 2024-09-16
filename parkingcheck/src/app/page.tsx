"use client";

import { useState } from 'react';
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
        <div className="container">
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
    );
}
