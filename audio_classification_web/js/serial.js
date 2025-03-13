let port;
let writer;

async function connectSerialPort() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    writer = port.writable.getWriter();
    console.log("Serial port connected!");
  } catch (error) {
    console.error("Error connecting to serial port:", error);
  }
}

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

document.getElementById("connect-button").addEventListener("click", connectSerialPort);
