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
  IonAvatar,
  IonToast // Agregado para las notificaciones
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { menu, moon, notificationsOutline } from 'ionicons/icons'; // Icono de notificaciones agregado
import './Home.css';
import { getUserProfile, getAvailableSpots } from '../../services/AuthServices';
import { initiateSocketConnection, subscribeToParkingUpdates, disconnectSocket} from '../../services/SocketServices';

const Home: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [profileImage, setProfileImage] = useState('/assets/profile-placeholder.png');
  const [availableSpots, setAvailableSpots] = useState(90); // Estado inicial de espacios disponibles
  const [showToast, setShowToast] = useState(false); // Estado para manejar las notificaciones
  const [recommendations] = useState([
    'Horario más libre: 10:00 - 12:00',
    'Evita: 18:00 - 20:00 (Alta ocupación)',
    'Ideal: 8:00 - 9:00 (disponibilidad alta)',
  ]); // Horarios recomendados
  const history = useHistory();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark', !darkMode); // Activamos el modo oscuro
  };

  // Función para obtener el perfil del usuario
  const fetchData = async () => {
    try {
      const profileResponse = await getUserProfile();
      setProfileImage(profileResponse.profileImage);
      setUserData(profileResponse.UserName);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };

  // Obtener los espacios disponibles y conectarse a Socket.io
  useEffect(() => {
    fetchData();
    
    // Obtener los espacios disponibles inicialmente desde la API
    const fetchAvailableSpots = async () => {
      try {
        const spots = await getAvailableSpots();
        setAvailableSpots(spots); // Establecer el valor inicial de espacios disponibles
      } catch (error) {
        console.error('Error al obtener los espacios disponibles:', error);
      }
    };

    fetchAvailableSpots(); // Llamar a la función para obtener los espacios disponibles

    // Iniciar conexión a Socket.io
    initiateSocketConnection();

    // Suscribirse a actualizaciones en tiempo real de espacios disponibles
    subscribeToParkingUpdates((newAvailableSpots: number) => {
      setAvailableSpots(newAvailableSpots); // Actualiza el estado cuando recibes nuevos datos
    });

    // Desconectar el socket cuando se desmonte el componente
    return () => {
      disconnectSocket();
    };

  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonMenuButton slot="end">
            <IonAvatar>
              <img src={profileImage
                ? profileImage
                : '/assets/profile-placeholder.png'} alt="profile" />
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

        {/* Botón de notificaciones */}
        <IonButton
          expand="block"
          color="secondary"
          onClick={() => setShowToast(true)}
          className="notify-button"
        >
          <IonIcon icon={notificationsOutline} slot="start" />
          Activar Notificaciones
        </IonButton>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Notificaciones activadas: te avisaremos si hay cambios importantes."
          duration={3000}
        />

        {/* Card de Campus Norte */}
        <IonCard className="card" routerLink='/solicitud'>
          <img alt="Campus Norte" src="https://doctoradoeduconsorcio.cl/wp-content/uploads/catolica-temuco.jpg" className="card-image" />
          <IonCardHeader>
            <IonCardTitle>Campus Norte</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Disponible: {availableSpots}/198
            <IonProgressBar value={availableSpots / 198} color="success" className="availability-bar" />
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

        {/* Horarios Recomendados */}
        <IonCard className="card">
          <IonCardHeader>
            <IonCardTitle>Recomendaciones de Horario</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {recommendations.map((rec, index) => (
              <p key={index}>• {rec}</p>
            ))}
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Home;
