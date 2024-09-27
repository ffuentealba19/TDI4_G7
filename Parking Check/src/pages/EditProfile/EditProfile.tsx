import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonAvatar,
  IonButtons,
  IonBackButton
} from '@ionic/react';
import './EditProfile.css';

const EditProfile: React.FC = () => {
  const [name, setName] = useState('Luis Felipe Ortega Curillan');
  const [email, setEmail] = useState('lortega2020@alu.uct.cl');
  const [profileImage, setProfileImage] = useState('/assets/profile-placeholder.png'); // Ruta de la imagen por defecto

  const handleSave = () => {
    // Aquí puedes añadir la lógica para guardar los cambios en el servidor
    alert('Cambios guardados');
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
          <IonTitle>Editar Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="profile-header">
          <IonAvatar className="profile-avatar">
            <img src={profileImage} alt="Profile" />
          </IonAvatar>

          <IonButton color="medium" expand="block" onClick={() => document.getElementById('profileImageInput')?.click()}>
            Cambiar Foto de Perfil
          </IonButton>
          <input
            type="file"
            id="profileImageInput"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </div>

        <IonItem>
          <IonLabel position="floating">Nombre</IonLabel>
          <IonInput value={name} onIonChange={(e) => setName(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Correo Electrónico</IonLabel>
          <IonInput type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} />
        </IonItem>

        <IonButton expand="block" className="ion-margin-top" onClick={handleSave}>
          Guardar Cambios
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
