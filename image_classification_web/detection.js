let video;
let model;
let label = "Waiting...";
let writer;
let port;

// DOM Elements
const videoElement = document.getElementById("video");
const labelElement = document.getElementById("label");
const connectButton = document.getElementById("connect-button");
const backButton = document.getElementById("back-button");

// Retrieve stored model URL and object names
const modelURL = localStorage.getItem("modelURL");
const object1 = localStorage.getItem("object1");
const object2 = localStorage.getItem("object2");
const object3 = localStorage.getItem("object3");

// Load the Teachable Machine model
async function loadModel() {
    model = await ml5.imageClassifier(modelURL);
    console.log("Model loaded!");
    classifyVideo();
}

// Classify the video stream
function classifyVideo() {
    if (model) {
        setTimeout(() => {
            model.classify(videoElement, gotResult);
        }, 500);
    }
}

// Handle results
function gotResult(error, results) {
    if (error) {
        console.error(error);
        return;
    }

    let detectedLabel = results[0].label.toUpperCase();
    let confidence = results[0].confidence;

    if (confidence > 0.7) {
        if (detectedLabel === object1) {
            label = `✅ ${object1} detected!`;
            sendToESP32(0);
        } else if (detectedLabel === object2) {
            label = `✅ ${object2} detected!`;
            sendToESP32(1);
        } else if (detectedLabel === object3) {
            label = `✅ ${object3} detected!`;
            sendToESP32(2);
        } else {
            label = "❌ No recognized object detected.";
            sendToESP32(3);
        }
    } else {
        label = "🔍 Waiting...";
    }

    labelElement.innerText = label;
    classifyVideo();
}

// Send data to ESP32
async function sendToESP32(data) {
    if (writer) {
        try {
            const encoder = new TextEncoder();
            await writer.write(encoder.encode(data.toString()));
            console.log("Sent to ESP32:", data);
        } catch (error) {
            console.error("Error sending data to ESP32:", error);
        }
    } else {
        console.warn("Serial port not connected.");
    }
}

// Connect to ESP32 via Web Serial
async function connectToESP32() {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });

        writer = port.writable.getWriter();
        console.log("Connected to ESP32!");
        connectButton.innerText = "Connected ✅";
        connectButton.disabled = true;
    } catch (error) {
        console.error("Failed to connect to ESP32:", error);
    }
}

// Initialize webcam and model
async function init() {
    try {
        video = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = video;
        videoElement.onloadedmetadata = () => {
            console.log("Webcam ready!");
            loadModel();
        };
    } catch (error) {
        console.error("Error accessing webcam:", error);
    }
}

// Handle button clicks
connectButton.addEventListener("click", connectToESP32);
backButton.addEventListener("click", () => {
    window.location.href = "index.html";
});

// Start detection
init();
