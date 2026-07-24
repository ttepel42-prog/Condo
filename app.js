import { db, doc, setDoc } from "./firebase.js";

const longUrl = document.getElementById("longUrl");
const createBtn = document.getElementById("createBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const shortUrl = document.getElementById("shortUrl");
const copyBtn = document.getElementById("copyBtn");

function randomCode(length = 6) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }

    return code;
}

createBtn.addEventListener("click", async () => {

    let url = longUrl.value.trim();

    if (!url) {
        alert("Masukkan URL terlebih dahulu.");
        return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    loading.style.display = "block";
    result.style.display = "none";

    const code = randomCode();

    try {

        await setDoc(doc(db, "links", code), {

            url: url,
            createdAt: Date.now()

        });

        const finalLink =
            "https://condogames.my.id/" + code;

        shortUrl.value = finalLink;

        loading.style.display = "none";
        result.style.display = "block";

    } catch (err) {

        loading.style.display = "none";

        console.error(err);

        alert("Gagal membuat short link.");

    }

});

copyBtn.addEventListener("click", async () => {

    try {

        await navigator.clipboard.writeText(shortUrl.value);

        copyBtn.innerText = "COPIED ✓";

        setTimeout(() => {

            copyBtn.innerText = "COPY LINK";

        }, 2000);

    } catch {

        shortUrl.select();
        document.execCommand("copy");

    }

});