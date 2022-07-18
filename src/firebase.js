// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfmc8FOEZRUm6qfIiQ7pRsywb6MA7jiKA",
  authDomain: "whatsapp-8a6f5.firebaseapp.com",
  projectId: "whatsapp-8a6f5",
  storageBucket: "whatsapp-8a6f5.appspot.com",
  messagingSenderId: "334596234121",
  appId: "1:334596234121:web:4afb96428d20a963ce5f58",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const myAuth = () => {
  return getAuth();
};
export { provider, myAuth };
