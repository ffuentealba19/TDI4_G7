import { IonContent, IonHeader, IonPage, IonTitle , IonToolbar , IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonLabel, IonButton, IonNavLink } from '@ionic/react';
import './login.css';
import Tab1 from './Tab1';


const Login: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>
                    Parking Check
                </IonCardTitle>
                <IonCardContent class='ion-padding'>
                    <IonInput type='email' label = "Correo" labelPlacement='floating' fill='outline' placeholder='Porfavor ingrese su correo'></IonInput>
                    <IonInput type='password' label = "Contraseña" labelPlacement='floating' fill='outline' placeholder='Porfavor ingrese su contraseña'></IonInput>
                    <IonLabel color='secondary'>¿Olvidaste tu contraseña?</IonLabel>
                </IonCardContent>
                <IonButton expand='block' color='primary'>Iniciar Sesión</IonButton>
                <IonLabel>¿No tienes cuenta? <IonLabel color='secondary'>Sesion de invitado</IonLabel></IonLabel>
            </IonCardHeader>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;
