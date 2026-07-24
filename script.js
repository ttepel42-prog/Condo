import { createShort } from "./firebase.js";

const API_KEY = "CIMEMEX";

const keyInput = document.getElementById("apikey");
const keyStatus = document.getElementById("keyStatus");

const urlInput = document.getElementById("url");

const startBtn = document.getElementById("start");

const loading = document.getElementById("loading");

const result = document.getElementById("result");

const shortBox = document.getElementById("short");

const markdownBox = document.getElementById("markdown");

const copyShort = document.getElementById("copyShort");

const copyMarkdown = document.getElementById("copyMarkdown");

const toast = document.getElementById("toast");

// ==========================
// Toast
// ==========================

function showToast(text){

    toast.innerHTML = text;

    toast.style.display = "block";

    setTimeout(()=>{

        toast.style.display = "none";

    },2000);

}
// ==========================
// Toast
// ==========================

function showToast(text){

    ...

}

// ==========================
// Clean URL
// ==========================

function cleanURL(text){

    if(!text) return "";

    text = text.trim();

    const urlMatch = text.match(/https?:\/\/[^\s]+/i);

    if(urlMatch){

        text = urlMatch[0];

    }

    text = text.replace(/^https?:\/\/www\./i,"https://");

    const games = text.match(/\/games\/.+/i);

    if(games){

        return "https://roblox.com" + games[0];

    }

    return text;

}

// ==========================
// Validasi Key
// ==========================



// ==========================
// Validasi Key + URL
// ==========================

function validate(){

    if(keyInput.value === API_KEY){

        keyStatus.innerHTML = "✅ Key Benar";

        keyStatus.style.color = "#00ff88";

    }else{

        keyStatus.innerHTML = "❌ Key Salah";

        keyStatus.style.color = "#ff5555";

    }

    startBtn.disabled = !(

        keyInput.value === API_KEY &&

        urlInput.value.startsWith("https://")

    );

}

keyInput.addEventListener("input",validate);

// ==========================
// START
// ==========================

startBtn.addEventListener("click", async () => {

    let original = cleanURL(urlInput.value);

    urlInput.value = original;

    if (!original.startsWith("https://")) {

        showToast("URL harus diawali https://");

        return;

    }

    loading.style.display = "block";

    result.style.display = "none";

    startBtn.disabled = true;

    try {

        // Membuat Short Link
        const code = await createShort(original);

        const shortLink =
            "https://condogames.my.id/" + code;

        // Tampilkan hasil
        shortBox.value = shortLink;

        markdownBox.value =
            `[${original}](${shortLink})`;

        result.style.display = "block";

        showToast("Short Link Berhasil Dibuat");

    } catch (err) {

        console.error(err);

        showToast("Gagal membuat Short Link");

    }

    loading.style.display = "none";

    validate();

});
urlInput.addEventListener("input",validate);
// ==========================
// COPY SHORT LINK
// ==========================

copyShort.addEventListener("click", async () => {

    try{

        await navigator.clipboard.writeText(
            shortBox.value
        );

        showToast("Short Link berhasil disalin");

    }catch{

        shortBox.select();

        document.execCommand("copy");

        showToast("Short Link berhasil disalin");

    }

});

// ==========================
// COPY HYPER LINK
// ==========================

copyMarkdown.addEventListener("click", async () => {

    try{

        await navigator.clipboard.writeText(
            markdownBox.value
        );

        showToast("Hyper Link berhasil disalin");

    }catch{

        markdownBox.select();

        document.execCommand("copy");

        showToast("Hyper Link berhasil disalin");

    }

});

// ==========================
// AUTO CLEAN URL SAAT PASTE
// ==========================

urlInput.addEventListener("paste", () => {

    setTimeout(() => {

        urlInput.value = cleanURL(urlInput.value);

        validate();

    }, 50);

});

// ==========================
// AUTO CLEAN SAAT MENGETIK
// ==========================

urlInput.addEventListener("blur", () => {

    urlInput.value = cleanURL(urlInput.value);

    validate();

});

// ==========================
// ENTER = START
// ==========================

document.addEventListener("keydown", (e) => {

    if(e.key === "Enter" && !startBtn.disabled){

        startBtn.click();

    }

});

// ==========================
// RESET
// ==========================

function resetForm(){

    loading.style.display = "none";

    result.style.display = "none";

}

resetForm();

validate();