"use client";

import React, { useEffect, useState } from 'react';

const ParkingMap = ({ isVip }: { isVip: boolean }) => {
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [occupiedSpots, setOccupiedSpots] = useState<string[]>([]);

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

  useEffect(() => {
    const storedSpot = localStorage.getItem('selectedSpot');

    if (storedSpot) {
      setSelectedSpot(storedSpot);
    } else if (!isVip) {
      const randomSpot = getRandomSpot();
      setSelectedSpot(randomSpot);
      localStorage.setItem('selectedSpot', randomSpot);
      reserveParkingSpot(randomSpot);
    }
  }, [isVip]);

  // Fetch occupied spots from the database
  useEffect(() => {
    const fetchOccupiedSpots = async () => {
      try {
        const response = await fetch('/api/parking');
        const data = await response.json();
        if (response.ok) {
          setOccupiedSpots(data.estacionamientos.Park);
        }
      } catch (error) {
        console.error('Error fetching occupied spots:', error);
      }
    };

    fetchOccupiedSpots();
  }, []);

  const getRandomSpot = () => {
    return allSpots[Math.floor(Math.random() * allSpots.length)];
  };

  const handleSpotClick = (spotId: string) => {
    if (isVip) {
      const newSpot = selectedSpot === spotId ? null : spotId;
      setSelectedSpot(newSpot);

      if (newSpot) {
        localStorage.setItem('selectedSpot', newSpot);
      } else {
        localStorage.removeItem('selectedSpot');
      }
    }
  };

  const ParkingSpot = ({ id, specialHeight }: { id: string; specialHeight?: string }) => (
    <div
      className={`parking-spot ${selectedSpot === id ? 'selected' : ''} ${occupiedSpots.includes(id) ? 'used' : ''}`}
      onClick={() => handleSpotClick(id)}
      style={{ height: specialHeight || 'auto', border: '1px solid #ccc', margin: '5px', textAlign: 'center' }}
    >
      {id}
    </div>
  );

  const reserveParkingSpot = async (spot: string) => {
    if (!spot) return;

    try {
      const response = await fetch('/api/Set_Parking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Park: spot }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Estacionamiento reservado:", data.park);
      } else {
        if (data.status === "occupied") {
          if (!isVip) {
            alert("Estacionamiento ocupado");
            const randomSpot = getRandomSpot();
            setSelectedSpot(randomSpot);
            localStorage.setItem('selectedSpot', randomSpot);
          } else {
            alert("Estacionamiento ocupado");
          }
        } else {
          console.error("Error reservando estacionamiento:", data.message);
          if (!isVip) {
            const newRandomSpot = getRandomSpot();
            setSelectedSpot(newRandomSpot);
            localStorage.setItem('selectedSpot', newRandomSpot);
          }
        }
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
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
          <button onClick={() => reserveParkingSpot(selectedSpot)}>
            Confirmar Selección
          </button>
        </div>
      )}
    </div>
  );
};

export default ParkingMap;
