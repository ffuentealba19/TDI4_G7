"use client"; 
import ClientLayout from '../layout-client'; 
import '../../styles/style1.css';

export default function LostmyPassword() {
    return (
        <ClientLayout>
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
        </ClientLayout>
    );
}
