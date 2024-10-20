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
    IonItem, 
    IonButton, 
    IonButtons,
    IonAlert,
    IonBackButton,
    IonIcon
  } from '@ionic/react';
  import { useState } from 'react';
  import { useHistory } from 'react-router-dom';
  import { agregarVehiculo } from '../../services/AuthServices'; // Importar la función
  import './vehiculo.css';
  
  const AgregarVehiculo: React.FC = () => {
    const history = useHistory();
    const [vehiculo, setVehiculo] = useState({ patente: '', modelo: '', marca: '', color: '' });
    const [showAlert, setShowAlert] = useState(false); // Estado para controlar alertas
    const [alertMessage, setAlertMessage] = useState(''); // Mensaje personalizado para la alerta
  
    // Manejar cambios en los inputs
    const handleInputChange = (e: any) => {
      const { name, value } = e.target;
      setVehiculo({ ...vehiculo, [name]: value });
    };
  
    // Manejar la lógica de guardar
    const handleGuardar = async () => {
      if (!vehiculo.patente || !vehiculo.marca || !vehiculo.modelo || !vehiculo.color) {
        setAlertMessage('Por favor, complete todos los campos.'); // Mensaje de alerta
        setShowAlert(true);
        return;
      }
  
      try {
        // Enviar los datos del vehículo al backend
        await agregarVehiculo({
          Placa: vehiculo.patente,
          Marca: vehiculo.marca,
          Modelo: vehiculo.modelo,
          Color: vehiculo.color
        });
        
        // Redirigir al perfil
        history.push('/perfil');
        window.location.reload();
        
      } catch (error) {
        // Mostrar error si el guardado falla
        setAlertMessage('Error al guardar el vehículo. Intente nuevamente.');
        setShowAlert(true);
      }
    };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color='primary'>
          <IonButtons slot="start">
            <IonIcon/>
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
            <IonTitle>Parking Check</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="vehiculos-content">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Ingrese los Datos del Vehículo</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Patente</IonLabel>
                <IonInput 
                  name="patente" 
                  placeholder="Ingrese la patente" 
                  value={vehiculo.patente} 
                  onIonInput={handleInputChange} 
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Marca</IonLabel>
                <IonInput 
                  name="marca" 
                  placeholder="Ingrese la marca" 
                  value={vehiculo.marca} 
                  onIonInput={handleInputChange} 
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Modelo</IonLabel>
                <IonInput 
                  name="modelo" 
                  placeholder="Ingrese el modelo" 
                  value={vehiculo.modelo} 
                  onIonInput={handleInputChange} 
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Color</IonLabel>
                <IonInput 
                  name="color" 
                  placeholder="Ingrese el color" 
                  value={vehiculo.color} 
                  onIonInput={handleInputChange} 
                />
              </IonItem>
              <IonButton expand="block" color="primary" onClick={handleGuardar}>
                Guardar Vehículo
              </IonButton>
            </IonCardContent>
          </IonCard>
  
          {/* Alerta para mensajes */}
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={'Resultado'}
            message={alertMessage}
            buttons={['OK']}
          />
        </IonContent>
      </IonPage>
    );
  };
  
  export default AgregarVehiculo;
  