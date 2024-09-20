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
          <IonTitle>Mejorar Suscripción</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <Swiper spaceBetween={50} slidesPerView={1} pagination={{ clickable: true }}>
          {/* Plan Normal */}
          <SwiperSlide>
            <IonCard className="plan-card normal-plan">
              <IonCardHeader>
                <IonCardTitle>Plan Normal</IonCardTitle>
                <IonCardSubtitle>FREE</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <ul>
                  <li><del>Acceso VIP a eventos</del></li>
                  <li><del>Soporte prioritario</del></li>
                  <li><del>Descuentos exclusivos</del></li>
                  <li>Acceso básico a la plataforma</li>
                </ul>
                <IonButton expand="full" color="primary">Seleccionar</IonButton>
              </IonCardContent>
            </IonCard>
          </SwiperSlide>

          {/* Plan VIP */}
          <SwiperSlide>
            <IonCard className="plan-card vip-plan">
              <IonCardHeader>
                <IonCardTitle>Plan VIP</IonCardTitle>
                <IonCardSubtitle>$5 / mes</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <ul>
                  <li>Acceso VIP a eventos</li>
                  <li><del>Soporte prioritario</del></li>
                  <li>Descuentos exclusivos</li>
                  <li>Acceso básico a la plataforma</li>
                </ul>
                <IonButton expand="full" color="success">Seleccionar</IonButton>
              </IonCardContent>
            </IonCard>
          </SwiperSlide>

          {/* Plan VIP+ */}
          <SwiperSlide>
            <IonCard className="plan-card vip-plus-plan">
              <IonCardHeader>
                <IonCardTitle>Plan VIP+</IonCardTitle>
                <IonCardSubtitle>
                  <del>$10 / mes</del> <strong>$8 / mes</strong> <span className="offer-label">¡Oferta!</span>
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <ul>
                  <li>Acceso VIP a eventos</li>
                  <li>Soporte prioritario</li>
                  <li>Descuentos exclusivos</li>
                  <li>Acceso básico a la plataforma</li>
                </ul>
                <IonButton expand="full" color="tertiary">Seleccionar</IonButton>
              </IonCardContent>
            </IonCard>
          </SwiperSlide>
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default UpgradeSubscription;
