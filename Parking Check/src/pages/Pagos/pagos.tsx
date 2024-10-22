import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonRadio,
  IonRadioGroup,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonButtons,
  IonIcon,
  IonBackButton,
  IonAlert,
  IonCard,
  IonCardContent,
} from '@ionic/react';

import { updatePlan } from '../../services/AuthServices';

const PaymentPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  // Agregar el plan básico
  const plans = [
    { name: 'Básico', price: 0 }, // Plan básico con costo $0
    { name: 'VIP', price: 5000 },
    { name: 'VIP+', price: 10000, discountPrice: 8000 },
  ];

  const handlePlanSelection = (planName: string) => {
    setSelectedPlan(planName);

    // Actualizamos el precio en base al plan seleccionado
    if (planName === 'Básico') {
      setTotalPrice(0); // Precio $0 para el plan básico
    } else if (planName === 'VIP') {
      setTotalPrice(plans[1].price);
    } else if (planName === 'VIP+') {
      setTotalPrice(plans[2].discountPrice!); // Aplicar descuento
    }
  };

  const handlePayment = async () => {
    if (selectedPlan) {
      try {
        // Llamada a la API para actualizar el plan del usuario
        const response = await updatePlan(selectedPlan);
  
        // Mostrar alerta de éxito con Ionic
        setAlertMessage(`Plan actualizado exitosamente a: ${response.plan}`);
        setShowSuccessAlert(true);
  
      } catch (error) {
        // Mostrar alerta de error con Ionic
        setAlertMessage('Hubo un error al actualizar el plan');
        setShowErrorAlert(true);
        console.error('Error en el proceso de pago:', error);
      }
    } else {
      // Mostrar alerta si no se selecciona un plan
      setAlertMessage('Por favor, selecciona un plan antes de continuar.');
      setShowErrorAlert(true);
    }
  };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonIcon/>
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
          <IonTitle>Editar Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
        <IonCardContent>
        <IonList>
          <IonRadioGroup
            value={selectedPlan}
            onIonChange={(e) => handlePlanSelection(e.detail.value)}
          >
            {plans.map((plan) => (
              <IonItem key={plan.name}>
                <IonLabel>
                  {plan.name} -{' '}
                  <IonText>
                    {plan.name === 'VIP+'
                      ? `Precio original: $${plan.price}, Descuento: $${plan.discountPrice}`
                      : `$${plan.price}`}
                  </IonText>
                </IonLabel>
                <IonRadio slot="start" value={plan.name} />
              </IonItem>
            ))}
          </IonRadioGroup>
        </IonList>
        </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardContent>
            <IonText>
              <h1>Total a pagar: ${totalPrice}</h1>
            </IonText>
            <IonButton expand="block" onClick={handlePayment}>
              {selectedPlan === 'Básico' ? 'Volver al plan básico' : 'Realizar pago'}
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Alertas de éxito y error */}
        <IonAlert
          isOpen={showSuccessAlert}
          onDidDismiss={() => setShowSuccessAlert(false)}
          header={'Éxito'}
          message={alertMessage}
          buttons={['Aceptar']}
        />

        <IonAlert
          isOpen={showErrorAlert}
          onDidDismiss={() => setShowErrorAlert(false)}
          header={'Error'}
          message={alertMessage}
          buttons={['Aceptar']}
        />
      </IonContent>
    </IonPage>
  );
};

export default PaymentPage;
