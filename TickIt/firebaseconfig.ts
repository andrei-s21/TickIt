import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAtP0nK2ygIOfYk3NYr9N7EWqEzUCxct4g",
    authDomain: "tickit-da496.firebaseapp.com",
    databaseURL: "https://tickit-da496-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tickit-da496",
    storageBucket: "tickit-da496.firebasestorage.app",
    messagingSenderId: "776512297469",
    appId: "1:776512297469:web:532d5d9408d21a5abbe194",
    measurementId: "G-CVD5R9LMMM"
  };
  
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getDatabase(app);
  