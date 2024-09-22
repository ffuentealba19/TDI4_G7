"use client";
import { useState } from 'react';
import ClientLayout from './layout-client';
import '../styles/style1.css';

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

    const loginData = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

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
        <ClientLayout>
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
                        <form onSubmit={loginData}>
                            <input id="RegistedEmail" name="RegistedEmail" type="text" placeholder="Ingrese su email" className="input" />
                            <input id="RegistedPass" name="RegistedPass" type="password" placeholder="Contraseña" className="input" />
                            <a href='/LostmyPassword' className="link">¿Olvidó su contraseña?</a>
                            <button type='submit' className="button">INICIAR SESIÓN</button>
                        </form>
                        <p>¿No tienes una cuenta? <a href="/Guest" className="link">Sesión de invitado</a></p>
                    </div>
                )}
            </div>
        </ClientLayout>    
    );
}
