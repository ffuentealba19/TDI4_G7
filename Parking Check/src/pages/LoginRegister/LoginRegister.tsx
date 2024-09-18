import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonLabel, IonButton, IonSegment, IonSegmentButton, IonRouterLink, IonToast, IonIcon } from '@ionic/react';
import { logoGoogle } from 'ionicons/icons';
import './login.css';
import { auth, provider } from '../../firebase-config';
import { signInWithPopup } from 'firebase/auth';
import { registerUser } from '../../api/api';
import { useHistory } from 'react-router-dom'; // Importa useHistory para redirigir
import { useAuth } from '../../context/authcontext';
import { Redirect } from 'react-router-dom';


const LoginRegister: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const history = useHistory(); // Inicializa useHistory
  const { user } = useAuth();  // Obtener el estado de autenticación

  if (user) {
    return <Redirect to="/home" />;  // Redirigir al home si ya está logueado
  }

  // Función para manejar el registro de usuario
  const handleRegister = async () => {
    try {
      const response = await registerUser(username, email, password);
      setToastMessage('Registro exitoso');
      setShowToast(true);
      history.push('/home'); // Redirigir al Home después del registro
    } catch (error: any) {
      setToastMessage(error.message);
      setShowToast(true);
    }
  };

  // Función para iniciar sesión con Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User:', result.user);
      setToastMessage('Inicio de sesión exitoso con Google');
      setShowToast(true);
      history.push('/home'); // Redirigir al Home después del login
    } catch (error) {
      console.error('Error:', error);
      setToastMessage('Error al iniciar sesión con Google');
      setShowToast(true);
    }
  };

  // Función para registrarse con Google
  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User:', result.user);
      setToastMessage('Registro exitoso con Google');
      setShowToast(true);
      history.push('/home'); // Redirigir al Home después del registro con Google
    } catch (error) {
      console.error('Error:', error);
      setToastMessage('Error al registrarse con Google');
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
                <IonLabel className="forgot-password">¿Olvidaste tu contraseña?</IonLabel>
                <IonButton expand="block" className="login-button">INICIAR SESIÓN</IonButton>
                <IonButton expand="block" className="google-login-button" onClick={handleGoogleLogin}>
                  <IonIcon icon={logoGoogle} slot="start" />
                  Iniciar sesión con Google
                </IonButton>
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
                <IonButton expand="block" className="google-register-button" onClick={handleGoogleRegister}>
                  <IonIcon icon={logoGoogle} slot="start" />
                  Registrarse con Google
                </IonButton>
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
