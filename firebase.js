// ==========================
// Firebase SDK
// ==========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {

    getFirestore,

    doc,

    getDoc,

    setDoc,

    updateDoc,

    increment

} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// ==========================
// Firebase Config
// ==========================

const firebaseConfig = {

    apiKey: "AIzaSyB8SB-GZiR-Q76sx-VTg0JtkiBmqUTqIiM",

    authDomain: "cimerx-10ea2.firebaseapp.com",

    projectId: "cimerx-10ea2",

    storageBucket: "cimerx-10ea2.firebasestorage.app",

    messagingSenderId: "6223214966",

    appId: "1:6223214966:web:088e36fcf6eca1beb4e257",

    measurementId: "G-J3QZ70NZZ6"

};

// ==========================
// Init Firebase
// ==========================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ==========================
// Random Code
// ==========================

function randomCode(length = 6){

    const chars =

    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let code = "";

    for(let i=0;i<length;i++){

        code += chars.charAt(

            Math.floor(Math.random()*chars.length)

        );

    }

    return code;

}

// ==========================
// Create Short Link
// ==========================

export async function createShort(url){

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

            url:url,

            created:Date.now(),

            clicks:0

        }

    );

    return code;

}

// ==========================
// Get Short Link
// ==========================

export async function getShort(code){

    const snap = await getDoc(

        doc(db,"shortlinks",code)

    );

    if(!snap.exists()){

        return null;

    }

    return snap.data();

}

// ==========================
// Add Click
// ==========================

export async function addClick(code){

    try{

        await updateDoc(

            doc(db,"shortlinks",code),

            {

                clicks:increment(1)

            }

        );

    }catch(e){

        console.log(e);

    }

}

// ==========================
// Get Preview
// ==========================

export async function getPreview(url){

    return{

        title:"Roblox",

        description:url,

        image:"https://tr.rbxcdn.com/180DAY-4db6fb3e4b7d182d4c6d2d77d3b8e0c8/768/432/Image/Webp/noFilter",

        favicon:"https://www.roblox.com/favicon.ico"

    };

}