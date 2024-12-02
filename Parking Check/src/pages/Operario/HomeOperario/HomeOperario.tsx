import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonButton,
  IonToast,
  IonSegment,
  IonSegmentButton,
  IonModal
} from "@ionic/react";
import QRCode from "qrcode"; // Importa la librería qrcode
import { getAvailableSpots, getParkings, logoutOperator } from "../../../services/AuthServices";
import { useHistory } from "react-router";

const HomeOperario: React.FC = () => {
  const history = useHistory();
  const [availableSpots, setAvailableSpots] = useState(0);
  const [parkings, setParkings] = useState<any[]>([]);
  const [parkingsBySection, setParkingsBySection] = useState<Record<string, any[]>>({});
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedParking, setSelectedParking] = useState<any>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);

  // Cargar información inicial
  useEffect(() => {
    fetchAvailableSpots();
    fetchParkings();
  }, []);

  // Organizar estacionamientos por secciones
  useEffect(() => {
    organizeBySection();
  }, [parkings]);

  const fetchAvailableSpots = async () => {
    try {
      const spots = await getAvailableSpots();
      setAvailableSpots(spots);
    } catch (error) {
      console.error("Error al obtener los espacios disponibles:", error);
      setToastMessage("Error al cargar espacios disponibles");
      setShowToast(true);
    }
  };

  const fetchParkings = async () => {
    try {
      const data = await getParkings(); // Obtener estacionamientos con los detalles del usuario
      setParkings(data);
    } catch (error) {
      console.error("Error al obtener estacionamientos:", error);
      setToastMessage("Error al cargar estacionamientos");
      setShowToast(true);
    }
  };

  const organizeBySection = () => {
    const grouped = parkings.reduce((acc: Record<string, any[]>, parking) => {
      const section = parking.section || "Sin Sección";
      if (!acc[section]) acc[section] = [];
      acc[section].push(parking);
      return acc;
    }, {});
    setParkingsBySection(grouped);

    // Inicializar todas las secciones como colapsadas
    const initialCollapsedState = Object.keys(grouped).reduce(
      (acc, section) => ({ ...acc, [section]: true }),
      {}
    );
    setCollapsedSections(initialCollapsedState);
  };

  const toggleSection = (section: string) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleOpenModal = (parking: any) => {
    setSelectedParking(parking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedParking(null);
    setQrCodeImage(null); // Limpiar el QR cuando se cierra el modal
  };

  const logout = async () => {
    try {
      await logoutOperator();
      history.push("/login");
      window.location.reload();
    } catch (error: any) {
      setToastMessage(error.message || "Error al cerrar sesión");
      setShowToast(true);
    }
  };

  const handleAssignParking = async () => {
    if (selectedParking) {
      try {
        // Lógica para asignar el estacionamiento (puede ser una llamada a la API)
        // await assignParking(selectedParking._id);

        // Generar el código QR para el estacionamiento asignado
        const qrData = JSON.stringify({
          parkingId: selectedParking._id,
          parkingNumber: selectedParking.number,
        });

        // Generar el QR como una URL de imagen
        QRCode.toDataURL(qrData, { width: 200 }, (err, url) => {
          if (err) {
            console.error("Error al generar QR:", err);
          } else {
            setQrCodeImage(url); // Guardar la URL del QR en el estado
            setToastMessage("Estacionamiento asignado correctamente");
            setShowToast(true);

            handleCloseModal(); // Cierra el modal después de asignar
          }
        });
      } catch (error) {
        setToastMessage("Error al asignar el estacionamiento");
        setShowToast(true);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Operario</IonTitle>
          <IonButton
            slot="end"
            color="danger"
            onClick={() => {
              logout();
            }}
          >
            Cerrar Sesión
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Resumen</IonCardTitle>
          </IonCardHeader>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonLabel>Espacios Disponibles:</IonLabel>
                <IonTitle>{availableSpots}</IonTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>

        <IonCard color={"primary"}>
          <IonSegment
            onIonChange={(e) => setFilter(e.detail.value! as string)}
            value={filter}
          >
            <IonSegmentButton value="all">Todos</IonSegmentButton>
            <IonSegmentButton value="available">Disponibles</IonSegmentButton>
            <IonSegmentButton value="occupied">Ocupados</IonSegmentButton>
          </IonSegment>
        </IonCard>

        {Object.keys(parkingsBySection).map((section) => (
          <IonCard key={section}>
            <IonCardHeader
              style={{ cursor: "pointer" }}
              onClick={() => toggleSection(section)}
            >
              <IonCardTitle>
                Sección {section} ({parkingsBySection[section].length} espacios)
              </IonCardTitle>
            </IonCardHeader>
            {!collapsedSections[section] && (
              <IonGrid>
                <IonRow>
                  {parkingsBySection[section]
                    .filter((parking) => {
                      if (filter === "available") return !parking.occupiedBy;
                      if (filter === "occupied") return parking.occupiedBy;
                      return true;
                    })
                    .map((parking) => (
                      <IonCol key={parking._id} size="4">
                        <div
                          style={{
                            backgroundColor: parking.occupiedBy ? "red" : "green",
                            color: "#fff",
                            textAlign: "center",
                            padding: "10px",
                            borderRadius: "8px",
                            margin: "5px",
                          }}
                          onClick={() => handleOpenModal(parking)}
                        >
                          <h3>{`Espacio ${parking.number}`}</h3>
                          <p>{parking.occupiedBy ? "Ocupado" : "Disponible"}</p>
                        </div>
                      </IonCol>
                    ))}
                </IonRow>
              </IonGrid>
            )}
          </IonCard>
        ))}

        <IonModal isOpen={showModal} onDidDismiss={handleCloseModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Detalles del Espacio</IonTitle>
              <IonButton slot="end" onClick={handleCloseModal}>
                Cerrar
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {selectedParking && (
              <div>
                <h2>{`Espacio ${selectedParking.number}`}</h2>
                <p>{`Sección: ${selectedParking.section}`}</p>
                <p>
                  {`Estado: ${
                    selectedParking.occupiedBy ? "Ocupado" : "Disponible"
                  }`}
                </p>
                {selectedParking.occupiedBy && (
                  <div>
                    <p>{`Ocupado por: ${selectedParking.occupiedBy.name}`}</p>
                    <p>{`Correo: ${selectedParking.occupiedBy.email}`}</p>
                  </div>
                )}

                <IonButton
                  color="danger"
                  onClick={() => {
                    // Lógica para liberar espacio
                    handleCloseModal();
                  }}
                >
                  Liberar
                </IonButton>

                {!selectedParking.occupiedBy && (
                  <IonButton color="success" onClick={handleAssignParking}>
                    Asignar
                  </IonButton>
                )}

                {/* Mostrar el código QR cuando el estacionamiento se ha asignado */}
                {qrCodeImage && (
                  <div style={{ marginTop: '20px' }}>
                    <h3>Escanee este código QR para confirmar la asignación:</h3>
                    <img src={qrCodeImage} alt="QR Code" width={200} />
                  </div>
                )}
              </div>
            )}
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default HomeOperario;
