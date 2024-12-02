

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Para obtener el parámetro de la URL
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle } from "@ionic/react";
import QRCode from "qrcode"; // Librería para generar el QR
import { getParkings, solicitarEspacio } from "../../../services/AuthServices"; // Usamos estas funciones de AuthServices

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
      <style>
        {`
          body {
            font-family: 'Roboto', sans-serif;
          }

          .detail-card {
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 90%;
          }

          .detail-card h3 {
            font-size: 1.4em;
            margin-bottom: 10px;
            color: #007bff;
            text-align: center;
          }

          .detail-card p {
            font-size: 1em;
            margin: 5px 0;
            color: #555;
          }

          .qr-container {
            text-align: center;
            margin-top: 20px;
          }

          .qr-container img {
            border: 2px solid #007bff;
            border-radius: 5px;
            padding: 10px;
          }

          .buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }

          .buttons .ion-button {
            flex: 1;
            margin: 0 5px;
            padding: 10px;
            border-radius: 5px;
            font-size: 1em;
            font-weight: bold;
            color: white;
            background-color: #007bff;
            transition: background-color 0.3s ease, transform 0.2s ease;
          }

          .buttons .ion-button:hover {
            background-color: #0056b3;
            transform: scale(1.05);
          }

          .status {
            font-size: 1.2em;
            font-weight: bold;
            margin: 10px 0;
          }

          .status.available {
            color: #4caf50;
          }

          .status.occupied {
            color: #f44336;
          }
        `}
      </style>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Detalles del Estacionamiento</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {parkingDetails ? (
          <IonCard className="detail-card">
            <IonCardHeader>
              <IonCardTitle>Detalles del Estacionamiento</IonCardTitle>
            </IonCardHeader>
            <div>
              <p>{`Espacio: ${parkingDetails.number}`}</p>
              <p>{`Sección: ${parkingDetails.section}`}</p>
              <p className={`status ${parkingDetails.occupiedBy ? 'occupied' : 'available'}`}>
                {`Estado: ${parkingDetails.occupiedBy ? "Ocupado" : "Disponible"}`}
              </p>
              {parkingDetails.occupiedBy && (
                <div>
                  <p>{`Ocupado por: ${parkingDetails.occupiedBy.UserName}`}</p>
                  <p>{`Correo: ${parkingDetails.occupiedBy.UserEmail}`}</p>
                </div>
              )}
            </div>

            {/* Mostrar el código QR solo si el estacionamiento está disponible */}
            {parkingDetails.occupiedBy === null && qrCodeImage && (
              <div className="qr-container">
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
