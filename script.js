const url = document.getElementById("url");
const start = document.getElementById("start");

const result = document.getElementById("result");
const shortBox = document.getElementById("short");
const markdownBox = document.getElementById("markdown");

// Validasi URL
url.addEventListener("input", () => {

    const valid = url.value.startsWith("https://");

    start.disabled = !valid;

});

// Tekan Enter
url.addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !start.disabled) {

        start.click();

    }

});

// Tombol START
start.addEventListener("click", async () => {

    start.disabled = true;
    start.innerText = "Loading...";

    try {

        const response = await fetch("api.php", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                key: API_KEY,

                url: url.value.trim()

            })

        });

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

        } else {

            result.style.display = "block";

            shortBox.value = data.short;

            markdownBox.value = data.markdown;

        }

    } catch (err) {

        alert("Gagal terhubung ke server.");

    }

    start.disabled = false;
    start.innerText = "START";

});

// Copy Short
function copyShort() {

    navigator.clipboard.writeText(shortBox.value);

    alert("Short Link berhasil disalin");

}

// Copy Markdown
function copyMarkdown() {

    navigator.clipboard.writeText(markdownBox.value);

    alert("Markdown berhasil disalin");

}