// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAppY8rAhWKYRrTkgWo5vV6M02bHbIV9ag",
  authDomain: "my-blog-app-f14ca.firebaseapp.com",
  projectId: "my-blog-app-f14ca",
  storageBucket: "my-blog-app-f14ca.firebasestorage.app",
  messagingSenderId: "107055122785",
  appId: "1:107055122785:web:a8b5f80734db9961251d20",
  measurementId: "G-260WY4WZVW"
};
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics
// const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

// Initialize Firebase
const db = getFirestore(app);

export { auth, provider, db };
