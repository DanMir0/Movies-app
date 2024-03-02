import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD7v2D6JqoaOmWIefdBxlBA98YlHO82ADU",
    authDomain: "movies-app-fa38f.firebaseapp.com",
    databaseURL: "https://movies-app-fa38f-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "movies-app-fa38f",
    storageBucket: "movies-app-fa38f.appspot.com",
    messagingSenderId: "300372748855",
    appId: "1:300372748855:web:fe51b9906c3a889eb06db2",
    measurementId: "G-6R0BLC7PK0"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp, "gs://movies-app-fa38f.appspot.com");

export { db, storage }