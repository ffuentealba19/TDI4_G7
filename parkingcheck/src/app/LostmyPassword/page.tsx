"use client"; 
import '../../styles/style1.css';
import { Navbar } from '../components/Navbar';

export default function LostmyPassword() {
    return (
        <div>
            <Navbar/>
            <div className="main">
                <div className="container">
                    <h1 className="title">¿Olvidaste tu contraseña?</h1>
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
            </div>
        </div>

        
    );
}
