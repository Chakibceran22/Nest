// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgAD4o_OJD_Zb_ceCBj2y1HVqdsdFAk9w",
  authDomain: "nest-5fb25.firebaseapp.com",
  projectId: "nest-5fb25",
  storageBucket: "nest-5fb25.firebasestorage.app",
  messagingSenderId: "1023553721076",
  appId: "1:1023553721076:web:c6236b96df92b36ef344a1",
  measurementId: "G-NX0LQSH1J3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);