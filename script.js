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

const preview = document.getElementById("preview");
const previewImage = document.getElementById("previewImage");
const favicon = document.getElementById("favicon");
const title = document.getElementById("title");
const description = document.getElementById("description");

const toast = document.getElementById("toast");

// ======================
// TOAST
// ======================

function showToast(text){

    toast.textContent = text;
    toast.style.display = "block";

    setTimeout(()=>{

        toast.style.display = "none";

    },2000);

}

// ======================
// HANYA UNTUK TEKS HYPER LINK
// URL ASLI TIDAK DIUBAH
// ======================

function cleanHyperText(link){

    try{

        const u = new URL(link);

        return "https*:*//roblox.com" + u.pathname + u.search;

    }catch{

        return link;

    }

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

loginBtn.onclick = ()=>{

    if(apikey.value.trim()!==API_KEY){

        loginStatus.textContent="❌ API Key Salah";
        loginStatus.style.color="red";

        return;

    }

    loginStatus.textContent="✅ Login Berhasil";
    loginStatus.style.color="#00ff88";

    openDashboard();

};

logoutBtn.onclick = ()=>{

    sessionStorage.removeItem("login");

    apikey.value="";

    openLogin();

};
// ======================
// VALIDASI
// ======================

function validate(){

    start.disabled = url.value.trim() === "";

}

url.addEventListener("input", validate);

// ======================
// PREVIEW
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

start.onclick = async()=>{

    const original = url.value.trim();

    if(original===""){

        showToast("Masukkan URL");

        return;

    }

    loading.style.display="block";

    result.style.display="none";

    preview.style.display="none";

    start.disabled=true;

    try{

        // URL ASLI DISIMPAN TANPA DIUBAH
        const code = await createShort(original);

        const short =
        "https://condogames.my.id/" + code;

        shortBox.value = short;

        // HANYA TEKS HYPER LINK YANG DIUBAH
        const hyperText = cleanHyperText(original);

        markdownBox.value =
        `[${hyperText}](${short})`;

        showPreview(original);

        result.style.display="block";

        showToast("Short Link berhasil dibuat");

    }catch(e){

        console.error(e);

        showToast("Gagal membuat Short Link");

    }

    loading.style.display="none";

    validate();

};
// ======================
// COPY SHORT LINK
// ======================

copyShort.onclick = async()=>{

    if(shortBox.value===""){

        showToast("Belum ada Short Link");

        return;

    }

    try{

        await navigator.clipboard.writeText(shortBox.value);

    }catch{

        shortBox.select();

        document.execCommand("copy");

    }

    showToast("Short Link berhasil disalin");

};

// ======================
// COPY HYPER LINK
// ======================

copyMarkdown.onclick = async()=>{

    if(markdownBox.value===""){

        showToast("Belum ada Hyper Link");

        return;

    }

    try{

        await navigator.clipboard.writeText(markdownBox.value);

    }catch{

        markdownBox.select();

        document.execCommand("copy");

    }

    showToast("Hyper Link berhasil disalin");

};

// ======================
// ENTER
// ======================

document.addEventListener("keydown",(e)=>{

    if(e.key!=="Enter") return;

    if(loginPage.style.display!=="none"){

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

    loading.style.display="none";

    result.style.display="none";

    preview.style.display="none";

    shortBox.value="";

    markdownBox.value="";

}

resetForm();

validate();

// ======================
// AUTO FOCUS
// ======================

window.onload=()=>{

    if(sessionStorage.getItem("login")==="true"){

        openDashboard();

        url.focus();

    }else{

        openLogin();

        apikey.focus();

    }

};

// ======================
// LOGOUT
// ======================

logoutBtn.onclick=()=>{

    sessionStorage.removeItem("login");

    apikey.value="";

    url.value="";

    shortBox.value="";

    markdownBox.value="";

    result.style.display="none";

    preview.style.display="none";

    loginStatus.textContent="";

    openLogin();

};
