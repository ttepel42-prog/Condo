// ==============================
// Firebase SDK
// ==============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// ==============================
// Firebase Config
// ==============================

const firebaseConfig = {

    apiKey: "AIzaSyB8SB-GZiR-Q76sx-VTg0JtkiBmqUTqIiM",

    authDomain: "cimerx-10ea2.firebaseapp.com",

    projectId: "cimerx-10ea2",

    storageBucket: "cimerx-10ea2.firebasestorage.app",

    messagingSenderId: "6223214966",

    appId: "1:6223214966:web:088e36fcf6eca1beb4e257",

    measurementId: "G-J3QZ70NZZ6"

};

// ==============================
// Init Firebase
// ==============================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ==============================
// Random Code
// ==============================

function randomCode(length = 6){

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for(let i=0;i<length;i++){

        result += chars.charAt(
            Math.floor(Math.random()*chars.length)
        );

    }

    return result;

}

// ==============================
// Simpan Short Link
// ==============================

export async function createShort(url){

    let code = randomCode();

    while(true){

        const check = await getDoc(
            doc(db,"shortlinks",code)
        );

        if(!check.exists()){

            break;

        }

        code = randomCode();

    }

    await setDoc(

        doc(db,"shortlinks",code),

        {

            url:url,

            created:Date.now(),

            clicks:0

        }

    );

    return code;

}

// ==============================
// Ambil Data
// ==============================

export async function getShort(code){

    const snap = await getDoc(
        doc(db,"shortlinks",code)
    );

    if(!snap.exists()){

        return null;

    }

    return snap.data();

}