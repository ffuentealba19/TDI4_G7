import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonLabel, IonButton, IonSegment, IonSegmentButton, IonRouterLink, IonToast, IonIcon } from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';
import './login.css';
import { registerUser } from '../../api/api';
import { useHistory } from 'react-router-dom'; // Importa useHistory para redirigir


const LoginRegister: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const history = useHistory(); // Inicializa useHistory


  // Función para manejar el registro de usuario
  const handleRegister = async () => {
    try {
      const response = await registerUser(username, email, password);
      setToastMessage('Registro exitoso');
      setShowToast(true);
      // despues de comprobar que se registra ****** history.push('/home'); // Redirigir al Home después del registro
    } catch (error: any) {
      setToastMessage(error.message);
      setShowToast(true);
    }
  };


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

            {selectedSegment === 'login' ? (
              <div className="input-wrapper">
                <IonInput type="email" placeholder="Ingrese su email" className="input-field"></IonInput>
                <IonInput type="password" placeholder="Contraseña" className="input-field"></IonInput>
                <IonLabel className="forgot-password"> 
                  <IonRouterLink routerLink='/ForgotPassword'>¿Olvidaste tu contraseña?</IonRouterLink>
                </IonLabel>
                <IonButton expand="block" className="login-button">INICIAR SESIÓN</IonButton>
                {/* label de separacion */}
                <div className="guest-session">
                  <IonLabel>No tienes cuenta? </IonLabel>
                  <IonLabel color="primary" className="guest-link">
                    <IonRouterLink routerLink='/invited'> Sesion de Invitado</IonRouterLink>
                  </IonLabel>
                </div>
              </div>
            ) : (
              <div className="input-wrapper">
                <IonInput
                  type="text"
                  placeholder="Ingrese su nombre"
                  className="input-field"
                  value={username}
                  onIonChange={(e) => setUsername(e.detail.value!)}
                />
                <IonInput
                  type="email"
                  placeholder="Ingrese su email"
                  className="input-field"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                />
                <IonInput
                  type="password"
                  placeholder="Cree una contraseña"
                  className="input-field"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                />
                <IonButton expand="block" className="register-button" onClick={handleRegister}>
                  REGISTRARSE
                </IonButton>
                <div className="guest-session">
                  <IonLabel>No tienes cuenta? </IonLabel>
                  <IonLabel color="primary" className="guest-link">
                    <IonRouterLink routerLink='/invited'> Sesion de Invitado</IonRouterLink>
                  </IonLabel>
                </div>
              </div>
            )}
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginRegister;
