document.getElementById("enter-button").addEventListener("click", function() {
  const modelUrl = document.getElementById("model-url").value;
  const sound1 = document.getElementById("sound1").value;
  const sound2 = document.getElementById("sound2").value;
  const sound3 = document.getElementById("sound3").value;

  if (!modelUrl || !sound1 || !sound2 || !sound3) {
    alert("Please fill in all fields.");
    return;
  }

  // Save inputs to sessionStorage for later use
  sessionStorage.setItem("modelUrl", modelUrl);
  sessionStorage.setItem("sound1", sound1);
  sessionStorage.setItem("sound2", sound2);
  sessionStorage.setItem("sound3", sound3);

  // Navigate to the next page
  window.location.href = "main.html";
});
