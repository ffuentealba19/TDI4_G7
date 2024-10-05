import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import React, {useEffect,useState} from 'react';
const Tab1: React.FC = () => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/data')
      .then(response => response.json())
      .then(data => setData(data.message))
      .catch(error => console.error('Error al obtener datos:', error));
  }, []);

  return(
    <div>
      <h1>Datos desde el backend</h1>
      <p>{data ? data: "cargando..."}</p>
    </div>
  );
};

export default Tab1;
