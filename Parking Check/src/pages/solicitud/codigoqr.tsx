import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAvatar,
  IonText,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';
import QRCode from 'qrcode';
import { getUserProfile } from '../../services/AuthServices';


const CodigoQr: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [username, setUsername] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await getUserProfile();
        setUsername(profileResponse.UserName);
        setUserData(profileResponse);
        const qrData = JSON.stringify({
          id: profileResponse._id,
          name: profileResponse.UserName
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
              <p>Este es tu codigo QR</p>
            </IonText>
          </IonCardHeader>
          <IonCardContent>
          <IonText className="ion-text-center">
              <img width='350px' src={qrCode}/>
            </IonText>
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
