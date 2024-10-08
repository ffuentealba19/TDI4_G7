import React, { useEffect, useState } from 'react';
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
  IonBackButton,
  IonLoading,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../../services/AuthServices'; // Asegúrate de que la función esté importada
import './EditProfile.css';

const EditProfile: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('/assets/profile-placeholder.png'); // Ruta de la imagen por defecto
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(); // Obtiene los datos del perfil
        setName(response.UserName);
        setEmail(response.UserEmail);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    setUpdating(true);
    try {
      await updateUserProfile({ UserName: name, UserEmail: email }); // Llama a la API para actualizar
      alert('Cambios guardados');
      history.push('/perfil'); // Redirige al perfil después de guardar
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
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

  if (loading) {
    return <IonLoading isOpen={loading} message="Cargando..." />;
  }

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

        <IonButton expand="block" className="ion-margin-top" onClick={handleSave} disabled={updating}>
          {updating ? 'Guardando...' : 'Guardar Cambios'}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
