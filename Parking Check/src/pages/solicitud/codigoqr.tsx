import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
} from '@ionic/react';
import QRCode from 'qrcode';
import { getUserProfile, solicitarEspacio, liberarEspacio } from '../../services/AuthServices'; // Importa las funciones necesarias

const CodigoQr: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [username, setUsername] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [hasParking, setHasParking] = useState<boolean>(false); // Nuevo estado para verificar si tiene espacio

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await getUserProfile();
        setUsername(profileResponse.UserName);
        setUserData(profileResponse);

        // Verificar si el usuario tiene un espacio asignado
        setHasParking(profileResponse.parkingAssigned);  // Asume que la respuesta tiene este campo

        const qrData = JSON.stringify({
          id: profileResponse._id,
          name: profileResponse.UserName,
        });
        QRCode.toDataURL(qrData, (err, url) => {
          if (err) {
            console.error('Error al generar el código QR:', err);
            return;
          }
          setQrCode(url);
        });
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    fetchData();
  }, []);

  // Función para manejar el click del botón
  const handleButtonClick = async () => {
    try {
      if (hasParking) {
        // Si tiene espacio, liberar el espacio
        await liberarEspacio(userData._id);
        setHasParking(false); // Actualiza el estado para reflejar que el espacio fue liberado
        alert('Espacio liberado exitosamente');
      } else {
        // Si no tiene espacio, solicitar uno
        await solicitarEspacio(userData._id, username);
        setHasParking(true); // Actualiza el estado para reflejar que el espacio fue asignado
        alert('Espacio asignado exitosamente');
      }
    } catch (error) {
      console.error('Error al manejar el espacio de estacionamiento:', error);
      alert('Hubo un error al procesar la solicitud.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle color="light">Parking Check</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonText className='ion-text-center'>
              <h1 className="page-title">¡Hola, {username}!</h1>
              <p>Este es tu código QR</p>
            </IonText>
          </IonCardHeader>
          <IonCardContent>
            <IonText className="ion-text-center">
              <img width='350px' src={qrCode} />
            </IonText>

            {/* Botón para solicitar o liberar el espacio */}
            <IonButton 
              expand="block" 
              color="primary" 
              onClick={handleButtonClick}>
              {hasParking ? 'Liberar espacio' : 'Solicitar espacio'}
            </IonButton>

            <IonButton expand="block" color="primary" routerLink="/solicitud">
              Regresar
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default CodigoQr;
