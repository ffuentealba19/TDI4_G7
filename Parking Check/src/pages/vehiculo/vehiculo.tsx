import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonList, IonItem, IonLabel, IonIcon, IonAlert } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { trash, create } from 'ionicons/icons';
import './vehiculo.css';
import { getUserVehicles, deleteVehicle, updateVehicle } from '../../services/AuthServices';

const Vehiculos: React.FC = () => {
  const history = useHistory();
  const [vehiculos, setVehiculos] = useState<any[]>([]); 
  const [showAlert, setShowAlert] = useState(false);
  const [vehiculoIdToDelete, setVehiculoIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
                // Obtener los vehículos del usuario
        const vehiculosResponse = await getUserVehicles();
        setVehiculos(vehiculosResponse); // Guardar los vehículos
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    fetchData();
  }, []);

  const confirmDeleteVehiculo = (id: string) => {
    setVehiculoIdToDelete(id);
    setShowAlert(true);
  };

  const deleteVehiculo = async (id: string) => {
    try {
      await deleteVehicle(id);
      const vehiculosResponse = await getUserVehicles();
      setVehiculos(vehiculosResponse); // Guardar los vehículos
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  }
  
  
  const handleUpdateVehiculo = (id: string) => {
    history.push(`/editarvehiculo/${id}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gestionar Vehículos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="vehiculos-content">
        <IonCard className="vehiculos-card">
          <IonCardHeader>
            <IonCardTitle>Lista de Vehículos</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton expand="block" routerLink='/agregarvehiculos'>
              Agregar Vehículo
            </IonButton>
            <IonList>
              {vehiculos.map((vehiculo, index) => (
                <IonItem key={index}>
                  <IonLabel>
                    <h2>{vehiculo.Placa}</h2>
                    <p>{vehiculo.Marca} {vehiculo.Modelo}</p>
                  </IonLabel>
                  <IonIcon icon={trash} slot="end" onClick={() => confirmDeleteVehiculo(vehiculo._id)} />
                  <IonIcon icon={create} slot="end" onClick={ () => handleUpdateVehiculo(vehiculo._id) } />  
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Confirmar eliminación'}
          message={'¿Estás seguro de que deseas eliminar este vehículo?'}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                setShowAlert(false);
                setVehiculoIdToDelete(null);
              }
            },
            {
              text: 'Eliminar',
              handler: async () => {
                if (vehiculoIdToDelete) {
                  await deleteVehiculo(vehiculoIdToDelete);
                  setShowAlert(false);
                  setVehiculoIdToDelete(null);
                }
              }
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Vehiculos;