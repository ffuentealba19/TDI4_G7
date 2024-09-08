"use client";

import { useState } from 'react';

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
            <button onClick={showLoginForm}>Login</button>
            <button onClick={showRegisterForm}>Register</button>

            {showRegisterElements ? (
                <div id="RegisterForm">
                    <form>
                        <input id="Email" type="text" placeholder="Ingrese su email" />
                        <input id="UserName" type="text" placeholder="Nombre Completo" />
                        <input id="PASSWD" type="password" placeholder="Contraseña" />
                        <input id="PASSWD" type="password" placeholder="Repetir Contraseña"/>
                        <button>REGISTRARSE</button>
                    </form>
                </div>
            ) : (
                <div id="LoginForm">
                    <form>
                        <input id="Email" type="text" placeholder="Ingrese su email" />
                        <input id="PASSWD" type="password" placeholder="Contraseña" />
                        <a href='/LostmyPassword'>¿Olvido su contraseña?</a>
                        <button>INICIAR SESIÓN</button>
                    </form>
                    <p>¿No tienes una cuenta? <a href="/Guest">Sesion de invitado</a></p>
                </div>
            )}
        </div>
    );
}
