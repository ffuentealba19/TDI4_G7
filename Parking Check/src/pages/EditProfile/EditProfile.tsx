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
import { getUserProfile, updateUserProfile, uploadImage } from '../../services/AuthServices'; // Asegúrate de que las funciones estén importadas
import './EditProfile.css';

const EditProfile: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('/assets/profile-placeholder.png'); // Ruta de la imagen por defecto
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null); // Almacena la nueva imagen

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(); // Obtiene los datos del perfil
        setName(response.UserName);
        setEmail(response.UserEmail);
        setProfileImage(response.profileImage || '/assets/profile-placeholder.png'); // Establece la imagen de perfil
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
      // Si hay una nueva imagen, la sube primero
      if (newImage) {
        const imageUrl = await uploadImage(newImage); // Sube la imagen y obtiene la URL
        await updateUserProfile({ UserName: name, UserEmail: email, profileImage: imageUrl }); // Actualiza el perfil con la URL de la imagen
      } else {
        await updateUserProfile({ UserName: name, UserEmail: email }); // Actualiza el perfil sin cambiar la imagen
      }
      // Redirige al perfil y actualiza la pagina profile
      history.push('/profile');
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
        setNewImage(file); // Guarda el archivo de la nueva imagen
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
