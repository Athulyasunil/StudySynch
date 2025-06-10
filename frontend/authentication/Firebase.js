// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvnRj-6AH9_hP0qyNCSeSTFDaE9dk2Ehc",
  authDomain: "studysynch-658d1.firebaseapp.com",
  projectId: "studysynch-658d1",
  storageBucket: "studysynch-658d1.firebasestorage.app",
  messagingSenderId: "824293755",
  appId: "1:824293755:web:f27bd36f580bba136525de",
  measurementId: "G-GMK6XV5V37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);