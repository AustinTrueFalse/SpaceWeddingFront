// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQCWDl1DxW3fiQAqgGOnTmnIAA0F_Rs48",
  authDomain: "spacewedding-1f048.firebaseapp.com",
  projectId: "spacewedding-1f048",
  storageBucket: "spacewedding-1f048.appspot.com",
  messagingSenderId: "907675737665",
  appId: "1:907675737665:web:82bdd25e9a6991a35c70c0",
  measurementId: "G-P8VM133YWJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
