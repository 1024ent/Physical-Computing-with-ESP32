let model;
let label = "Waiting...";
let sounds = ["", "", ""];
let timeoutId = null;

document.getElementById("back-button").addEventListener("click", function () {
  window.location.href = "index.html";
});

// Load user-defined model and sounds
async function loadModel() {
  const modelURL = sessionStorage.getItem("modelUrl");

  // Normalize and trim sounds to avoid matching issues
  sounds[0] = sessionStorage.getItem("sound1")?.trim().toLowerCase() || "";
  sounds[1] = sessionStorage.getItem("sound2")?.trim().toLowerCase() || "";
  sounds[2] = sessionStorage.getItem("sound3")?.trim().toLowerCase() || "";

  if (!modelURL) {
    alert("No model found. Redirecting...");
    window.location.href = "index.html";
    return;
  }

  try {
    const finalModelURL = modelURL.endsWith("/") ? modelURL + "model.json" : modelURL + "/model.json";

    model = await ml5.soundClassifier(finalModelURL, {
      probabilityThreshold: 0.6,
      includeSpectrogram: true,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.5,
    });

    console.log("Model loaded successfully!");
    startClassification();
  } catch (error) {
    console.error("Error loading model:", error);
  }
}

function startClassification() {
  model.classify(gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  let detectedLabel = results[0].label.trim().toLowerCase(); // Normalize & trim
  let confidence = results[0].confidence.toFixed(2);

  console.log(`🔊 Detected: ${detectedLabel} (Confidence: ${confidence})`);

  let message = "Unknown sound detected";
  let dataToSend = 3; // Default to unknown sound

  // Check if detected label matches any of the stored sounds
  for (let i = 0; i < sounds.length; i++) {
    if (detectedLabel.includes(sounds[i]) && sounds[i] !== "") {
      message = `Detected: ${sounds[i]}`;
      dataToSend = i;
      break;
    }
  }

  updateLabel(message);
  sendToESP32(dataToSend);
}

function updateLabel(message) {
  const labelElement = document.getElementById("label");

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  labelElement.innerText = message; // Update immediately

  // Reset back to "Waiting..." after 2 seconds
  timeoutId = setTimeout(() => {
    labelElement.innerText = "Waiting...";
  }, 2000);
}

// Start classification on load
loadModel();
