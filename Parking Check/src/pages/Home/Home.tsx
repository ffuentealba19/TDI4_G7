import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonMenuButton } from '@ionic/react';
import { mapOutline } from 'ionicons/icons';
import './Home.css';
import { useEffect, useState } from 'react';
import { auth,provider } from '../../firebase-config';
import { signInWithPopup, UserCredential } from 'firebase/auth';


const Home: React.FC = () => {

  const [value,setValue] = useState<String | null>(null);
  useEffect(() => {
    //ver si el susuario esta logeado
    setValue(localStorage.getItem('email'));
    }, []);
    const handleClick = async () => {
      signInWithPopup(auth, provider)
      .then((result: UserCredential) => {
        const user = result.user;
        setValue(user?.displayName);
        localStorage.setItem('email', user?.displayName || '');
      })
      .catch((error) => {
        console.log(error);
      });
    }
    const logout = () => {
      localStorage.clear();
      window.location.reload();
    }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonMenuButton slot="end" /> {/* El botón de menú va aquí */}
          <IonTitle>{value ? (
          "welcome " + value
        ):(
          "Please login"
        )} </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
      <div className="container">
          {value ? (
            <div>
            <h1>Welcome {value} you are logged in </h1>
            <IonButton onClick={logout}>logout</IonButton>
        </div>
          ):(
            <div>
              <h1>Welcome please login</h1>
              <IonButton onClick={handleClick}>Login with google</IonButton>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
