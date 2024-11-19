"use client";
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '../../styles/style1.css'; 
import { Navbar } from '../../Components/Navbar'; 

export default function LoginOperators() {
    const [showRegisterElements, setShowRegisterElements] = useState(false);
    const router = useRouter();
    
    const showRegisterForm = () => {
        setShowRegisterElements(true);
    };

    const showLoginForm = () => {
        setShowRegisterElements(false);
    };

    const registerOperator = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = {
            OperatorEmail: formData.get('OperatorEmail'),
            OperatorName: formData.get('OperatorName'),
            OperatorPass: formData.get('OperatorPass'),
            ConfirmPass: formData.get('ConfirmPass'),
        };

        try {
            const response = await fetch('/api/auth/RegisterOperator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Éxito:', result);
                router.push(result.redirectUrl);
            } else {
                console.log(`Error: ${result.message || 'Algo ha salido mal'}`);
                alert(result.message || 'Algo ha salido mal');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al registrar');
        }
    };

    const loginOperator = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = {
            OperatorEmail: formData.get('OperatorEmail'),
            OperatorPass: formData.get('OperatorPass'),
        };

        try {
            const response = await fetch('/api/auth/LoginOperators', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Éxito:', result);
                router.push(result.redirectUrl);
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
            <Navbar /> {}
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
                            <h2 className="title">Registro de Operario</h2>
                            <form onSubmit={registerOperator}>
                                <input id="OperatorEmail" name="OperatorEmail" type="email" placeholder="Ingrese su email" className="input" required />
                                <input id="OperatorName" name="OperatorName" type="text" placeholder="Nombre Completo" className="input" required />
                                <input id="OperatorPass" name="OperatorPass" type="password" placeholder="Contraseña" className="input" required />
                                <input id="ConfirmPass" name="ConfirmPass" type="password" placeholder="Repetir Contraseña" className="input" required />
                                <button className="button" type="submit">REGISTRARSE</button>
                            </form>
                        </div>
                    ) : (
                        <div id="LoginForm" className="form">
                            <h2 className="title">Inicio Sesión de Operario</h2>
                            <form onSubmit={loginOperator}>
                                <input id="OperatorEmail" name="OperatorEmail" type="email" placeholder="Ingrese su email" className="input" />
                                <input id="OperatorPass" name="OperatorPass" type="password" placeholder="Contraseña" className="input" />
                                <a href='/LostmyPassword' className="link">¿Olvidó su contraseña?</a>
                                <button type='submit' className="button">INICIAR SESIÓN</button>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
