// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB7H4xc49wXnbZI0d3uhn359YPmqnsqj9w",
    authDomain: "sketchfiniti.firebaseapp.com",
    projectId: "sketchfiniti",
    storageBucket: "sketchfiniti.appspot.com",
    messagingSenderId: "12438842631",
    appId: "1:12438842631:web:0755226d882cc1a92c29a2",
    measurementId: "G-8PD6XSWCX9",
    databaseURL: 'https://sketchfiniti-default-rtdb.firebaseio.com'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

const fstore = getFirestore(app);

const db = getDatabase(app);

export { fstore, app, analytics, db };