import React, { useState } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonMenuButton, 
  IonCard, 
  IonCardTitle, 
  IonCardHeader, 
  IonCardContent, 
  IonText, 
  IonButton, 
  IonProgressBar, 
  IonAlert, 
  IonSelect, 
  IonSelectOption,
  IonIcon
} from '@ionic/react';
import { moon } from 'ionicons/icons'; // Icono para el botón de modo oscuro
import { useHistory } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const history = useHistory();
  const userName = "Juan Pérez"; // Este sería dinámico dependiendo del usuario logeado
  const availableSpots = 90;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark', !darkMode); // Activamos el modo oscuro
  };

  const handleReserve = () => {
    if (!selectedCar) {
      alert("Por favor, selecciona un vehículo.");
      return;
    }
    setShowAlert(true);
  };

  const handleConfirmReservation = () => {
    console.log('Reserva confirmada');
    history.push('/tab1');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonMenuButton slot="end" /> 
          <IonTitle>Parking Check</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true} className={darkMode ? 'dark-mode' : ''}>

        {/* Botón de modo oscuro como burbuja flotante */}
        <div className="bubble-darkmode" onClick={toggleDarkMode}>
          <IonIcon icon={moon} />
        </div>

        {/* Saludo personalizado */}
        <IonText className="greeting">
          <h2>Buenos días, {userName}!</h2>
        </IonText>

        <IonText>
          <h1 className="page-title">Estacionamientos Disponibles</h1>
        </IonText>

        {/* Card para Campus Norte */}
        <IonCard className="card">
          <img alt='Campus Norte' src='https://doctoradoeduconsorcio.cl/wp-content/uploads/catolica-temuco.jpg' className="card-image" />
          <IonCardHeader>
            <IonCardTitle>Campus Norte</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Disponible: {availableSpots}/150
            <IonProgressBar value={availableSpots / 150} color="success" className="availability-bar" />

            {/* Selección de vehículo */}
            <IonSelect value={selectedCar} placeholder="Selecciona tu vehículo" onIonChange={e => setSelectedCar(e.detail.value)}>
              <IonSelectOption value="auto1">Auto 1</IonSelectOption>
              <IonSelectOption value="auto2">Auto 2</IonSelectOption>
              <IonSelectOption value="auto3">Auto 3</IonSelectOption>
            </IonSelect>

            <IonButton expand="block" color="success" className="reserve-button" onClick={handleReserve}>
              Reservar
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Card para San Francisco (próximamente) */}
        <IonCard className="card upcoming">
          <img alt='Campus Sur' className="card-image bw-image" src='https://www.uct.cl/content/uploads/san-francisco-3.jpg'/>
          <IonCardHeader>
            <IonCardTitle>San Francisco</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Próximamente...
            <IonButton expand="block" color="medium" disabled className="reserve-button">
              No Disponible
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Alert de confirmación */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Confirmar Reserva'}
          message={`¿Está seguro que quiere reservar con el vehículo ${selectedCar}? Quedan ${availableSpots} plazas disponibles.`}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                console.log('Reserva cancelada');
              }
            },
            {
              text: 'Confirmar',
              handler: handleConfirmReservation
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
