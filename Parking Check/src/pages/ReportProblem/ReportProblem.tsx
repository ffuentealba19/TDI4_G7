import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonTextarea,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonLoading
} from '@ionic/react';
import './ReportProblem.css';

const ReportProblem: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);

    // Aquí puedes añadir la lógica para enviar el reporte a un servidor o guardarlo localmente
    setTimeout(() => {
      setLoading(false);
      alert('¡Problema reportado exitosamente!');
    }, 1500);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Reportar un Problema</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Correo Electrónico</IonLabel>
          <IonInput
            type="email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
            required
          />
        </IonItem>

        <IonItem className="ion-margin-top">
          <IonLabel position="stacked">Describe el problema</IonLabel>
          <IonTextarea
            value={problem}
            onIonChange={(e) => setProblem(e.detail.value!)}
            rows={6}
            placeholder="Describe el problema que estás experimentando..."
            required
          />
        </IonItem>

        <IonButton expand="block" onClick={handleSubmit} className="ion-margin-top">
          Enviar Reporte
        </IonButton>

        {/* Loading spinner */}
        <IonLoading isOpen={loading} message="Enviando reporte..." />
      </IonContent>
    </IonPage>
  );
};

export default ReportProblem;
