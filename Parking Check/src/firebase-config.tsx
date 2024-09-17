// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjWfkYjsICZzIp_voypDQu81uXPRj_Sf4",
  authDomain: "qqwe-27e16.firebaseapp.com",
  projectId: "qqwe-27e16",
  storageBucket: "qqwe-27e16.appspot.com",
  messagingSenderId: "144606064356",
  appId: "1:144606064356:web:0f2b88b187de216220c6f1",
  measurementId: "G-FX2FDGLDYP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
export { auth, provider };