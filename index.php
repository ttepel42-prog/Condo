<?php require_once "config.php"; ?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>condo</title>

<link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">

    <h2>Hyper Link + Short Link</h2>

    <input
        type="text"
        id="url"
        placeholder="https://..."
        autocomplete="off"
    >

    <button id="start" disabled>
        START
    </button>

    <div id="result" style="display:none;">

        <h3>Short Link</h3>

        <input
            type="text"
            id="short"
            readonly
        >

        <button onclick="copyShort()">
            Copy Short
        </button>

        <h3>Markdown Hyper Link</h3>

        <textarea
            id="markdown"
            rows="5"
            readonly
        ></textarea>

        <button onclick="copyMarkdown()">
            Copy Markdown
        </button>

    </div>

</div>

<script>

const url = document.getElementById("url");
const start = document.getElementById("start");

url.addEventListener("input",()=>{

    start.disabled = !url.value.startsWith("https://");

});

start.onclick = async ()=>{

    start.disabled = true;
    start.innerHTML = "Loading...";

    const response = await fetch("api.php",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            key:"<?= API_KEY ?>",

            url:url.value

        })

    });

    const data = await response.json();

    start.disabled = false;
    start.innerHTML = "START";

    if(!data.success){

        alert(data.message);
        return;

    }

    document.getElementById("result").style.display="block";

    document.getElementById("short").value=data.short;

    document.getElementById("markdown").value=data.markdown;

};

function copyShort(){

    navigator.clipboard.writeText(
        document.getElementById("short").value
    );

    alert("Short Link berhasil disalin");

}

function copyMarkdown(){

    navigator.clipboard.writeText(
        document.getElementById("markdown").value
    );

    alert("Markdown berhasil disalin");

}

</script>

</body>
</html>