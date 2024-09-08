import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle,person } from 'ionicons/icons';

/*paginas */ 
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Profile from './pages/profile';

import LoginRegister from './pages/LoginRegister/LoginRegister';

import Invited from './pages/invited/invited';

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

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          
          <Route exact path="/login">
            <LoginRegister />
          </Route>
          <Route exact path="/invited">
            <Invited />
          </Route>
          

          <Route exact path="/tab1">
            <Tab1 />
          </Route>
          <Route exact path="/tab2">
            <Tab2 />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">

          <IonTabButton tab="login" href="/login">
            <IonIcon aria-hidden="true" icon={triangle} />
            <IonLabel>login</IonLabel>
          </IonTabButton>

          <IonTabButton tab="SignUp" href="/SignUp">
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Register</IonLabel>
          </IonTabButton>

          <IonTabButton tab="Profile" href="/profile">
            <IonIcon aria-hidden="true" icon={person} />
            <IonLabel>Perfil</IonLabel>

          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
