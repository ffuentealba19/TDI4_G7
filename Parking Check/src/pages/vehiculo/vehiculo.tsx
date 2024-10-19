import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonList, IonItem, IonLabel } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './vehiculo.css';

const Vehiculos: React.FC = () => {
  const history = useHistory();
  const [vehiculos, setVehiculos] = useState<any[]>([]); 

  const handleAgregarVehiculo = () => {
    history.push('/agregar-vehiculo'); //formulario para agregar vehículo
  };

  const handleEditarVehiculo = (index: number) => {
    
  };

  const handleEliminarVehiculo = (index: number) => {
    const nuevosVehiculos = vehiculos.filter((_, i) => i !== index);
    setVehiculos(nuevosVehiculos); 
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gestionar Vehículos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding vehiculos-content">
        <IonCard className="vehiculos-card">
          <IonCardHeader>
            <IonCardTitle>Lista de Vehículos</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton expand="block" onClick={handleAgregarVehiculo}>
              Agregar Vehículo
            </IonButton>
            <IonList>
              {vehiculos.map((v, index) => (
                <IonItem key={index}>
                  <IonLabel>
                    {v.patente} - {v.marca} - {v.modelo} - {v.color}
                  </IonLabel>
                  <IonButton slot="end" onClick={() => handleEditarVehiculo(index)}>
                    Editar
                  </IonButton>
                  <IonButton slot="end" color="danger" onClick={() => handleEliminarVehiculo(index)}>
                    Eliminar
                  </IonButton>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Vehiculos;