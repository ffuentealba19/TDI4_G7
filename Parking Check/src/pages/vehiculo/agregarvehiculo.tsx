import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonLabel, IonButton } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './vehiculo.css';

const AgregarVehiculo: React.FC = () => {
    const history = useHistory();
    const [vehiculo, setVehiculo] = useState({ patente: '', modelo: '', marca: '', color: '' });

    const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setVehiculo({ ...vehiculo, [name]: value });
};

    const handleGuardar = () => {
      // Implementar lógica para guardar el vehículo (enviarlo al backend, por ejemplo)
      history.push('/vehiculos'); // Redirige a la lista de vehículos después de agregar
    };
    return (
    <IonPage>
        <IonHeader>
        <IonToolbar>
            <IonTitle>Agregar Vehículo</IonTitle>
        </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding vehiculos-content">
        <IonCard className="vehiculos-card">
            <IonCardHeader>
            <IonCardTitle>Ingrese los Datos del Vehículo</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
            <IonInput name="patente" placeholder="Ingrese la Patente" onIonInput={handleInputChange} />
            <IonInput name="marca" placeholder="Ingrese la Marca" onIonInput={handleInputChange} />
            <IonInput name="modelo" placeholder="Ingrese el Modelo" onIonInput={handleInputChange} />
            <IonInput name="color" placeholder="Ingrese el Color" onIonInput={handleInputChange} />
            <IonButton expand="block" onClick={handleGuardar}>
                Guardar Vehículo
            </IonButton>
            </IonCardContent>
        </IonCard>
        </IonContent>
    </IonPage>
);
};

export default AgregarVehiculo;