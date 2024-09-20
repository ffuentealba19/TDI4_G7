import React from 'react';
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
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonMenu
} from '@ionic/react';

const perfil: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle color="light">
            PARKING CHECK
          </IonTitle>
          <IonButtons slot="end">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
            <IonMenu contentId="main-content">
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Menu Content</IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">This is the menu content.</IonContent>
            </IonMenu>

        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard className="ion-padding">
          <IonText className='ion-text-center'>
            <h2>MI PERFIL</h2>
          </IonText>
          <IonAvatar style={{ margin: '0 auto' }}>
            <img src="https://z-p3-scontent.fzco1-1.fna.fbcdn.net/v/t1.6435-9/30724703_10211886277014701_7427747709064314880_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=SF9jviTlDJUQ7kNvgG_sNG2&_nc_ht=z-p3-scontent.fzco1-1.fna&_nc_gid=A0-elPL04roPU_c-5x8xCnq&oh=00_AYCJf8q2PBTm6A6i0ZUSEh0yx6F56jbaxFMZe6hE-mNNug&oe=6704BF82" alt="User Avatar" />
          </IonAvatar>
          <IonText className="ion-text-center">
            <h3>Luis Felipe Ortega Curillan</h3>
            <p>lortega2020@alu.uct.cl</p>
            <p>Usuario estándar <a href="#">Mejorar suscripción!</a></p>
          </IonText>
          <IonButton expand="full" color="secondary" routerLink="/upgrade-subscription">
  Mejorar suscripción
</IonButton>

          <IonButton expand="block" color="medium" routerLink="/edit-profile"> 
              Editar Perfil
          </IonButton>

          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <IonCard>
                  <img src="https://img.yapo.cl/images/72/7299715193.jpg" alt="Car 1" />
                  <IonCardContent className="ion-text-center">BZ JS 66</IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard>
                  <img src="https://img.yapo.cl/images/72/7299715193.jpg" alt="Car 2" />
                  <IonCardContent className="ion-text-center">DK JS 32</IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonButton expand="block" color="danger">Cerrar sesión</IonButton>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default perfil;