import React, { useState } from 'react';
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
  IonToast,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { loginOperator } from '../../../services/AuthServices'; // Importa la función del servicio

const OperatorLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const data = await loginOperator(email, password);
      setToastMessage('Inicio de sesión exitoso');
      setShowToast(true);
      history.push('/home-operario'); // Redirige al dashboard de operarios
    } catch (error: any) {
      setToastMessage(error.message || 'Error al iniciar sesión como operario');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Parking Check</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Bienvenido Operario</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonInput
              type="email"
              placeholder="Ingrese su email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
            />
            <IonInput
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
            />
            <IonButton expand="block" onClick={handleLogin}>
              INICIAR SESIÓN
            </IonButton>
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

export default OperatorLogin;
