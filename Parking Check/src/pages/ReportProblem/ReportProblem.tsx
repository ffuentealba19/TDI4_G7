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
  IonLoading,
  IonToast,
  IonSelect,
  IonSelectOption,
  IonAlert
} from '@ionic/react';
import './ReportProblem.css';

const ReportProblem: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [geolocation, setGeolocation] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = () => {
    if (!email || !problem || !category || !priority) {
      setToastMessage('Por favor, completa todos los campos.');
      setShowToast(true);
      return;
    }

    // Generar un número de ticket aleatorio
    const ticket = `T-${Math.floor(Math.random() * 100000)}`;
    setTicketNumber(ticket);

    setLoading(true);

    // Simular el envío del reporte
    setTimeout(() => {
      setLoading(false);
      setToastMessage('¡Problema reportado exitosamente!');
      setShowToast(true);
      setProblem('');
      setEmail('');
      setCategory('');
      setPriority('');
      setGeolocation(null);

      // Mostrar confirmación del número de ticket
      setShowAlert(true);
    }, 1500);
  };

  const handleGeolocation = () => {
    // Simular obtención de geolocalización
    navigator.geolocation.getCurrentPosition((position) => {

      const location = `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`;
      setGeolocation(location);
      console.log(location)
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Reportar un Problema</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Campos adicionales */}
        <IonItem className="custom-input">
          <IonLabel position="floating">Correo Electrónico</IonLabel>
          <IonInput
            type="email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
            required
          />
        </IonItem>

        <IonItem className="custom-input ion-margin-top">
          <IonLabel position="floating">Categoría del Problema</IonLabel>
          <IonSelect
            value={category}
            onIonChange={(e) => setCategory(e.detail.value)}
            placeholder="Selecciona la categoría"
          >
            <IonSelectOption value="problema_tecnico">Problema Técnico</IonSelectOption>
            <IonSelectOption value="problema_reserva">Problema de Reserva</IonSelectOption>
            <IonSelectOption value="otro">Otro</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem className="custom-input ion-margin-top">
          <IonLabel position="floating">Prioridad del Problema</IonLabel>
          <IonSelect
            value={priority}
            onIonChange={(e) => setPriority(e.detail.value)}
            placeholder="Selecciona la prioridad"
          >
            <IonSelectOption value="baja">Baja</IonSelectOption>
            <IonSelectOption value="media">Media</IonSelectOption>
            <IonSelectOption value="alta">Alta</IonSelectOption>
          </IonSelect>
        </IonItem>

        {/* Adjuntar archivo */}
        <IonItem className="custom-input ion-margin-top">
          <IonLabel>Adjuntar archivo</IonLabel>
          <input type="file" />
        </IonItem>

        {/* Descripción del problema */}
        <IonItem className="custom-input ion-margin-top">
          <IonLabel position="stacked">Descripción del problema</IonLabel>
          <IonTextarea
            value={problem}
            onIonChange={(e) => setProblem(e.detail.value!)}
            rows={6}
            placeholder="Describe el problema que estás experimentando..."
            required
          />
        </IonItem>

        {/* Geolocalización */}
        <IonButton expand="block" onClick={handleGeolocation} className="ion-margin-top custom-button">
          Obtener mi ubicación
        </IonButton>
        {geolocation && <p className="ion-margin-top">Ubicación actual: {geolocation}</p>}

        {/* Botón de envío */}
        <IonButton expand="block" onClick={handleSubmit} className="ion-margin-top custom-button">
          Enviar Reporte
        </IonButton>

        {/* Loading y Toast */}
        <IonLoading isOpen={loading} message="Enviando reporte..." />
        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
          color="success"
        />

        {/* Alerta de ticket */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Reporte Enviado"
          message={`Tu número de ticket es: ${ticketNumber}`}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default ReportProblem;
