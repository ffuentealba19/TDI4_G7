// ParkingMapOperario.tsx
"use client";

import React, { useEffect, useState } from 'react';

interface ParkingSpot {
  section: string;
  number: string;
  status: string;
  occupiedBy?: string | null;
}

const ParkingMapOperario = () => {
  const [reservas, setReservas] = useState<ParkingSpot[]>([]);

  useEffect(() => {
    const fetchReservas = async () => {
        try {
            const response = await fetch('/api/Get_All_Reservations', {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            setReservas(data.reservas || []);
        } catch (error) {
            console.error("Error al obtener las reservas:", error);
        }
    };

    fetchReservas();
}, []);



  const allSpots = [
    ...Array.from({ length: 13 }, (_, i) => `A-${i + 1}`),
    ...Array.from({ length: 13 }, (_, i) => `B-${i + 1}`),
    ...Array.from({ length: 13 }, (_, i) => `C-${i + 1}`),
    ...Array.from({ length: 11 }, (_, i) => `D-${i + 1}`),
    ...Array.from({ length: 11 }, (_, i) => `E-${i + 1}`),
    ...Array.from({ length: 13 }, (_, i) => `F-${i + 1}`),
    ...Array.from({ length: 13 }, (_, i) => `G-${i + 1}`),
    ...Array.from({ length: 12 }, (_, i) => `H-${i + 1}`),
  ];

  const isReserved = (spotId: string) => {
    return reservas.some(spot => `${spot.seccion}-${spot.numero}` === spotId && spot.status === 'active');
  };
  
  const ParkingSpot = ({ id, specialHeight }: { id: string; specialHeight?: string }) => (
    <div
      className={`parking-spot ${isReserved(id) ? 'reserved' : ''}`}  
      style={{ height: specialHeight || 'auto', border: '1px solid #ccc', margin: '5px', textAlign: 'center' }}
    >
      {id}
    </div>
  );

  return (
    <div className='centralReserve'>
      <div className="parking-map">
        <div className="row">
          <div className="parking-lane" id="A">
            {Array.from({ length: 13 }, (_, i) => (
              <ParkingSpot key={`A-${i + 1}`} id={`A-${i + 1}`} specialHeight="5.6%" />
            ))}
          </div>
          <div className="empty-space"></div>
          <div className="parking-lane" id="B">
            {Array.from({ length: 13 }, (_, i) => (
              <ParkingSpot key={`B-${i + 1}`} id={`B-${i + 1}`} specialHeight="5.6%" />
            ))}
          </div>
          <div className="parking-lane" id="C">
            {Array.from({ length: 13 }, (_, i) => (
              <ParkingSpot key={`C-${i + 1}`} id={`C-${i + 1}`} specialHeight="5.6%" />
            ))}
          </div>
          <div className="empty-space"></div>
          <div className="parking-lane" id="D">
            {Array.from({ length: 11 }, (_, i) => (
              <ParkingSpot key={`D-${i + 1}`} id={`D-${i + 1}`} specialHeight="6.6%" />
            ))}
          </div>
          <div className="parking-lane" id="E">
            {Array.from({ length: 11 }, (_, i) => (
              <ParkingSpot key={`E-${i + 1}`} id={`E-${i + 1}`} specialHeight="6.6%" />
            ))}
          </div>
          <div className="empty-space"></div>
          <div className="parking-lane" id="F">
            {Array.from({ length: 13 }, (_, i) => (
              <ParkingSpot key={`F-${i + 1}`} id={`F-${i + 1}`} specialHeight="5.6%" />
            ))}
          </div>
          <div className="parking-lane" id="G">
            {Array.from({ length: 13 }, (_, i) => (
              <ParkingSpot key={`G-${i + 1}`} id={`G-${i + 1}`} specialHeight="5.6%" />
            ))}
          </div>
          <div className="empty-space"></div>
          <div className="parking-lane" id="H">
            {Array.from({ length: 12 }, (_, i) => (
              <ParkingSpot key={`H-${i + 1}`} id={`H-${i + 1}`} specialHeight="6.2%" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingMapOperario;
