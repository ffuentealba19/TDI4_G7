import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonLabel, IonButton, IonSegment, IonSegmentButton, IonRouterLink } from '@ionic/react';
import './login.css';

const LoginRegister: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<'login' | 'register'>('login');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Parking Check</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding login-content">
        <IonCard className="login-card">
          <IonCardHeader>
            <IonCardTitle className="card-title">PARKING CHECK</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {/* Barra de selección entre Login y Register */}
            <IonSegment
              value={selectedSegment}
              onIonChange={(e) => setSelectedSegment(e.detail.value as 'login' | 'register')}
            >
              <IonSegmentButton value="login">
                <IonLabel>Login</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="register">
                <IonLabel>Register</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            {/* Contenido dinámico: Login o Register */}
            {selectedSegment === 'login' ? (
              <div className="input-wrapper">
                <IonInput type="email" placeholder="Ingrese su email" className="input-field"></IonInput>
                <IonInput type="password" placeholder="Contraseña" className="input-field"></IonInput>
                <IonLabel className="forgot-password">¿Olvidaste tu contraseña?</IonLabel>
                <IonButton expand="block" className="login-button">INICIAR SESIÓN</IonButton>
                <div className="guest-session">
                  <IonLabel>No tienes cuenta? </IonLabel>
                  <IonLabel color="primary" className="guest-link" >
                     <IonRouterLink routerLink='/invited'> Sesion de Invitado</IonRouterLink>
                  </IonLabel>
                </div>
              </div>
            ) : (
              <div className="input-wrapper">
                <IonInput type="text" placeholder="Ingrese su nombre" className="input-field"></IonInput>
                <IonInput type="email" placeholder="Ingrese su email" className="input-field"></IonInput>
                <IonInput type="password" placeholder="Cree una contraseña" className="input-field"></IonInput>
                <IonButton expand="block" className="register-button">REGISTRARSE</IonButton>
                <div className="guest-session">
                  <IonLabel>No tienes cuenta? </IonLabel>
                  <IonLabel color="primary" className="guest-link" >
                     <IonRouterLink routerLink='/invited'> Sesion de Invitado</IonRouterLink>
                  </IonLabel>
                </div>
              </div>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default LoginRegister;


