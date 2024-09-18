import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonMenuButton } from '@ionic/react';
import { mapOutline } from 'ionicons/icons';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonMenuButton slot="end" /> {/* El botón de menú va aquí */}
          <IonTitle>Parking Check</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Dirígete a tu estacionamiento asignado</h2>
        <IonButton expand="full" color="success">
          <IonIcon icon={mapOutline} slot="start" />
          Abrir Google Maps
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;