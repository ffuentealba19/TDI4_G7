"use client";

import React, { useEffect, useState } from 'react';

const ParkingMap = ({ isVip }: { isVip: boolean }) => {
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [occupiedSpots, setOccupiedSpots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchAvailableSpots = async () => {
      try {
        const response = await fetch('http://localhost:4001/parking/parkings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          const errorData = await response.json(); // Si hay un error, obtenemos la respuesta JSON
          throw new Error(errorData.error || 'Error desconocido');
        }
  
        const data = await response.json();
        console.log('Respuesta de la API:', data);  // Mostrar la respuesta completa
  
        if (data && Array.isArray(data.availableSpots)) {
          // Filtrar los espacios disponibles
          const availableSpots = data.availableSpots.filter(spot => spot.status === 'available');
  
          console.log('Espacios disponibles:', availableSpots);
  
        } else {
          console.error('Respuesta inesperada: No se encontró "availableSpots"');
        }
      } catch (error) {
        console.error('Error fetching available spots:', error);
      }
    };
  
    fetchAvailableSpots();
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
    if (!spot || !selectedDate) {
      alert("Por favor, selecciona un estacionamiento y una hora.");
      return;
    }
  
    const fechaReservaUsuario = new Date(selectedDate);
    const fechaVencimiento = new Date(fechaReservaUsuario.getTime() + 60 * 60 * 1000); // +1 hora
  
    try {
      const response = await fetch('http://localhost:4001/parking/reservas', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          Park: spot,
          fechaReserva: fechaReservaUsuario.toISOString(),
          fechaVencimiento: fechaVencimiento.toISOString(),
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Estacionamiento reservado:", data.park);
      } else {
        if (data.status === "occupied") {
          alert("El estacionamiento está ocupado.");
          if (!isVip) {
            const randomSpot = getRandomSpot();
            setSelectedSpot(randomSpot);
            localStorage.setItem('selectedSpot', randomSpot);
            alert(`Se te ha asignado un nuevo estacionamiento: ${randomSpot}`);
          }
        } else {
          console.error("Error reservando estacionamiento:", data.message);
          alert("Hubo un problema al reservar el estacionamiento.");
        }
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("No se pudo conectar al servidor. Inténtalo nuevamente.");
    }
  };
  
  return (
    <div className='centralReserve'>
        <div className="datePicker">
          <label htmlFor="reservationDate">Selecciona la fecha y hora:</label>
          <input
            type="datetime-local"
            id="reservationDate"
            onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
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
