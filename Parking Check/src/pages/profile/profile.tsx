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
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { logout, getUserProfile } from '../../services/AuthServices'; // Asegúrate de que la función esté importada

const Perfil: React.FC = () => {
  const history = useHistory(); 
  const [userData, setUserData] = useState<any>(null); // Estado para almacenar los datos del usuario
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [profileImage, setProfileImage] = useState('/assets/profile-placeholder.png'); // Ruta de la imagen por defecto

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(); // Llama a la función para obtener el perfil
        setUserData(response); // Guarda los datos del usuario
        setProfileImage(response.profileImage); // Guarda la URL de la imagen de perfil
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout(); 
    history.push('/login'); 
    window.location.reload();
  };

  if (loading) {
    return <IonContent>Cargando...</IonContent>; // Puedes personalizar el loading
  }

  if (!userData) {
    return <IonContent>Error al cargar los datos del perfil</IonContent>; // Maneja el error
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

          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <IonCard>
                  <img src="https://img.yapo.cl/images/72/7299715193.jpg" alt="Car 1" />
                  <IonCardContent className="ion-text-center">BZ JS 66</IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard>
                  <img src="https://img.yapo.cl/images/72/7299715193.jpg" alt="Car 2" />
                  <IonCardContent className="ion-text-center">DK JS 32</IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
