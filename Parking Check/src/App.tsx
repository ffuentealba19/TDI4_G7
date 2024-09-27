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
import ForgotPassword from './pages/olvido_pass/ForgotPassword';
import Home from './pages/Home/Home';
import ReportProblem from './pages/ReportProblem/ReportProblem';
import EditProfile from './pages/EditProfile';
import UpgradeSubscription from './pages/UpgradeSubscription';

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
            <Route exact path = "/ForgotPassword">
              <ForgotPassword />
            </Route>
            <Route exact path="/edit-profile">
            <EditProfile />
            </Route>
            <Route exact path="/upgrade-subscription">
               <UpgradeSubscription />
            </Route>

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
