import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react';
import { getParkings } from '../services/AuthServices'; // Importa tu servicio
import './tab1.css';

interface Parking {
  id: number; // Cambié el nombre a id
  section: number;
  status: string; // 'enabled' o 'disabled'
  occupiedBy: string | null; // Puede ser el ID de usuario o null
}

const Tab1: React.FC = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [groupedParkings, setGroupedParkings] = useState<Record<number, Parking[]>>({});

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const data = await getParkings();
        setParkings(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchParkings();
  }, []);

  useEffect(() => {
    // Agrupar los estacionamientos por sección
    const grouped = parkings.reduce<Record<number, Parking[]>>((acc, parking) => {
      if (!acc[parking.section]) {
        acc[parking.section] = [];
      }
      acc[parking.section].push(parking);
      return acc;
    }, {});

    setGroupedParkings(grouped);
  }, [parkings]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Estacionamiento</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            {Object.entries(groupedParkings).map(([section, parkings]) => (
              <IonCol key={section}>
                <IonCard color="light">
                  <IonCardHeader>
                    <IonCardTitle>Sección {section}</IonCardTitle>
                  </IonCardHeader>
                  <div className="parking-spots">
                    {parkings.map((parking) => (
                      <div 
                        key={parking.id} 
                        className={`spot ${parking.status === 'enabled' ? 'available' : 'occupied'}`}>
                        {parking.status === 'enabled' ? (
                          <div>{parking.id}</div> // Muestra el ID del estacionamiento
                        ) : (
                          <div>Used</div>
                        )}
                      </div>
                    ))}
                  </div>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
