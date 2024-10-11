"use client";

import React, { useEffect, useState } from 'react';

const ParkingMap = () => {
  // Estado para la plaza seleccionada
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);


  useEffect(() => {
    const storedSpot = localStorage.getItem('selectedSpot');
    if (storedSpot) {
      setSelectedSpot(storedSpot);
    }
  }, []);

  const handleSpotClick = (spotId: string) => {

    const newSpot = selectedSpot === spotId ? null : spotId;
    setSelectedSpot(newSpot);
    

    if (newSpot) {
      localStorage.setItem('selectedSpot', newSpot);
    } else {
      localStorage.removeItem('selectedSpot');
    }
  };

  const ParkingSpot = ({ id, specialHeight }: { id: string; specialHeight?: string }) => (
    <div
      className={`parking-spot ${selectedSpot === id ? 'selected' : ''}`}
      onClick={() => handleSpotClick(id)}
      style={{ height: specialHeight || 'auto', border: '1px solid #ccc', margin: '5px', textAlign: 'center' }} // Estilos básicos en línea
    >
      {id}
    </div>
  );

  const handleButtonClick = () => {
    if (selectedSpot) {
      console.log(`Estacionamiento seleccionado: ${selectedSpot}`);
    }
  };


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
      {selectedSpot && (
        <div className="reserveButton bg-sky-500">
          <button onClick={handleButtonClick}>Confirmar Selección</button>
        </div>
        )}
    </div>
    
  );
};

export default ParkingMap;
