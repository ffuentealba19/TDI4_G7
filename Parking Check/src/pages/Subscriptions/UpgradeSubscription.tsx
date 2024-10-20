import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButtons,
  IonIcon,
  IonBackButton,
} from '@ionic/react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import './UpgradeSubscription.css';

const UpgradeSubscription: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot='start'>
            <IonIcon/>
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
          <IonTitle>Parking Check</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <Swiper spaceBetween={50} slidesPerView={1} pagination={{ clickable: true }}>
          {/* Plan Normal */}
          <SwiperSlide>
            <IonCard className="plan-card normal-plan">
              <IonCardHeader>
                <IonCardTitle>Plan Básico</IonCardTitle>
                <IonCardSubtitle>GRATIS</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <ul>
                  <li><del>Reserva Anticipada de Estacionamientos</del></li>
                  <li><del>Reserva Prioritaria</del></li>
                  <li><del>Servicios Adicionales</del></li>
                  <li>Acceso básico a la plataforma</li>
                </ul>
                <IonButton expand="full" color="primary">Seleccionar</IonButton>
              </IonCardContent>
            </IonCard>
          </SwiperSlide>

          {/*Plan Preferencial*/}
          <SwiperSlide>
            <IonCard className="plan-card preferencial-plan">
              <IonCardHeader>
                <IonCardTitle>Plan Preferencial</IonCardTitle>
                <IonCardSubtitle>Autorizacion Especial</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <ul>
                  <li>Reserva de Estacionamientos Preferenciales</li>
                  <li>Soporte Prioritario</li>
                  <li>Acceso Básico a la plataforma</li>
                </ul>
                <IonButton expand='full' color="secondary">Postular</IonButton>
              </IonCardContent>
            </IonCard>
          </SwiperSlide>

          {/* Plan VIP */}
          <SwiperSlide>
            <IonCard className="plan-card vip-plan">
              <IonCardHeader>
                <IonCardTitle>Plan VIP</IonCardTitle>
                <IonCardSubtitle>$5.000 CLP / mes</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <ul>
                    <li>Reserva Anticipada de Estacionamientos</li>
                    <li><del>Reserva Prioritaria</del></li>
                    <li><del>Servicios Adicionales</del></li>
                    <li>Acceso básico a la plataforma</li>
                </ul>
                <IonButton expand="full" color="success" routerLink='/pagos'>Seleccionar</IonButton>
              </IonCardContent>
            </IonCard>
          </SwiperSlide>

          {/* Plan VIP+ */}
          <SwiperSlide>
            <IonCard className="plan-card vip-plus-plan">
              <IonCardHeader>
                <IonCardTitle>Plan VIP+</IonCardTitle>
                <IonCardSubtitle>
                  <del>$10.000 CLP / mes</del> <strong>$8.000 CLP / mes</strong> <span className="offer-label">¡Oferta!</span>
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <ul>
                  <li>Reserva Anticipada de Estacionamientos</li>
                  <li>Reserva Prioritaria</li>
                  <li>Servicios Adicionales</li>
                  <li>Acceso básico a la plataforma</li>
                </ul>
                <IonButton expand="full" color="tertiary" routerLink='/pagos'>Seleccionar</IonButton>
              </IonCardContent>
            </IonCard>
          </SwiperSlide>

          
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default UpgradeSubscription;
