import { createShort } from "./firebase.js";

const url = document.getElementById("url");
const start = document.getElementById("start");

const loading = document.getElementById("loading");

const result = document.getElementById("result");

const shortBox = document.getElementById("short");

const markdownBox = document.getElementById("markdown");

const copyShort = document.getElementById("copyShort");

const copyMarkdown = document.getElementById("copyMarkdown");

// Validasi URL

url.addEventListener("input",()=>{

    start.disabled = !url.value.startsWith("https://");

});

// START

start.addEventListener("click",async()=>{

    const original = url.value.trim();

    if(!original.startsWith("https://")){

        alert("URL harus diawali https://");

        return;

    }

    loading.style.display="block";

    result.style.display="none";

    start.disabled=true;

    try{

        const code = await createShort(original);

        const short =
        window.location.origin + "/" + code;

        shortBox.value = short;

        markdownBox.value =
        `[${original}](${short})`;

        result.style.display="block";

    }catch(e){

        console.error(e);

        alert("Gagal membuat short link.");

    }

    loading.style.display="none";

    start.disabled=false;

});

// Copy Short

copyShort.onclick=()=>{

    navigator.clipboard.writeText(shortBox.value);

    alert("Short Link berhasil disalin");

};

// Copy Markdown

copyMarkdown.onclick=()=>{

    navigator.clipboard.writeText(markdownBox.value);

    alert("Hyper Link berhasil disalin");

};