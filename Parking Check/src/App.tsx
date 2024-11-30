// src/App.tsx
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
import { logOut,home, person, homeOutline, alertCircleOutline } from 'ionicons/icons';

/* Paginas */
import Tab1 from './pages/Tab1';
import OperatorLogin from './pages/Operario/loginOperario/Operario';
import Profile from './pages/profile/profile';
import LoginRegister from './pages/LoginRegister/LoginRegister';
import Invited from './pages/invited/invited';
import ForgotPassword from './pages/olvido_pass/ForgotPassword';
import Home from './pages/Home/Home';
import ReportProblem from './pages/ReportProblem/ReportProblem';
import EditProfile from './pages/EditProfile/EditProfile';
import UpgradeSubscription from './pages/Subscriptions/UpgradeSubscription';
import Vehiculos from './pages/vehiculo/vehiculo';
import AgregarVehiculo from './pages/vehiculo/agregarvehiculo';
import EditarVehiculo from './pages/vehiculo/editarvehiculo'; // Asegúrate de importar el componente correcto
import Solicitud from './pages/solicitud/solicitud';
import CodigoQr from './pages/solicitud/codigoqr';
import PaymentPage from './pages/Pagos/pagos';
import ReservasPage from './pages/Reserva/reservas';
import UpdateParking from './pages/Parking/UpdateParking';
import HomeOperario from './pages/Operario/HomeOperario/HomeOperario';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Importar el AuthProvider */
import { getToken } from './services/AuthServices';
import { AuthProvider } from './context/authcontext'; // Importar el AuthProvider
import { logout } from './services/AuthServices'

setupIonicReact();

const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
}



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
  <AuthProvider>
    <IonApp>
      <IonReactRouter>
        <IonMenu side="end" contentId="main">
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Menu</IonTitle>
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
            <IonItem button onClick={logout} routerLink='/login'>
              <IonIcon icon={logOut} slot="start" />
              <IonLabel>Cerrar sesión</IonLabel>
            </IonItem>
          </IonContent>
        </IonMenu>

        {/* Rutas principales */}
        <IonRouterOutlet id="main">
          {isAuthenticated() ? (
            <IonTabs>
              {/* Rutas privadas */}
              <IonRouterOutlet>
                <PrivateRoute exact path="/edit-profile">
                  <EditProfile />
                </PrivateRoute>
                <PrivateRoute exact path="/upgrade-subscription">
                  <UpgradeSubscription />
                </PrivateRoute>
                <PrivateRoute exact path="/tab1">
                  <Tab1 />
                </PrivateRoute>
                <PrivateRoute exact path="/home-operario">
                  <HomeOperario />
                </PrivateRoute>
                <PrivateRoute exact path="/solicitud">
                  <Solicitud />
                </PrivateRoute>
                <PrivateRoute exact path="/reserva">
                  <ReservasPage />
                </PrivateRoute>
                <PrivateRoute path="/profile">
                  <Profile />
                </PrivateRoute>
                <PrivateRoute path="/update-parking">
                  <UpdateParking />
                </PrivateRoute>
                <PrivateRoute path="/codigoqr">
                  <CodigoQr />
                </PrivateRoute>
                <PrivateRoute path="/pagos">
                  <PaymentPage />
                </PrivateRoute>
                <PrivateRoute path="/agregarvehiculo">
                  <AgregarVehiculo />
                </PrivateRoute>
                <PrivateRoute path="/home">
                  <Home />
                </PrivateRoute>
                <PrivateRoute path="/report-problem">
                  <ReportProblem />
                </PrivateRoute>
                <PrivateRoute path="/autos">
                  <Vehiculos />
                </PrivateRoute>
                <PrivateRoute path="/editarvehiculo/:id">
                  <EditarVehiculo />
                </PrivateRoute>
              </IonRouterOutlet>
              {/* Barra de pestañas */}
              <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/home">
                  <IonIcon aria-hidden="true" icon={home} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="Profile" href="/profile">
                  <IonIcon aria-hidden="true" icon={person} />
                  <IonLabel>Perfil</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          ) : (
            <IonRouterOutlet>
              {/* Rutas públicas */}
              <Route exact path="/login">
                <LoginRegister />
              </Route>
              <Route exact path="/operario-login">
                <OperatorLogin />
              </Route>
              <Route exact path="/invited">
                <Invited />
              </Route>
              <Route exact path="/ForgotPassword">
                <ForgotPassword />
              </Route>
              <Route exact path="/" render={() => <Redirect to="/login" />} />
            </IonRouterOutlet>
          )}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </AuthProvider>
);

export default App;
