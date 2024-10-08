import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonLabel, IonButton, IonList, IonItem } from '@ionic/react';
import { useState } from 'react';
import './vehiculo.css';

const Vehiculos: React.FC = () => {
  const [vehiculo, setVehiculo] = useState({ patente: '', modelo: '', marca: '' });
  const [vehiculos, setVehiculos] = useState<any[]>([]); // Array para almacenar los vehículos

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setVehiculo({ ...vehiculo, [name]: value });
  };

  const handleAgregarVehiculo = () => {
    setVehiculos([...vehiculos, vehiculo]);
    setVehiculo({ patente: '', modelo: '', marca: '' }); // Resetear el formulario después de agregar
  };

  const handleEditarVehiculo = (index: number) => {
    const vehiculoSeleccionado = vehiculos[index];
    setVehiculo(vehiculoSeleccionado);
    const nuevosVehiculos = vehiculos.filter((_, i) => i !== index);
    setVehiculos(nuevosVehiculos); // Eliminar el vehículo que se está editando para luego volver a agregarlo
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
            <IonCardTitle>{vehiculo.patente ? 'Editar Vehículo' : 'Agregar Vehículo'}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="vehiculos-input-wrapper">
              <IonInput
                name="patente"
                type="text"
                value={vehiculo.patente}
                placeholder="Ingrese la patente"
                onIonInput={handleInputChange}
                clearInput={true}
                className="vehiculos-input-field"
              ></IonInput>
              <IonInput
                name="marca"
                type="text"
                value={vehiculo.marca}
                placeholder="Ingrese la marca"
                onIonInput={handleInputChange}
                clearInput={true}
                className="vehiculos-input-field"
              ></IonInput>
              <IonInput
                name="modelo"
                type="text"
                value={vehiculo.modelo}
                placeholder="Ingrese el modelo"
                onIonInput={handleInputChange}
                clearInput={true}
                className="vehiculos-input-field"
              ></IonInput>
              <IonButton expand="block" className="vehiculos-button" onClick={handleAgregarVehiculo}>
                {vehiculo.patente ? 'Guardar Cambios' : 'Agregar Vehículo'}
              </IonButton>
            </div>

            <IonList>
              {vehiculos.map((v, index) => (
                <IonItem key={index} button onClick={() => handleEditarVehiculo(index)}>
                  {v.patente} - {v.marca} - {v.modelo}
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
