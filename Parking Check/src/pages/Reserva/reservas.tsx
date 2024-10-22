import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonText,
  IonLabel,
  IonItem,
  IonInput,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonIcon,
  IonBackButton,
} from '@ionic/react';
import './reservas.css'; // Estilos personalizados para la página

const ReservasPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedParking, setSelectedParking] = useState<string | undefined>();
  const [vehicle, setVehicle] = useState<string | undefined>();
  
  const handleReserva = () => {
    if (selectedDate && selectedTime && selectedParking && vehicle) {
      alert(`Reserva realizada para el ${selectedDate} a las ${selectedTime} en ${selectedParking} con el vehículo ${vehicle}.`);
    } else {
      alert('Por favor, completa todos los campos para realizar la reserva.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot='start'>
            <IonIcon/>
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
          <IonTitle color="light">Parking Check</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonCard className="reserva-card">
          <IonCardContent>
            <IonText color="primary">
              <h2 className="ion-text-center">Realiza tu Reserva</h2>
            </IonText>

            {/* Fecha */}
            <IonItem>
              <IonLabel position="stacked" color="primary">Selecciona la Fecha</IonLabel>
              <IonDatetime
                presentation="date" // Utilizar presentación "date"
                value={selectedDate || undefined}
              />
            </IonItem>

            {/* Hora */}
            <IonItem>
              <IonLabel position="stacked" color="primary">Selecciona la Hora</IonLabel>
              <IonDatetime
                presentation="time" // Utilizar presentación "time"
                value={selectedTime || undefined}
              />
            </IonItem>

            {/* Estacionamiento */}
            <IonItem>
              <IonLabel position="stacked" color="primary">Selecciona el Estacionamiento</IonLabel>
              <IonSelect
                placeholder="Selecciona una opción"
                value={selectedParking}
                onIonChange={e => setSelectedParking(e.detail.value)}
              >
                <IonSelectOption value="Estacionamiento A">Campus Norte</IonSelectOption>
                <IonSelectOption value="Estacionamiento B">Campus San Francisco</IonSelectOption>
              </IonSelect>
            </IonItem>

            {/* Vehículo */}
            <IonItem>
              <IonLabel position="stacked" color="primary">Selecciona tu Vehículo</IonLabel>
              <IonInput
                placeholder="Introduce la placa del vehículo"
                value={vehicle}
                onIonChange={e => setVehicle(e.detail.value!)}
              />
            </IonItem>

            {/* Botón de realizar reserva */}

              <IonButton expand="block" color="primary" onClick={handleReserva}>
                Realizar Reserva
              </IonButton>

          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ReservasPage;
