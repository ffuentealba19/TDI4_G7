"use client"; 
import { Navbar } from '@/Components/Navbar';

export default function Guest() {
  const redirect =async (event: React.FormEvent<HTMLFormElement>) => {

  }
  return (
    <div>
     <Navbar></Navbar>
     <main className="main">
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
    </div>
  );
}
