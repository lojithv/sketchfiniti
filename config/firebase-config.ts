// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
    measurementId: "G-8PD6XSWCX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);