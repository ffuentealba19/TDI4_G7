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
  IonIcon,
  IonImg
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { agregarVehiculo, uploadImage } from '../../services/AuthServices'; // Importar la función
import './vehiculo.css';

const AgregarVehiculo: React.FC = () => {
  const history = useHistory();
  const [vehiculo, setVehiculo] = useState({ patente: '', modelo: '', marca: '', color: '' });
  const [showAlert, setShowAlert] = useState(false); // Estado para controlar alertas
  const [alertMessage, setAlertMessage] = useState(''); // Mensaje personalizado para la alerta
  const [newImage, setNewImage] = useState<File | null>(null); // Almacena la nueva imagen del vehículo
  const [vehicleImagePreview, setVehicleImagePreview] = useState<string | null>(null); // Previsualización de la imagen

  // Manejar cambios en los inputs
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setVehiculo({ ...vehiculo, [name]: value });
  };

  // Manejar la selección de la imagen
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) {
      setNewImage(file); // Almacena el archivo seleccionado
      const reader = new FileReader();
      reader.onload = () => {
        setVehicleImagePreview(reader.result as string); // Previsualiza la imagen seleccionada
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejar la lógica de guardar
    const handleGuardar = async () => {
      if (!vehiculo.patente || !vehiculo.marca || !vehiculo.modelo || !vehiculo.color) {
        setAlertMessage('Por favor, complete todos los campos.'); // Mensaje de alerta
        setShowAlert(true);
        return;
      }

      try {
        // Primero, crear el vehículo sin la imagen
        const vehicleData = {
          Placa: vehiculo.patente,
          Marca: vehiculo.marca,
          Modelo: vehiculo.modelo,
          Color: vehiculo.color
        };
        const createdVehicle = await agregarVehiculo(vehicleData); // Llama a la función de agregar vehículo


        // Ahora, si se ha seleccionado una imagen, subirla
        if (newImage && createdVehicle._id) {
          const uploadResponse = await uploadImage(newImage, 'vehicle', createdVehicle._id); // Sube la imagen con el ID del vehículo creado
          console.log('Imagen del vehículo subida:', uploadResponse);
        }

        // Redirigir al perfil si todo fue exitoso
        history.push('/profile');
        window.location.reload();

      } catch (error) {
        // Mostrar error si el guardado falla
        setAlertMessage('Error al guardar el vehículo o al subir la imagen. Intente nuevamente.');
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

            {/* Selector de imagen */}
            <IonItem>
              <IonLabel position="stacked">Imagen del Vehículo</IonLabel>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
                id="vehicleImageInput"
              />
              <IonButton onClick={() => document.getElementById('vehicleImageInput')?.click()}>
                Seleccionar Imagen
              </IonButton>
            </IonItem>

            {/* Previsualización de la imagen */}
            {vehicleImagePreview && (
              <IonItem>
                <IonImg src={vehicleImagePreview} alt="Vehicle Preview" />
              </IonItem>
            )}

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
