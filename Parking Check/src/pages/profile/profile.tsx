import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonText,
  IonCardHeader,
  IonIcon,
} from '@ionic/react';
import './profile.css';
import { warning } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { logout, getUserProfile, getUserVehicles } from '../../services/AuthServices'; // Importa las funciones

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

const Perfil: React.FC = () => {
  const history = useHistory();
  const [userData, setUserData] = useState<any>(null); // Estado para almacenar los datos del usuario
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [profileImage, setProfileImage] = useState('/assets/profile-placeholder.png'); // Imagen por defecto del perfil
  const [vehiculos, setVehiculos] = useState<any[]>([]); // Estado para almacenar los vehículos

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener el perfil del usuario
        const profileResponse = await getUserProfile();
        setUserData(profileResponse); // Guardar los datos del perfil
        setProfileImage(profileResponse.profileImage); // Guardar la imagen de perfil

        // Obtener los vehículos del usuario
        const vehiculosResponse = await getUserVehicles();
        setVehiculos(vehiculosResponse); // Guardar los vehículos
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    history.push('/login');
    window.location.reload();
  };

  if (loading) {
    return <IonContent>Cargando...</IonContent>; // Pantalla de carga personalizada
  }

  if (!userData) {
    return <IonContent>Error al cargar los datos del perfil</IonContent>; // Manejo del error
  }

  // Mostrar diferentes mensajes dependiendo del plan del usuario
  const subscriptionMessage = () => {
    if (userData.Plan === 'VIP' || userData.Plan === 'VIP+') {
      return (
        <p>
          Usuario {userData.Plan}. <a href="/upgrade-subscription">Cancelar suscripción</a>
        </p>
      );
    }
    return (
      <p>
        Usuario {userData.Plan}. <a href="/upgrade-subscription">Mejorar suscripción!</a>
      </p>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle color="light">Parking Check</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonText className="ion-text-center">
            <h2>MI PERFIL</h2>
          </IonText>
          <IonAvatar style={{ width: '100px', height: '100px', margin: 'auto' }}>
            <img src={profileImage} alt="Profile" />
          </IonAvatar>
          <IonText className="ion-text-center">
            <h3>{userData.UserName}</h3>
            <p>{userData.UserEmail}</p>
            {/* Mostrar mensaje dependiendo del plan del usuario */}
            {subscriptionMessage()}
          </IonText>
        </IonCard>
        <IonCard className="button-card">
          <IonButton expand="block" color="medium" routerLink="/edit-profile">
            Editar Perfil
          </IonButton>
          <IonButton expand="block" color="danger" onClick={handleLogout}>
            Cerrar sesión
          </IonButton>
          <IonButton expand="block" color="primary" routerLink="/autos">
            Gestionar Vehículos
          </IonButton>
        </IonCard>
        <div className="vehiculos-container">
            {vehiculos.length > 0 ? (
              <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                loop={false}
                slidesPerView={'auto'}
                coverflowEffect={
                  {
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1
                  }
                }
                navigation={true}
                pagination={{ clickable: true }}
                modules={[EffectCoverflow, Pagination, Navigation]}

                className='swiper-container'
              >
                {vehiculos.map((vehiculo, index) => (
                  <SwiperSlide key={vehiculo._id}>
                    <IonCard
                      className={`vehiculo-card ${index !== 0 ? 'opacity-card' : ''}`}
                    >
                      <img
                        className="imagen"
                        width={'400px'}
                        src="https://img.yapo.cl/images/72/7299715193.jpg"
                        alt="car1"
                      />
                      <IonCardHeader>
                        <IonText className="ion-text-center">
                          <h1>{vehiculo.Placa}</h1>
                        </IonText>
                      </IonCardHeader>
                    </IonCard>
                  </SwiperSlide>
                ))}
                <div className="slider-controler">
                  <div className="swiper-pagination"></div>
                </div>
              </Swiper>
            ) : (
              <IonCard className="vehiculo-card">
                <IonText className="ion-text-center">
                  <IonIcon icon={warning} style={{ padding: 'auto', fontSize: '100px' }} />
                  <h2>No tienes vehículos registrados</h2>
                </IonText>
              </IonCard>
            )}
          </div>

          
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
