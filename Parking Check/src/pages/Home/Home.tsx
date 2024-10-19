import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton, IonCard, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCardContent, IonText} from '@ionic/react';
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

      <IonContent fullscreen={true}>
        <IonText><h1>Estacionamientos Disponibles</h1></IonText>
        <IonCard>
          <img alt='Campus Norte' src='https://doctoradoeduconsorcio.cl/wp-content/uploads/catolica-temuco.jpg'/>
          <IonCardHeader>
            <IonCardTitle>Campus Norte</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>Disponible: 90/150</IonCardContent>
        </IonCard>
        <IonCard>
          <img alt='Campus Sur' className="grayscale-img" src='https://www.uct.cl/content/uploads/san-francisco-3.jpg'/>
          <IonCardHeader>
            <IonCardTitle>San Francisco</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>Proximamente...</IonCardContent>
        </IonCard>
        
      </IonContent>
    </IonPage>
  );
};

export default Home;