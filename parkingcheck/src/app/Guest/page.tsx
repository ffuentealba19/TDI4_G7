import { Navbar } from '../components/Navbar';
import '../../styles/style1.css';

export default function Guest() {
  return (
    <div>
      <Navbar/>
      <div id="RegisterForm" className="container">
        <h2 className="title">Registro de Invitados</h2>
        <form className="form">
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
          <button className="button">Registrarse</button>
        </form>
      </div>
    </div>
  );
}
