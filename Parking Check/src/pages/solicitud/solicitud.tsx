import React, { useEffect, useState } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonMenuButton, IonButtons, IonButton, IonCard, IonText, 
  IonToast, IonAlert, IonIcon 
} from '@ionic/react';
import { qrCode, checkmarkCircleOutline } from 'ionicons/icons';
import { getUserProfile } from '../../services/AuthServices';

const Solicitud: React.FC = () => {
  const [userPlan, setUserPlan] = useState<string | null>(null);

  // Efecto para obtener el perfil del usuario al cargar la página
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserPlan(profile.Plan); // Asume que "Plan" es el campo que devuelve el plan del usuario
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot='end'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Parking Check</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard className='card'>
          <IonButton expand='block' routerLink='/codigoqr' className='card-button'>
            <IonIcon icon={qrCode} slot='start' />
            <IonText>
              <h1 className='card-title'>QR</h1>
            </IonText>
          </IonButton>
        </IonCard>

        <IonCard className='card'>
          {/* Botón de reserva habilitado si el usuario es VIP o VIP+ */}
          {userPlan === 'VIP' || userPlan === 'VIP+' ? (
            <IonButton expand='block' routerLink='/reserva' className='card-button'>
              <IonIcon icon={checkmarkCircleOutline} slot='start' />
              <IonText>
                <h1 className='card-title'>Reservar</h1>
              </IonText>
            </IonButton>
          ) : (
            <>
              {/* Botón deshabilitado y con alerta si el usuario no tiene un plan VIP */}
              <IonButton expand='block' id='reserva' className='card-button' color='medium'>
                <IonIcon icon={checkmarkCircleOutline} slot='start' />
                <IonText>
                  <h1 className='card-title'>Reservar</h1>
                </IonText>
              </IonButton>
              <IonAlert 
                trigger='reserva' 
                header='Función VIP' 
                message='Por favor mejora tu suscripción para acceder a esta función.' 
                buttons={['Aceptar']} 
              />
            </>
          )}
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Solicitud;
