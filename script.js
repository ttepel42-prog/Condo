import { createShort } from "./firebase.js";

const API_KEY = "CIMEMEX";

// =========================
// Login
// =========================

const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const apikey = document.getElementById("apikey");
const loginStatus = document.getElementById("loginStatus");

// =========================
// Dashboard
// =========================

const url = document.getElementById("url");
const start = document.getElementById("start");

const loading = document.getElementById("loading");

const result = document.getElementById("result");

const shortBox = document.getElementById("short");
const markdownBox = document.getElementById("markdown");

const copyShort = document.getElementById("copyShort");
const copyMarkdown = document.getElementById("copyMarkdown");

const toast = document.getElementById("toast");

// =========================
// Toast
// =========================

function showToast(text){

    toast.innerHTML = text;

    toast.style.display = "block";

    setTimeout(()=>{

        toast.style.display = "none";

    },2000);

}

// =========================
// Login
// =========================

function openDashboard(){

    loginPage.style.display="none";

    dashboard.style.display="block";

    sessionStorage.setItem("login","true");

}

function logout(){

    sessionStorage.removeItem("login");

    dashboard.style.display="none";

    loginPage.style.display="flex";

    apikey.value="";

}

if(sessionStorage.getItem("login")=="true"){

    openDashboard();

}

loginBtn.onclick=()=>{

    if(apikey.value===API_KEY){

        loginStatus.innerHTML="✅ Login Berhasil";

        loginStatus.style.color="#00ff88";

        openDashboard();

    }else{

        loginStatus.innerHTML="❌ API Key Salah";

        loginStatus.style.color="red";

    }

};

logoutBtn.onclick=logout;
// =========================
// Clean URL
// =========================

function cleanURL(text){

    if(!text) return "";

    text = text.trim();

    // Ambil URL jika ada teks lain
    const urlMatch = text.match(/https?:\/\/[^\s]+/i);

    if(urlMatch){

        text = urlMatch[0];

    }

    // Jika tidak ada https:// tetapi ada roblox.com
    if(!text.startsWith("http") && text.includes("roblox.com")){

        text = "https://" + text;

    }

    // Hapus www.
    text = text.replace(/^https?:\/\/www\./i,"https://");

    // Paksa domain menjadi roblox.com
    const games = text.match(/\/games\/.+/i);

    if(games){

        return "https://roblox.com" + games[0];

    }

    return text;

}

// =========================
// Validasi URL
// =========================

function validate(){

    const value = cleanURL(url.value);

    start.disabled = !value.startsWith("https://");

}

url.addEventListener("input",validate);

url.addEventListener("paste",()=>{

    setTimeout(()=>{

        url.value = cleanURL(url.value);

        validate();

    },50);

});

url.addEventListener("blur",()=>{

    url.value = cleanURL(url.value);

    validate();

});

// =========================
// START
// =========================

start.onclick = async()=>{

    let original = cleanURL(url.value);

    url.value = original;

    if(!original.startsWith("https://")){

        showToast("URL tidak valid");

        return;

    }

    loading.style.display = "block";

    result.style.display = "none";

    start.disabled = true;

    try{

        const code = await createShort(original);

        const short =
        "https://condogames.my.id/" + code;

        shortBox.value = short;

        markdownBox.value =
        `[${original}](${short})`;

        result.style.display = "block";

        showToast("Short Link berhasil dibuat");

    }catch(e){

        console.log(e);

        showToast("Terjadi kesalahan");

    }

    loading.style.display = "none";

    validate();

};
// =========================
// Copy Short Link
// =========================

copyShort.onclick = async()=>{

    try{

        await navigator.clipboard.writeText(shortBox.value);

        showToast("Short Link berhasil disalin");

    }catch{

        shortBox.select();

        document.execCommand("copy");

        showToast("Short Link berhasil disalin");

    }

};

// =========================
// Copy Hyper Link
// =========================

copyMarkdown.onclick = async()=>{

    try{

        await navigator.clipboard.writeText(markdownBox.value);

        showToast("Hyper Link berhasil disalin");

    }catch{

        markdownBox.select();

        document.execCommand("copy");

        showToast("Hyper Link berhasil disalin");

    }

};

// =========================
// Enter = Login / Start
// =========================

document.addEventListener("keydown",(e)=>{

    if(e.key !== "Enter") return;

    // Jika masih di halaman login
    if(loginPage.style.display !== "none"){

        loginBtn.click();

        return;

    }

    // Jika sudah di dashboard
    if(!start.disabled){

        start.click();

    }

});

// =========================
// Reset
// =========================

function reset(){

    loading.style.display = "none";

    result.style.display = "none";

    validate();

}

reset();

// =========================
// Auto Focus
// =========================

if(sessionStorage.getItem("login")=="true"){

    setTimeout(()=>{

        url.focus();

    },200);

}else{

    setTimeout(()=>{

        apikey.focus();

    },200);

}
