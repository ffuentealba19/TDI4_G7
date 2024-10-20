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
  IonButton, 
  IonButtons
} from '@ionic/react';
import './Home.css';
import { useState } from 'react';
import { getUserProfile } from '../../services/AuthServices';

const Home: React.FC = () => {

  const [userData, setUserData] = useState<any>(null); // Estado para almacenar los datos del usuario

  const fetchData = async () => {
    try {
      const profileResponse = await getUserProfile();
      setUserData(profileResponse.UserName);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };
  fetchData();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonMenuButton slot="end" /> {/* Botón de menú */}
          <IonTitle>Parking Check</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>

        {/* Binvenido nombre de usuario */}
        <IonText>
          <h1 className="page-title">¡Bienvenido, {userData}! </h1>
        </IonText>

        {/* Card para Campus Norte */}
        <IonCard className="card" routerLink='/solicitud'>
          <img alt='Campus Norte' src='https://doctoradoeduconsorcio.cl/wp-content/uploads/catolica-temuco.jpg' className="card-image" />
          <IonCardHeader>
            <IonCardTitle>Campus Norte</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Disponible: 90/150
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
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Home;
