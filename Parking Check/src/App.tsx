import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle, person, homeOutline, alertCircleOutline } from 'ionicons/icons';
import { AuthProvider, useAuth } from './context/authcontext'; // Importa el AuthProvider

/* Páginas */
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Profile from './pages/profile/profile';
import LoginRegister from './pages/LoginRegister/LoginRegister';
import Invited from './pages/invited/invited';
import Home from './pages/Home/Home';
import ReportProblem from './pages/ReportProblem/ReportProblem';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const { user } = useAuth(); // Usar el contexto para acceder al estado del usuario

  return (
    <IonApp>
      <IonReactRouter>
        {/* Menú lateral */}
        <IonMenu side="end" contentId="main">
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Parking Check</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              {user && (  // Solo mostrar estos enlaces si el usuario está autenticado
                <>
                  <IonItem routerLink="/tab1">
                    <IonIcon icon={homeOutline} slot="start" />
                    <IonLabel>Asignación Estacionamiento</IonLabel>
                  </IonItem>
                  <IonItem routerLink="/profile">
                    <IonIcon icon={person} slot="start" />
                    <IonLabel>Mi Perfil</IonLabel>
                  </IonItem>
                  <IonItem routerLink="/report-problem">
                    <IonIcon icon={alertCircleOutline} slot="start" />
                    <IonLabel>Reportar un problema</IonLabel>
                  </IonItem>
                </>
              )}
            </IonList>
          </IonContent>
        </IonMenu>
        {/* Contenido principal y Tabs */}
        <IonRouterOutlet id="main">
          <IonTabs>
            <IonRouterOutlet>
              {/* Páginas que no requieren autenticación */}
              <Route exact path="/">
                <LoginRegister />
              </Route>
              <Route exact path="/invited">
                <Invited />
              </Route>
              {user ? (
                <>
                  <Route exact path="/tab1">
                    <Tab1 />
                  </Route>
                  <Route exact path="/tab2">
                    <Tab2 />
                  </Route>
                  <Route path="/profile">
                    <Profile />
                  </Route>
                  <Route path="/home">
                    <Home />
                  </Route>
                  <Route path="/report-problem">
                    <ReportProblem />
                  </Route>
                </>
              ) : (
                <Redirect to="/" />  // Redirigir si no está autenticado
              )}
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              {user && (
                <>
                  <IonTabButton tab="home" href="/home">
                    <IonIcon aria-hidden="true" icon={triangle} />
                    <IonLabel>Home</IonLabel>
                  </IonTabButton>

                  <IonTabButton tab="profile" href="/profile">
                    <IonIcon aria-hidden="true" icon={person} />
                    <IonLabel>Perfil</IonLabel>
                  </IonTabButton>
                </>
              )}
            </IonTabBar>
          </IonTabs>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
