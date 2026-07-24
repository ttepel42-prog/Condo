import { db, doc, setDoc } from "./firebase.js";

const urlInput = document.getElementById("longUrl");
const createBtn = document.getElementById("createBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const shortUrl = document.getElementById("shortUrl");
const copyBtn = document.getElementById("copyBtn");

function randomCode(length = 6) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return code;
}

createBtn.onclick = async () => {

    const url = urlInput.value.trim();

    if (!url) {
        alert("Masukkan URL terlebih dahulu.");
        return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        alert("URL harus diawali https:// atau http://");
        return;
    }

    loading.style.display = "block";
    result.style.display = "none";

    const code = randomCode();

    try {

        await setDoc(doc(db, "links", code), {

            url: url,
            created: Date.now()

        });

        const link =
            "https://condogames.my.id/" + code;

        shortUrl.value = link;

        loading.style.display = "none";
        result.style.display = "block";

    } catch (e) {

        loading.style.display = "none";

        alert("Gagal membuat short link.");

        console.error(e);

    }

};

copyBtn.onclick = async () => {

    try {

        await navigator.clipboard.writeText(shortUrl.value);

        copyBtn.innerText = "COPIED ✔";

        setTimeout(() => {

            copyBtn.innerText = "COPY LINK";

        }, 2000);

    } catch {

        shortUrl.select();
        document.execCommand("copy");

    }

};