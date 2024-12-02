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
  IonAlert,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
} from '@ionic/react';
import './ReportProblem.css';

const ReportProblem: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // Campo nuevo
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [geolocation, setGeolocation] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null); // Para mostrar archivo adjunto
  const [reportHistory, setReportHistory] = useState<string[]>([]); // Historial de reportes

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
      setPhone('');
      setCategory('');
      setPriority('');
      setGeolocation(null);
      setAttachedFile(null);

      // Agregar el ticket al historial
      setReportHistory((prevHistory) => [...prevHistory, ticket]);

      // Mostrar confirmación del número de ticket
      setShowAlert(true);
    }, 1500);
  };

  const handleGeolocation = () => {
    // Simular obtención de geolocalización
    navigator.geolocation.getCurrentPosition((position) => {
      const location = `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`;
      setGeolocation(location);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0].name);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Reportar un Problema</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Campos del formulario */}
        <IonItem className="custom-input">
          <IonLabel position="floating">Correo Electrónico</IonLabel>
          <IonInput
            type="email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
            required
          />
        </IonItem>

        <IonItem className="custom-input">
          <IonLabel position="floating">Teléfono (Opcional)</IonLabel>
          <IonInput
            type="tel"
            value={phone}
            onIonChange={(e) => setPhone(e.detail.value!)}
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

        <IonItem className="custom-input ion-margin-top">
          <IonLabel>Adjuntar archivo</IonLabel>
          <input type="file" onChange={handleFileChange} />
          {attachedFile && <p>Archivo: {attachedFile}</p>}
        </IonItem>

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

        <IonButton expand="block" onClick={handleGeolocation} className="ion-margin-top custom-button">
          Obtener mi ubicación
        </IonButton>
        {geolocation && <p className="ion-margin-top">Ubicación actual: {geolocation}</p>}

        <IonButton expand="block" onClick={handleSubmit} className="ion-margin-top custom-button">
          Enviar Reporte
        </IonButton>

        {/* Loading, Toast y Alerta */}
        <IonLoading isOpen={loading} message="Enviando reporte..." />
        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
          color="success"
        />
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Reporte Enviado"
          message={`Tu número de ticket es: ${ticketNumber}`}
          buttons={['OK']}
        />

        {/* Historial de Reportes */}
        <IonCard className="ion-margin-top">
          <IonCardHeader>
            <h2>Historial de Reportes</h2>
          </IonCardHeader>
          <IonCardContent>
            {reportHistory.length === 0 ? (
              <p>No hay reportes anteriores.</p>
            ) : (
              <IonList>
                {reportHistory.map((ticket, index) => (
                  <IonItem key={index}>
                    <IonLabel>Número de Ticket: {ticket}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ReportProblem;
