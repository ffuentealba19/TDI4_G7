// HomeOperario.tsx
"use client";

import { NavbarOperario } from '../components/NavBarOperario';
import ParkingMapOperario from '../components/ParkingMapOperario';

export default function HomeOperario() {
  return (
    <div>
      <NavbarOperario />
      <h1>Estacionamientos Ocupados</h1>
      <ParkingMapOperario />
    </div>
  );
}
