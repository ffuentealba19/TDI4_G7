import React, { useState, useContext } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonLabel,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonRouterLink,
  IonToast,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { registerUser, loginUser } from '../../services/AuthServices';
import { AuthContext } from '../../context/authcontext'; // Importar el contexto
import './login.css';

const LoginRegister: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();
  
  const { setAuthToken } = useContext(AuthContext); // Usar el contexto para actualizar el token

  // Función para manejar el registro de usuario
  const handleRegister = async () => {
    try {
      await registerUser(username, email, password);
      setToastMessage('Registro exitoso');
      const data = await loginUser(email, password);
      setAuthToken(data.token);
      setShowToast(true);
      history.push('/agregar-vehiculo');
      window.location.reload();
    } catch (error: any) {
      setToastMessage(error.message || 'Error en el registro');
      setShowToast(true);
    }
  };

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      setAuthToken(data.token);
      setToastMessage('Inicio de sesión exitoso');
      setShowToast(true);
      history.push('/home');
      window.location.reload();
    } catch (error: any) {
      setToastMessage(error.message || 'Error en el inicio de sesión');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color='primary'>
          <IonTitle>Parking Check</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding login-content">
        <IonCard className="login-card">
          <IonCardHeader>
            <IonCardTitle className="card-title">Bienvenido</IonCardTitle>
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
                <IonInput
                  type="email"
                  placeholder="Ingrese su email"
                  className="input-field"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                />
                <IonInput
                  type="password"
                  placeholder="Contraseña"
                  className="input-field"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                />
                <IonLabel className="forgot-password">
                  <IonRouterLink routerLink='/ForgotPassword'>¿Olvidaste tu contraseña?</IonRouterLink>
                </IonLabel>
                <IonButton expand="block" className="login-button" onClick={handleLogin}>
                  INICIAR SESIÓN
                </IonButton>
                <div className="guest-session">
                  <IonLabel>¿Eres operario? </IonLabel>
                  <IonLabel color="primary" className="guest-link">
                    <IonRouterLink routerLink='/operario-login'> Ingresa aquí</IonRouterLink>
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
                  <IonLabel>¿Eres operario? </IonLabel>
                  <IonLabel color="primary" className="guest-link">
                    <IonRouterLink routerLink='/operario-login'> Ingresa aquí</IonRouterLink>
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
