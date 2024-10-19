import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonMenuButton, 
  IonCard, 
  IonCardTitle, 
  IonCardHeader, 
  IonCardContent, 
  IonText, 
  IonButton 
} from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonMenuButton slot="end" /> {/* Botón de menú */}
          <IonTitle>Parking Check</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>

        {/* Título principal */}
        <IonText>
          <h1 className="page-title">Estacionamientos Disponibles</h1>
        </IonText>

        {/* Card para Campus Norte */}
        <IonCard className="card">
          <img alt='Campus Norte' src='https://doctoradoeduconsorcio.cl/wp-content/uploads/catolica-temuco.jpg' className="card-image" />
          <IonCardHeader>
            <IonCardTitle>Campus Norte</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Disponible: 90/150
            {/* Botón para reservar */}
            <IonButton expand="block" color="success" className="reserve-button">
              Reservar
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Card para San Francisco (próximamente) */}
        <IonCard className="card upcoming">
          <img alt='Campus Sur' className="card-image bw-image" src='https://www.uct.cl/content/uploads/san-francisco-3.jpg'/>
          <IonCardHeader>
            <IonCardTitle>San Francisco</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Próximamente...
            {/* Botón deshabilitado para indicar que no está disponible */}
            <IonButton expand="block" color="medium" disabled className="reserve-button">
              No Disponible
            </IonButton>
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Home;
