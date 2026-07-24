import { createShort } from "./firebase.js";

const API_KEY = "CIMEMEX";

// ======================
// LOGIN
// ======================

const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const apikey = document.getElementById("apikey");
const loginStatus = document.getElementById("loginStatus");

// ======================
// DASHBOARD
// ======================

const url = document.getElementById("url");
const start = document.getElementById("start");

const loading = document.getElementById("loading");
const result = document.getElementById("result");

const shortBox = document.getElementById("short");
const markdownBox = document.getElementById("markdown");

const copyShort = document.getElementById("copyShort");
const copyMarkdown = document.getElementById("copyMarkdown");

const toast = document.getElementById("toast");

// Preview

const preview = document.getElementById("preview");

const previewImage = document.getElementById("previewImage");

const favicon = document.getElementById("favicon");

const title = document.getElementById("title");

const description = document.getElementById("description");

// ======================
// TOAST
// ======================

function showToast(text){

    toast.innerHTML = text;

    toast.style.display = "block";

    setTimeout(()=>{

        toast.style.display = "none";

    },2000);

}

// ======================
// TOAST
// ======================

function showToast(text){

    toast.innerHTML = text;

    toast.style.display = "block";

    setTimeout(()=>{

        toast.style.display = "none";

    },2000);

}

// ======================
// CLEAN HYPER TEXT
// ======================

function cleanHyperText(url){

    return url
        .replace(/^https?:\/\/www\./i,"https://")
        .replace(/^https?:\/\/[^\/]*roblox[^\/]*\/games/i,"https://roblox.com/games");

}

// ======================
// LOGIN
// ======================

function openDashboard(){

    loginPage.style.display = "none";

    dashboard.style.display = "flex";

    sessionStorage.setItem("login","true");

}

function openLogin(){

    dashboard.style.display = "none";

    loginPage.style.display = "flex";

}

if(sessionStorage.getItem("login")==="true"){

    openDashboard();

}

loginBtn.addEventListener("click",()=>{

    if(apikey.value.trim()!==API_KEY){

        loginStatus.innerHTML="❌ API Key Salah";

        loginStatus.style.color="#ff4444";

        return;

    }

    loginStatus.innerHTML="✅ Login Berhasil";

    loginStatus.style.color="#00ff88";

    openDashboard();

});

logoutBtn.addEventListener("click",()=>{

    sessionStorage.removeItem("login");

    apikey.value="";

    openLogin();

});
// ======================
// CLEAN URL
// ======================

function cleanURL(text){

    if(!text) return "";

    text = text.trim();

    // Ambil URL jika ada teks lain
    const match = text.match(/https?:\/\/[^\s]+/i);

    if(match){

        text = match[0];

    }

    // Jika tidak ada https:// tetapi ada roblox.com
    if(!text.startsWith("http") && text.includes("roblox.com")){

        text = "https://" + text;

    }

    // Hapus www.
    text = text.replace(/^https?:\/\/www\./i,"https://");

    // Paksa menjadi roblox.com
    const games = text.match(/\/games\/.+/i);

    if(games){

        text = "https://roblox.com" + games[0];

    }

    return text;

}

// ======================
// VALIDASI
// ======================

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

// ======================
// PREVIEW SEMENTARA
// ======================

function showPreview(link){

    preview.style.display = "block";

    previewImage.src =
    "https://tr.rbxcdn.com/180DAY-4db6fb3e4b7d182d4c6d2d77d3b8e0c8/768/432/Image/Webp/noFilter";

    favicon.src =
    "https://www.roblox.com/favicon.ico";

    title.textContent = "Roblox";

    description.textContent = link;

}

// ======================
// START
// ======================

start.addEventListener("click",async()=>{

    let original = cleanURL(url.value);

    url.value = original;

    if(!original.startsWith("https://")){

        showToast("URL tidak valid");

        return;

    }

    loading.style.display = "block";

    result.style.display = "none";

    preview.style.display = "none";

    start.disabled = true;

    try{

        const code = await createShort(original);

        const short =
        "https://condogames.my.id/" + code;

        shortBox.value = short;

       const hyperText = cleanHyperText(original);

       markdownBox.value = `[${hyperText}] (${short})`;

        showPreview(original);

        result.style.display = "block";

        showToast("Short Link berhasil dibuat");

    }catch(err){

        console.log(err);

        showToast("Gagal membuat Short Link");

    }

    loading.style.display = "none";

    validate();

});
// ======================
// COPY SHORT LINK
// ======================

copyShort.addEventListener("click", async () => {

    if (!shortBox.value) {
        showToast("Belum ada Short Link");
        return;
    }

    try {

        await navigator.clipboard.writeText(shortBox.value);

    } catch {

        shortBox.select();

        document.execCommand("copy");

    }

    showToast("Short Link berhasil disalin");

});

// ======================
// COPY HYPER LINK
// ======================

copyMarkdown.addEventListener("click", async () => {

    if (!markdownBox.value) {
        showToast("Belum ada Hyper Link");
        return;
    }

    try {

        await navigator.clipboard.writeText(markdownBox.value);

    } catch {

        markdownBox.select();

        document.execCommand("copy");

    }

    showToast("Hyper Link berhasil disalin");

});

// ======================
// ENTER
// ======================

document.addEventListener("keydown",(e)=>{

    if(e.key !== "Enter") return;

    if(loginPage.style.display !== "none"){

        loginBtn.click();

        return;

    }

    if(!start.disabled){

        start.click();

    }

});

// ======================
// RESET
// ======================

function resetForm(){ 
  
    loading.style.display = "none";

    result.style.display = "none";

    preview.style.display = "none";

}

resetForm();

validate();

// ======================
// AUTO FOCUS
// ======================

window.addEventListener("load",()=>{

    if(sessionStorage.getItem("login")==="true"){

        url.focus();

    }else{

        apikey.focus();

    }

});

// ======================
// LOGOUT
// ======================

logoutBtn.addEventListener("click",()=>{

    sessionStorage.removeItem("login");

    result.style.display = "none";

    preview.style.display = "none";

    shortBox.value = "";

    markdownBox.value = "";

    url.value = "";

    apikey.value = "";

    loginStatus.innerHTML = "";

    openLogin();

});

// ======================
// INIT
// ======================

validate();
