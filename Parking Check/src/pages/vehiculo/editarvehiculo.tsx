import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom'; // Para manejar la navegación y obtener los parámetros de la URL
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonInput, IonLabel, IonItem, IonButton, IonLoading, IonToast, IonCard, IonIcon, IonImg } from '@ionic/react';
import { updateVehicle, getUserVehicles, uploadImage } from "../../services/AuthServices"; // Importa las funciones de la API

const EditarVehiculo: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtener el id del vehículo desde los parámetros
  const history = useHistory();

  // Estado para manejar los datos del vehículo
  const [vehicle, setVehicle] = useState({
    Placa: '',
    Marca: '',
    Modelo: '',
    Color: '',
    Imagen: '', // Almacenar la URL de la imagen actual del vehículo
  });
  const [newImage, setNewImage] = useState<File | null>(null); // Almacenar la nueva imagen seleccionada
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Previsualización de la imagen
  const [loading, setLoading] = useState(false); // Estado para manejar el cargando
  const [showToast, setShowToast] = useState(false); // Estado para manejar el Toast

  // Función para obtener los datos del vehículo al cargar la página
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const vehicles = await getUserVehicles(); // Obtiene todos los vehículos del usuario
        const selectedVehicle = vehicles.find((v: any) => v._id === id); // Busca el vehículo por su ID
        if (selectedVehicle) {
          setVehicle(selectedVehicle); // Actualiza el estado con los datos del vehículo
          setImagePreview(selectedVehicle.Imagen); // Mostrar la imagen actual si existe
        } else {
          throw new Error('Vehículo no encontrado');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener el vehículo:', error);
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  // Función para manejar el cambio en los campos del formulario
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setVehicle({ ...vehicle, [name]: value });
  };

  // Manejar la selección de la nueva imagen
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) {
      setNewImage(file); // Almacenar la nueva imagen
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string); // Previsualización de la imagen
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para manejar la actualización del vehículo
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Actualizar los datos del vehículo
      await updateVehicle(id, {
        Placa: vehicle.Placa,
        Marca: vehicle.Marca,
        Modelo: vehicle.Modelo,
        Color: vehicle.Color
      }, newImage); // Pasar la nueva imagen si fue seleccionada

      setShowToast(true); // Muestra un Toast al completar
      setLoading(false);
      history.push('/profile');
      window.location.reload();
      
    } catch (error) {
      console.error('Error al actualizar el vehículo:', error);
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color='primary'>
          <IonButtons slot="start">
            <IonIcon/>
            <IonBackButton defaultHref="/autos" />
          </IonButtons>
          <IonTitle>Editar Vehículo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
        <IonItem>
          <IonLabel position="stacked">Placa</IonLabel>
          <IonInput
            name="Placa"
            value={vehicle.Placa}
            onIonChange={handleInputChange}
            placeholder="Ingrese la placa del vehículo"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Marca</IonLabel>
          <IonInput
            name="Marca"
            value={vehicle.Marca}
            onIonChange={handleInputChange}
            placeholder="Ingrese la marca del vehículo"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Modelo</IonLabel>
          <IonInput
            name="Modelo"
            value={vehicle.Modelo}
            onIonChange={handleInputChange}
            placeholder="Ingrese el modelo del vehículo"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Color</IonLabel>
          <IonInput
            name="Color"
            value={vehicle.Color}
            onIonChange={handleInputChange}
            placeholder="Ingrese el color del vehículo"
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
            Cambiar Imagen
          </IonButton>
        </IonItem>

        {/* Previsualización de la imagen */}
        {imagePreview && (
          <IonItem>
            <IonImg src={imagePreview} alt="Previsualización del Vehículo" />
          </IonItem>
        )}

        <IonButton expand="block" onClick={handleSubmit}>
          Guardar Cambios
        </IonButton>

        <IonLoading isOpen={loading} message={'Actualizando vehículo...'} />
        <IonToast
          isOpen={showToast}
          message="Vehículo actualizado con éxito"
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default EditarVehiculo;