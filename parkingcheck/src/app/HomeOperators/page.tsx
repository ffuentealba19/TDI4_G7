// HomeOperario.tsx
"use client";

import { Navbar } from '../components/Navbar';
import ParkingMapOperario from '../components/ParkingMapOperario';

export default function HomeOperario() {
  return (
    <div>
      <Navbar />
      <h1>Estacionamientos Ocupados</h1>
      <ParkingMapOperario />
    </div>
  );
}
