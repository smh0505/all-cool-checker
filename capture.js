const xpos = document.querySelector("#xpos");
const ypos = document.querySelector("#ypos");
const width = document.querySelector("#width");
const height = document.querySelector("#height");

const video = document.createElement("video");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.filter = "contrast(1.4)";

const startBtn = document.querySelector("#startBtn")

startBtn.onclick = async () => {
    try {
        startBtn.setAttribute("disabled", "true")
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                displaySurface: "window",
            },
            audio: false,
        });

        video.srcObject = stream;
        video.play();

        const drawFrame = async () => {
            canvas.width = width.value;
            canvas.height = height.value;
            ctx.drawImage(video, xpos.value, ypos.value, width.value, height.value, 0, 0, width.value, height.value);
            await recognize();
            target = requestAnimationFrame(drawFrame);
        };

        drawFrame();
    } catch (err) {
        console.error(err);
        startBtn.removeAttribute("disabled")
    }
};

async function recognize() {
    const worker = await Tesseract.createWorker("eng");

    (async () => {
        await worker.setParameters({
            tessedit_char_whitelist: "0123456789",
        });

        const {
            data: { text },
        } = await worker.recognize(canvas);
        document.querySelector("#log").innerHTML = text;
        await worker.terminate();
    })();
}
