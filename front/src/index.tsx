import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/home/App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./contexts/AuthProvider";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMUN5qDVIbkitkixJCODKTjvI8c4B7gAU",
  authDomain: "pfe-kollection.firebaseapp.com",
  projectId: "pfe-kollection",
  storageBucket: "pfe-kollection.appspot.com",
  messagingSenderId: "692561494412",
  appId: "1:692561494412:web:4b9f543d5ddca3358516a9",
  measurementId: "G-VW1ZNYM6Y4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
    <AuthProvider>
      <App />
    </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
