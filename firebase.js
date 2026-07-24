// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
getFirestore,
collection,
doc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {

apiKey: "AIzaSyB8SB-GZiR-Q76sx-VTg0JtkiBmqUTqIiM",

authDomain: "cimerx-10ea2.firebaseapp.com",

projectId: "cimerx-10ea2",

storageBucket: "cimerx-10ea2.firebasestorage.app",

messagingSenderId: "6223214966",

appId: "1:6223214966:web:088e36fcf6eca1beb4e257"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db, doc, setDoc, getDoc, collection };