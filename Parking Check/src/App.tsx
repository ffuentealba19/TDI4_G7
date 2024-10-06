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

/* Paginas */
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Profile from './pages/profile/profile';
import LoginRegister from './pages/LoginRegister/LoginRegister';
import Invited from './pages/invited/invited';
import ForgotPassword from './pages/olvido_pass/ForgotPassword';
import Home from './pages/Home/Home';
import ReportProblem from './pages/ReportProblem/ReportProblem';
import EditProfile from './pages/EditProfile/EditProfile';
import UpgradeSubscription from './pages/Subscriptions/UpgradeSubscription';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { getToken } from './services/AuthServices';

setupIonicReact();

const PrivateRoute: React.FC<any> = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        getToken() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      {getToken() && (
        /* Menú lateral */
        <IonMenu side="end" contentId="main">
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Parking Check</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
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
            </IonList>
          </IonContent>
        </IonMenu>
      )}

      {/* Contenido principal y Tabs */}
      <IonRouterOutlet id="main">
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/login">
              <LoginRegister />
            </Route>
            <Route exact path="/invited">
              <Invited />
            </Route>
            <Route exact path="/ForgotPassword">
              <ForgotPassword />
            </Route>
            
            {/* Rutas privadas */}
            <PrivateRoute exact path="/edit-profile">
              <EditProfile />
            </PrivateRoute>
            <PrivateRoute exact path="/upgrade-subscription">
              <UpgradeSubscription />
            </PrivateRoute>
            <PrivateRoute exact path="/tab1">
              <Tab1 />
            </PrivateRoute>
            <PrivateRoute exact path="/tab2">
              <Tab2 />
            </PrivateRoute>
            <PrivateRoute path="/profile">
              <Profile />
            </PrivateRoute>
            <PrivateRoute path="/home">
              <Home />
            </PrivateRoute>
            <PrivateRoute path="/report-problem">
              <ReportProblem />
            </PrivateRoute>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon aria-hidden="true" icon={triangle} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>

            <IonTabButton tab="Profile" href="/profile">
              <IonIcon aria-hidden="true" icon={person} />
              <IonLabel>Perfil</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
