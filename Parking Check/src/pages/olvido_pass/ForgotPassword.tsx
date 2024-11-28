import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonLabel, IonButton, IonRouterLink } from '@ionic/react';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Olvidé mi Contraseña</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding forgot-password-content">
        <IonCard className="forgot-password-card">
          <IonCardHeader>
            <IonCardTitle className="card-title">Recuperar Contraseña</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="forgot-password-input-wrapper">
              <IonInput 
                type="email" 
                placeholder="Ingrese su correo electrónico" 
                className="forgot-password-input-field" 
                clearInput={true}>
              </IonInput>
              <IonButton expand="block" className="forgot-password-button" routerLink='/login'>Enviar enlace de recuperación</IonButton>
              
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;