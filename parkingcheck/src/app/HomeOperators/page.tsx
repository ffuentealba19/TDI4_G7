// HomeOperario.tsx
"use client";

import { Navbar } from '../../Components/Navbar';
import { NavbarOperario } from '../../Components/NavBarOperario';
import ParkingMapOperario from '../../Components/ParkingMapOperario';

export default function HomeOperario() {
  return (
    <div>
      <NavbarOperario />
      <h1>Estacionamientos Ocupados</h1>
      <ParkingMapOperario />
    </div>
  );
}
