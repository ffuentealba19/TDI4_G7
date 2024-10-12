"use client"; 
import '../../styles/style1.css';
<<<<<<< HEAD
import Image from 'next/image';

export default function LostmyPassword() {
    return ( 
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
            <div className="flex items-center justify-center h-screen">
                <div id="RegisterForm"className="container">
                <h1 className="title">¿Olvidaste tu contraseña?</h1>
=======
import { Navbar } from '../components/Navbar';

export default function LostmyPassword() {
    return (
        <div>
            <Navbar/>
            <div className="main">
                <div className="container">
                    <h1 className="title">¿Olvidaste tu contraseña?</h1>
>>>>>>> 290c266a9d50090b60373c89e1d5e7ecec404073
                    <p>Aquí puedes restablecer tu contraseña épicamente.</p>
                    <form className="form">
                        <input
                            type="email"
                            placeholder="Ingrese su email"
                            className="input"
                            required
                        />
                        <button className="button">Enviar enlace de restablecimiento</button>
                    </form>
                    <p>
                    ¿Recordaste tu contraseña? <a href="../" className="link">Inicia sesión</a>
                </p>
            </div>
<<<<<<< HEAD
            </div>
        </main>
=======
        </div>

        
>>>>>>> 290c266a9d50090b60373c89e1d5e7ecec404073
    );
}
