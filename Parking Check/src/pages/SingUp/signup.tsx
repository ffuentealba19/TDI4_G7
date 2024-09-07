import { IonContent, IonHeader, IonPage, IonTitle , IonToolbar , IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonLabel, IonButton, IonNavLink } from '@ionic/react';
import './signup.css';

const SignUp: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>SingUp</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Registro</IonTitle>
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
                     
                  </IonCardContent>
                  <IonButton expand='block' color='primary'>Registrarse</IonButton>
                  <IonLabel>¿No quieres una cuenta? <IonLabel color='secondary'>Sesion de invitado</IonLabel></IonLabel>
              </IonCardHeader>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  };
  
  export default SignUp;