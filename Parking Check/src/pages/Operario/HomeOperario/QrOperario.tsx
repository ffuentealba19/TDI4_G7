import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Para obtener el parámetro de la URL
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle } from "@ionic/react";
import QRCode from "qrcode"; // Librería para generar el QR
import { getParkings, solicitarEspacio } from "../../../services/AuthServices"; // Usamos estas funciones de AuthServices

import './qroperario.css';

const ParkingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtener el ID del estacionamiento desde la URL
  const [parkingDetails, setParkingDetails] = useState<any>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);

  useEffect(() => {
    // Obtener los detalles del estacionamiento
    const fetchParkingDetails = async () => {
      try {
        const parkings = await getParkings(); // Obtener todos los estacionamientos
        const parking = parkings.find((parking) => parking._id === id); // Encontrar el estacionamiento por ID
        setParkingDetails(parking);

        // Si el estacionamiento está disponible, generamos el QR
        if (parking && !parking.occupiedBy) { // Verificamos si el estacionamiento está disponible
          const qrData = JSON.stringify({
            parkingId: parking._id,
            parkingNumber: parking.number
          });
          QRCode.toDataURL(qrData, { width: 200 }, (err, url) => {
            if (err) {
              console.error("Error al generar el QR:", err);
            } else {
              setQrCodeImage(url); // Guardamos la URL del QR generado
            }
          });
        }
      } catch (error) {
        console.error("Error al obtener los detalles del estacionamiento:", error);
      }
    };

    fetchParkingDetails();
  }, [id]);

  const handleAssignParking = async () => {
    if (parkingDetails && !parkingDetails.occupiedBy) {
      try {
        const userId = "exampleUserId";  // Esto se debe cambiar según la lógica para obtener el ID del usuario.
        const userName = "exampleUserName"; // Lo mismo para el nombre del usuario.
        const response = await solicitarEspacio(userId, userName);
        console.log("Estacionamiento asignado:", response);
      } catch (error) {
        console.error("Error al asignar el estacionamiento:", error);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Detalles del Estacionamiento</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {parkingDetails ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Detalles del Estacionamiento</IonCardTitle>
            </IonCardHeader>
            <div>
              <p>{`Espacio: ${parkingDetails.number}`}</p>
              <p>{`Sección: ${parkingDetails.section}`}</p>
              <p>{`Estado: ${parkingDetails.occupiedBy ? "Ocupado" : "Disponible"}`}</p>
              {parkingDetails.occupiedBy && (
                <div>
                  <p>{`Ocupado por: ${parkingDetails.occupiedBy.UserName}`}</p>
                  <p>{`Correo: ${parkingDetails.occupiedBy.UserEmail}`}</p>
                </div>
              )}
            </div>

            {/* Mostrar el código QR solo si el estacionamiento está disponible */}
            {parkingDetails.occupiedBy === null && qrCodeImage && (
              <div style={{ marginTop: '20px' }}>
                <h3>Escanee este código QR para confirmar la asignación:</h3>
                <img src={qrCodeImage} alt="QR Code" width={200} />
              </div>
            )}

            {/* Mostrar el botón para asignar el estacionamiento solo si está disponible */}
            {parkingDetails.occupiedBy === null && (
              <IonButton onClick={handleAssignParking}>Asignar Estacionamiento</IonButton>
            )}

            <IonButton onClick={() => window.history.back()}>Volver</IonButton>
          </IonCard>
        ) : (
          <p>Cargando detalles...</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ParkingDetails;
