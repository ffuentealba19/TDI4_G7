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
          <IonButtons slot="end">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard className="ion-padding">
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
              Usuario estándar <a href="#">Mejorar suscripción!</a>
            </p>
          </IonText>
          <IonButton expand="full" color="secondary" routerLink="/upgrade-subscription">
            Mejorar suscripción
          </IonButton>

          <IonButton expand="block" color="medium" routerLink="/edit-profile">
            Editar Perfil
          </IonButton>
          <IonButton expand="block" color="danger" onClick={handleLogout}>
            Cerrar sesión
          </IonButton>

          <IonText className="ion-text-center">
            <h4>Mis Vehículos</h4>
          </IonText>

          {vehiculos.length > 0 ? (
            vehiculos.map((vehiculo) => (
              <IonCard key={vehiculo._id} className="ion-margin">
                <IonCardHeader>
                  <IonText>
                    <h5>Placa: {vehiculo.Placa}</h5>
                    <p>Marca: {vehiculo.Marca}</p>
                    <p>Modelo: {vehiculo.Modelo}</p>
                    <p>Color: {vehiculo.Color}</p>
                  </IonText>
                </IonCardHeader>
              </IonCard>
            ))
          ) : (
            <IonText>No tienes vehículos registrados.</IonText>
          )}
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
