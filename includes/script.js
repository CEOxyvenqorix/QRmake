let currentQR = null;
let selectedImage = null;

/* ==========================================
ELEMENTOS
========================================== */

const urlInput = document.getElementById("url");
const textInput = document.getElementById("text");
const positionInput = document.getElementById("position");

const darkColor = document.getElementById("darkColor");
const lightColor = document.getElementById("lightColor");

const qrcode = document.getElementById("qrcode");
const emptyQR = document.getElementById("emptyQR");

const qrLogo = document.getElementById("qrLogo");

const topText = document.getElementById("topText");
const bottomText = document.getElementById("bottomText");

const status = document.getElementById("status");

const imageInput = document.getElementById("imageInput");
const imageName = document.getElementById("imageName");

const removeImageButton =
document.getElementById("removeImage");

const createButton =
document.getElementById("createBtn");

const generateButton =
document.getElementById("generateBtn");

const downloadButton =
document.getElementById("downloadBtn");

/* ==========================================
NORMALIZAR URL
========================================== */

function normalizeURL(value) {

value = value.trim();

if (!value) {
    return "";
}

/*
   Si el usuario escribe:

   google.com

   se convierte automáticamente en:

   https://google.com
*/

if (!/^https?:\/\//i.test(value)) {
    value = "https://" + value;
}

return value;

}

/* ==========================================
VALIDAR URL
========================================== */

function isValidURL(value) {

try {

    const url = new URL(value);

    return (
        url.protocol === "http:" ||
        url.protocol === "https:"
    );

} catch {

    return false;

}

}

/* ==========================================
GENERAR QR
========================================== */

function generateQR() {

const url = normalizeURL(urlInput.value);

if (!url) {

    showEmpty();

    status.textContent =
        "Escribe una dirección web para comenzar.";

    return;
}


if (!isValidURL(url)) {

    status.textContent =
        "⚠️ La dirección web no parece válida.";

    return;
}


/*
   Guardamos la URL normalizada
   para que el usuario pueda ver
   exactamente qué se está utilizando.
*/

urlInput.value = url;


qrcode.innerHTML = "";

emptyQR.style.display = "none";


const options = {

    text: url,

    width: 300,

    height: 300,

    colorDark: darkColor.value,

    colorLight: lightColor.value,

    correctLevel: QRCode.CorrectLevel.H

};


currentQR = new QRCode(
    qrcode,
    options
);


updateText();


status.textContent =
    "✓ QR creado correctamente";


/*
   Si ya había una imagen seleccionada,
   la mantenemos.
*/

if (selectedImage) {

    qrLogo.src = selectedImage;

    qrLogo.style.display = "block";

}

}

/* ==========================================
MOSTRAR QR VACÍO
========================================== */

function showEmpty() {

qrcode.innerHTML = "";

emptyQR.style.display = "flex";

currentQR = null;

qrLogo.style.display = "none";

}

/* ==========================================
ACTUALIZAR TEXTO
========================================== */

function updateText() {

const text =
    textInput.value.trim();

const position =
    positionInput.value;


topText.textContent = "";
bottomText.textContent = "";


if (!text) {
    return;
}


if (position === "top") {

    topText.textContent = text;

} else {

    bottomText.textContent = text;

}

}

/* ==========================================
IMAGEN / LOGO
========================================== */

imageInput.addEventListener(
"change",
function(event) {

    const file =
        event.target.files[0];

    if (!file) {
        return;
    }


    if (!file.type.startsWith("image/")) {

        alert(
            "Selecciona una imagen válida."
        );

        imageInput.value = "";

        return;
    }


    /*
       Limitamos el tamaño para evitar
       problemas con imágenes enormes.
    */

    if (file.size > 8 * 1024 * 1024) {

        alert(
            "La imagen es demasiado grande. " +
            "Utiliza una imagen de menos de 8 MB."
        );

        imageInput.value = "";

        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            selectedImage =
                event.target.result;


            qrLogo.src =
                selectedImage;


            qrLogo.style.display =
                "block";


            imageName.textContent =
                file.name;


            removeImageButton.style.display =
                "block";


            status.textContent =
                "✓ Logo añadido al QR";

        };


    reader.readAsDataURL(file);

}

);

/* ==========================================
QUITAR IMAGEN
========================================== */

function removeImage() {

selectedImage = null;

qrLogo.src = "";

qrLogo.style.display = "none";

imageInput.value = "";

imageName.textContent =
    "Ninguna imagen seleccionada";

removeImageButton.style.display =
    "none";

}

removeImageButton.addEventListener(
"click",
removeImage
);

/* ==========================================
BOTONES
========================================== */

createButton.addEventListener(
"click",
generateQR
);

generateButton.addEventListener(
"click",
generateQR
);

/* ==========================================
ENTER EN URL
========================================== */

urlInput.addEventListener(
"keydown",
function(event) {

    if (event.key === "Enter") {

        generateQR();

    }

}

);

/* ==========================================
ACTUALIZAR TEXTO EN TIEMPO REAL
========================================== */

textInput.addEventListener(
"input",
updateText
);

positionInput.addEventListener(
"change",
updateText
);

/* ==========================================
CAMBIO DE COLOR
========================================== */

darkColor.addEventListener(
"change",
function() {

    if (urlInput.value.trim()) {
        generateQR();
    }

}

);

lightColor.addEventListener(
"change",
function() {

    if (urlInput.value.trim()) {
        generateQR();
    }

}

);

/* ==========================================
DESCARGAR QR
========================================== */

downloadButton.addEventListener(
"click",
async function() {

    if (!currentQR) {

        alert(
            "Primero genera un código QR."
        );

        return;
    }


    /*
       Cargamos html2canvas solamente cuando
       el usuario pulsa descargar.
    */

    if (!window.html2canvas) {

        status.textContent =
            "Preparando descarga...";


        const script =
            document.createElement("script");


        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";


        document.head.appendChild(script);


        await new Promise(
            function(resolve, reject) {

                script.onload = resolve;

                script.onerror = reject;

            }
        );

    }


    const card =
        document.getElementById("qrCard");


    try {

        const canvas =
            await html2canvas(
                card,
                {
                    scale: 3,

                    backgroundColor:
                        "#ffffff",

                    useCORS: true
                }
            );


        const link =
            document.createElement("a");


        link.download =
            "menu-digital-qr.png";


        link.href =
            canvas.toDataURL(
                "image/png"
            );


        link.click();


        status.textContent =
            "✓ QR descargado correctamente";

    } catch (error) {

        console.error(error);

        status.textContent =
            "⚠️ No se pudo descargar el QR.";

    }

}

);

/* ==========================================
INICIO
========================================== */

updateText();

showEmpty();
