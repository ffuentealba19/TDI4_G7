import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonText,
  IonCardHeader,
} from '@ionic/react';
import './profile.css';
import { useHistory } from 'react-router-dom';
import { logout, getUserProfile, getUserVehicles } from '../../services/AuthServices'; // Importa las funciones

const Perfil: React.FC = () => {
  const history = useHistory();
  const [userData, setUserData] = useState<any>(null); // Estado para almacenar los datos del usuario
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [profileImage, setProfileImage] = useState('/assets/profile-placeholder.png'); // Imagen por defecto del perfil
  const [vehiculos, setVehiculos] = useState<any[]>([]); // Estado para almacenar los vehículos

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener el perfil del usuario
        const profileResponse = await getUserProfile();
        setUserData(profileResponse); // Guardar los datos del perfil
        setProfileImage(profileResponse.profileImage); // Guardar la imagen de perfil

        // Obtener los vehículos del usuario
        const vehiculosResponse = await getUserVehicles();
        setVehiculos(vehiculosResponse); // Guardar los vehículos
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    history.push('/login');
    window.location.reload();
  };

  if (loading) {
    return <IonContent>Cargando...</IonContent>; // Pantalla de carga personalizada
  }

  if (!userData) {
    return <IonContent>Error al cargar los datos del perfil</IonContent>; // Manejo del error
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle color="light">PARKING CHECK</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonCard>
          <IonText className="ion-text-center">
            <h2>MI PERFIL</h2>
          </IonText>
          <IonAvatar style={{ margin: '0 auto' }}>
            <img src={profileImage} alt="Profile" />
          </IonAvatar>
          <IonText className="ion-text-center">
            <h3>{userData.UserName}</h3>
            <p>{userData.UserEmail}</p>
            <p>
              Usuario estándar <a href="/upgrade-subscription">Mejorar suscripción!</a>
            </p>  
          </IonText>
          <IonButton expand="block" color="medium" routerLink="/edit-profile">
            Editar Perfil
          </IonButton>
          <IonButton expand="block" color="danger" onClick={handleLogout}>
            Cerrar sesión
          </IonButton>
          <IonButton expand="block" color="primary" routerLink='/autos'>
            Gestionar Vehículos
          </IonButton>
          <IonText className="ion-text-center">
            <h4>Mis Vehículos</h4>
          </IonText>
          <div className="vehiculos-container">
            {vehiculos.length > 0 ? (
              vehiculos.map((vehiculo) => (
                <IonCard key={vehiculo._id} className="vehiculo-card">
                  <IonCardHeader>
                    <IonText className='ion-text-center'>
                      <img className='imagen' width={"200px"} src="https://img.yapo.cl/images/72/7299715193.jpg" alt="car1" />
                      <h5>{vehiculo.Placa}</h5>
                    </IonText>
                  </IonCardHeader>
                </IonCard>
              ))
            ) : (
              <IonText>No tienes vehículos registrados.</IonText>
            )}
          </div>

        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
