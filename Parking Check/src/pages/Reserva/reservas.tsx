import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonInput, IonDatetime, IonAlert, IonLoading, IonBackButton, IonButtons, IonCard, IonCardContent, IonSelect, IonSelectOption, IonText } from '@ionic/react';
import { createReservation, getUserProfile } from '../../services/AuthServices'; // Importa las funciones de servicios
import { useHistory } from 'react-router-dom';

const ReservasPage: React.FC = () => {
  const [seccion, setSeccion] = useState('');
  const [numero, setNumero] = useState('');
  const [fechaReserva, setFechaReserva] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Obtener el perfil del usuario para extraer el ID
  const fetchData = async () => {
    try {
      const profileResponse = await getUserProfile();
      setUserId(profileResponse._id);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };  

  useEffect(() => {
    fetchData();
  }, []);

  // Función para crear una nueva reserva
  const handleCreateReservation = async () => {
    if (!seccion || !numero || !fechaReserva || !fechaExpiracion || !userId) {
      setAlertMessage('Todos los campos son obligatorios');
      setShowAlert(true);
      return;
    }

    const startDate = new Date(fechaReserva);
    const endDate = new Date(fechaExpiracion);

    // Validación para asegurar que la reserva no sea mayor a un día
    if ((endDate.getTime() - startDate.getTime()) > 24 * 60 * 60 * 1000) {
      setAlertMessage('La reserva no puede ser mayor a un día.');
      setShowAlert(true);
      return;
    }

    const newReservation = {
      seccion,
      numero,
      fechaReserva: startDate,
      fechaExpiracion: endDate,
      id_usuario: userId // Añadir el id del usuario autenticado
    };

    try {
      setLoading(true);
      
      setAlertMessage('Reserva creada correctamente');
      setShowAlert(true);
      // Limpiar los campos
      setSeccion('');
      setNumero('');
      setFechaReserva('');
      setFechaExpiracion('');
    } catch (error) {
      setAlertMessage('Error al crear la reserva');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color='primary'>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='/home' />
          </IonButtons>
          <IonTitle>Parking Check</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardContent>
          <IonList>
            <IonItem>
              <IonLabel>Sección</IonLabel>
              <IonSelect value={seccion} placeholder="Seleccione una sección" onIonChange={(e) => setSeccion(e.detail.value)}>
                <IonSelectOption value="A">A</IonSelectOption>
                <IonSelectOption value="B">B</IonSelectOption>
                <IonSelectOption value="C">C</IonSelectOption>
                <IonSelectOption value="D">D</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Número</IonLabel>
              <IonInput value={numero} onIonChange={(e) => setNumero(e.detail.value!)} />
            </IonItem>
            <IonItem>
              <IonLabel>Fecha Reserva</IonLabel>
              <IonDatetime value={fechaReserva} onIonChange={(e) => setFechaReserva(e.detail.value as string)} />
            </IonItem>
            <IonItem>
              <IonLabel>Fecha Expiración</IonLabel>
              <IonDatetime value={fechaExpiracion} onIonChange={(e) => setFechaExpiracion(e.detail.value as string)} />
            </IonItem>
          </IonList>
        <IonButton expand="block" onClick={handleCreateReservation}>Crear Reserva</IonButton>
          </IonCardContent>
        </IonCard>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Atención"
          message={alertMessage}
          buttons={['OK']}
        />
        <IonLoading
          isOpen={loading}
          message={'Cargando...'}
        />
      </IonContent>
    </IonPage>
  );
};

export default ReservasPage;
