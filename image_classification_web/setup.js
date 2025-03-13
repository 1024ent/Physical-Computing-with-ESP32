document.getElementById("enter-button").addEventListener("click", function() {
  const modelURL = document.getElementById("model-url").value;
  const object1 = document.getElementById("object1").value.toUpperCase();
  const object2 = document.getElementById("object2").value.toUpperCase();
  const object3 = document.getElementById("object3").value.toUpperCase();

  if (modelURL && object1 && object2 && object3) {
      // Store in localStorage for detection page
      localStorage.setItem("modelURL", modelURL);
      localStorage.setItem("object1", object1);
      localStorage.setItem("object2", object2);
      localStorage.setItem("object3", object3);

      // Redirect to detection page
      window.location.href = "detection.html";
  } else {
      alert("Please fill in all fields before proceeding!");
  }
});
