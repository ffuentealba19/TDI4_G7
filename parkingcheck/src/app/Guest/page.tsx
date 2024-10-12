"use client"; 
import { redirect } from 'next/dist/server/api-utils';
import '../../styles/style1.css';
import Image from 'next/image';

export default function Guest() {
  const redirect =async (event: React.FormEvent<HTMLFormElement>) => {

  }
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
    <div className='flex items-center justify-center h-screen'>
      <div id="RegisterForm" className="container">
        <h2 className="title">Registro de Invitados</h2>
        <form className="form" onSubmit={redirect}>
          <input
            type="email"
            placeholder="Ingrese su email"
            className="input"
          />
          <input
            type="text"
            placeholder="Nombre Completo"
            className="input"
          />
          <input
            type="text"
            placeholder="Patente del Vehículo"
            className="input"
          />
          <button className="button" type="submit">Registrarse</button>
          <a href="../" className="link">volver</a>
        </form>
      </div>
      </div>
      </main>
  );
}
