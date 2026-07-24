import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyB8SB-GZiR-Q76sx-VTg0JtkiBmqUTqIiM",

  authDomain: "cimerx-10ea2.firebaseapp.com",

  projectId: "cimerx-10ea2",

  storageBucket: "cimerx-10ea2.firebasestorage.app",

  messagingSenderId: "6223214966",

  appId: "1:6223214966:web:088e36fcf6eca1beb4e257",

  measurementId: "G-J3QZ70NZZ6"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ==============================
// RANDOM CODE
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
// CREATE SHORT
// ==============================

export async function createShort(originalURL){

    let code;

    while(true){

        code = randomCode();

        const check = await getDoc(
            doc(db,"shortlinks",code)
        );

        if(!check.exists()){

            break;

        }

    }

    await setDoc(

        doc(db,"shortlinks",code),

        {

            // URL DISIMPAN APA ADANYA
            url: originalURL,

            created: Date.now(),

            clicks: 0

        }

    );

    return code;

}

// ==============================
// GET SHORT
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

// ==============================
// ADD CLICK
// ==============================

export async function addClick(code){

    try{

        await updateDoc(

            doc(db,"shortlinks",code),

            {

                clicks: increment(1)

            }

        );

    }catch(e){

        console.log(e);

    }

}
