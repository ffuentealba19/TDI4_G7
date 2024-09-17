import { IonContent, IonHeader, IonPage, IonTitle , IonToolbar , IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonLabel, IonButton, IonNavLink, IonRouterLink } from '@ionic/react';
import './invited.css';

const Invited: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>PARKING CHEK</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding invited-content">
         
          <IonCard className="invited-card">
          <IonCardHeader>
            <IonCardTitle className="card-title">INVITADOS</IonCardTitle>
          </IonCardHeader> 
          <IonCardContent >
            <div className="invited-input-wrapper">
                  <IonInput type="text" placeholder="Ingrese su nombre" className="invited-input-field" clearInput={true}  ></IonInput>
                  <IonInput type="tel" placeholder="Ingrese su numero de Telefono" className="invited-input-field" clearInput={true}></IonInput>
                  <IonInput type="text" placeholder="Ingrese su patente" className="invited-input-field" clearInput={true}></IonInput>
                  <IonButton expand="block" className="invited-button">REGISTER</IonButton>
                  <div className="invited-guest-session">
                    <IonLabel>Ya tienes una cuenta o quieres una? </IonLabel><br></br>
                    <IonLabel color="primary" className="invited-guest-link" >
                       <IonRouterLink routerLink='/login'> Inicia sesion o registrate</IonRouterLink>
                    </IonLabel>
                  </div>
                  <br/>
            </div>
          </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Invited;