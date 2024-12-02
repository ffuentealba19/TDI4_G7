import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonToast,
  IonInput,
  IonList,
} from '@ionic/react';
import './tab1.css';

const Tab1: React.FC = () => {
  const [selectedSpace, setSelectedSpace] = useState<string | undefined>();
  const [userName, setUserName] = useState('');
  const [showToast, setShowToast] = useState(false);

  const availableSpaces = [
    { id: 'A1', status: 'Disponible' },
    { id: 'A2', status: 'Disponible' },
    { id: 'A3', status: 'Ocupado' },
    { id: 'A4', status: 'Disponible' },
  ];

  const handleConfirmAssignment = () => {
    if (selectedSpace && userName) {
      setShowToast(true);
      // Aquí puedes agregar lógica para guardar la asignación en tu backend
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Asignación de Espacio</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <h2>Asignar un Espacio</h2>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Nombre del Usuario</IonLabel>
              <IonInput
                placeholder="Ingresa tu nombre"
                value={userName}
                onIonChange={(e) => setUserName(e.detail.value!)}
              ></IonInput>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Espacio Disponible</IonLabel>
              <IonSelect
                placeholder="Selecciona un espacio"
                value={selectedSpace}
                onIonChange={(e) => setSelectedSpace(e.detail.value)}
              >
                {availableSpaces
                  .filter((space) => space.status === 'Disponible')
                  .map((space) => (
                    <IonSelectOption key={space.id} value={space.id}>
                      {space.id}
                    </IonSelectOption>
                  ))}
              </IonSelect>
            </IonItem>

            <IonButton expand="block" color="primary" onClick={handleConfirmAssignment}>
              Confirmar Asignación
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <h2>Lista de Espacios</h2>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {availableSpaces.map((space) => (
                <IonItem key={space.id}>
                  <IonLabel>
                    Espacio {space.id}: {space.status}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={`El espacio ${selectedSpace} ha sido asignado a ${userName}.`}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
