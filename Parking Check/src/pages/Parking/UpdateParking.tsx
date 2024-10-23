import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonItem,
  IonAlert
} from '@ionic/react';
import { getParkings, updateParking } from '../../services/AuthServices'; // Asegúrate de crear estos servicios en tu archivo de servicios

const UpdateParking: React.FC = () => {
  const [parkings, setParkings] = useState<any[]>([]);
  const [selectedParking, setSelectedParking] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    // Obtener la lista de estacionamientos cuando la página se carga
    const fetchParkings = async () => {
      try {
        const response = await getParkings();
        setParkings(response);
      } catch (error) {
        console.error('Error al obtener los estacionamientos:', error);
      }
    };

    fetchParkings();
  }, []);

  const handleUpdateParking = async () => {
    if (!selectedParking) {
      setAlertMessage('Por favor, selecciona un estacionamiento');
      setShowAlert(true);
      return;
    }

    try {
      await updateParking(selectedParking); // Llama a la función que actualiza el estacionamiento
      setAlertMessage('El estado del estacionamiento se ha actualizado correctamente.');
      setShowAlert(true);
    } catch (error) {
      console.error('Error al actualizar el estacionamiento:', error);
      setAlertMessage('Error al actualizar el estacionamiento.');
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Actualizar Estacionamientos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonItem>
          <IonLabel>Selecciona un estacionamiento</IonLabel>
          <IonSelect
            value={selectedParking}
            placeholder="Selecciona uno"
            onIonChange={(e) => setSelectedParking(e.detail.value)}
          >
            {parkings.map((parking) => (
              <IonSelectOption key={parking._id} value={parking._id}>
                {`Número: ${parking.number} - Ocupado: ${parking.occupiedBy ? 'Sí' : 'No'}`}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonButton expand="block" onClick={handleUpdateParking}>
          Actualizar Estacionamiento
        </IonButton>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Resultado'}
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default UpdateParking;
