import React, { useState } from 'react';
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
  IonButtons,
  IonProgressBar,
  IonAlert, 
  IonSelect, 
  IonSelectOption,
  IonIcon,
  IonAvatar
} from '@ionic/react';
import { moon } from 'ionicons/icons'; // Icono para el botón de modo oscuro
import { useHistory } from 'react-router-dom';
import './Home.css';
import { getUserProfile } from '../../services/AuthServices';

const Home: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState<any>(null); // Estado para almacenar los datos del usuario
  const [profileImage, setProfileImage] = useState('/assets/profile-placeholder.png'); // Imagen por defecto del perfil
  const availableSpots = 90;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark', !darkMode); // Activamos el modo oscuro
  };

  const fetchData = async () => {
    try {
      const profileResponse = await getUserProfile();
      setProfileImage(profileResponse.profileImage);
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
          <IonMenuButton slot="end">
            <IonAvatar>
              <img src={profileImage} alt="profile" />
            </IonAvatar>
          </IonMenuButton>
          <IonTitle>Parking Check</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true} className={darkMode ? 'dark-mode' : ''}>

        {/* Botón de modo oscuro como burbuja flotante */}
        <div className="bubble-darkmode" onClick={toggleDarkMode}>
          <IonIcon icon={moon} />
        </div>

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
            Disponible: {availableSpots}/150
            <IonProgressBar value={availableSpots / 150} color="success" className="availability-bar" />

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
