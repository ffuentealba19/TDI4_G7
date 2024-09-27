import React from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, 
  IonContent, IonAvatar, IonButton, IonCard, IonCardContent, IonGrid, IonRow, 
  IonCol, IonText, IonMenu 
} from '@ionic/react';
import { useAuth } from '../../context/authcontext';
import { auth } from '../../firebase-config'; // Importar auth desde Firebase para cerrar sesión
import { signOut } from 'firebase/auth'; // Método para cerrar sesión
import { Redirect } from 'react-router';

const Perfil: React.FC = () => {
  const { user } = useAuth(); // Obtener el estado de autenticación

  if (!user) {
    // Si no hay usuario logueado, redirigir al login
    return <Redirect to="/" />;
  }

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirigir al usuario a la página de login
      return <Redirect to="/" />;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle color="light">
            PARKING CHECK
          </IonTitle>
          <IonButtons slot="end">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
            <IonMenu contentId="main-content">
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Menu Content</IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">This is the menu content.</IonContent>
            </IonMenu>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard className="ion-padding">
          <IonText className='ion-text-center'>
            <h2>MI PERFIL</h2>
          </IonText>

          {/* Mostrar foto de perfil desde Firebase */}
          <IonAvatar style={{ margin: '0 auto' }}>
            <img 
              src={user.photoURL || "https://via.placeholder.com/150"} 
              alt="User Avatar" 
            />
          </IonAvatar>

          {/* Mostrar nombre y correo desde Firebase */}
          <IonText className="ion-text-center">
            <h3>{user.displayName || 'Usuario'}</h3>
            <p>{user.email}</p>
            <p>Usuario estándar <a href="#">Mejorar suscripción!</a></p>
          </IonText>
          <IonButton expand="full" color="secondary" routerLink="/upgrade-subscription">
  Mejorar suscripción
</IonButton>

          <IonButton expand="block" color="medium" routerLink="/edit-profile"> 
              Editar Perfil
          </IonButton>

          {/* Mostrar tarjetas de autos */}
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
