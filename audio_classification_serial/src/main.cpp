#include <Arduino.h>
#include "SPI.h"
#include "TFT_eSPI.h"
#include "U8g2_for_TFT_eSPI.h"
#include "Free_Fonts.h"

#define FONT u8g2_font_wqy16_t_gb2312b  // Chinese font

U8g2_for_TFT_eSPI u8f;  // U8g2 font instance
TFT_eSPI tft = TFT_eSPI();

#define TEXT_1 "特辣的海藻"
#define TEXT_2_1 "PLANKTON"
#define TEXT_2_2 "MOANING"
#define TEXT_3 "OMG"

void setup(void) {
    Serial.begin(115200);  // Initialize serial communication
    while (!Serial);       // Wait for serial port to connect (for boards with native USB)

    tft.begin();
    tft.setRotation(1);
    tft.fillScreen(TFT_BLACK);

    u8f.begin(tft);  // Initialize U8g2 with TFT_eSPI
    u8f.setFont(FONT);
    u8f.setForegroundColor(TFT_WHITE);  // Set text color

    Serial.println("Display and Serial initialized.");
}

void loop() {
    // Check if data is available on the serial port
    if (Serial.available() > 0) {
        // Read the incoming byte
        int data = Serial.read() - '0'; // Convert ASCII to integer
        Serial.print("Received: ");
        Serial.println(data);

        // Clear the serial buffer
        while (Serial.available() > 0) {
            Serial.read();
        }

        // Perform actions based on the received data
        switch (data) {
            case 0:
                tft.fillScreen(TFT_BLACK);  // Clear screen
                u8f.setCursor(120, 120);    // Set cursor position (adjust as needed)
                u8f.print(TEXT_1);    // Display Chinese text
                delay(1000);
                break;
            case 1:
                tft.setTextDatum(MC_DATUM);
                tft.setTextColor(TFT_WHITE, TFT_BLACK);
                tft.fillScreen(TFT_BLACK);
                tft.setFreeFont(FF7);
                tft.drawString(TEXT_2_1, 160, 100, GFXFF);
                tft.drawString(TEXT_2_1, 160, 140, GFXFF);
                Serial.println("Displayed: PLANKTON MOANING");
                delay(1000);
                break;
            case 2:
                tft.setTextDatum(MC_DATUM);
                tft.setTextColor(TFT_WHITE, TFT_BLACK);
                tft.fillScreen(TFT_BLACK);
                tft.setFreeFont(FF8);
                tft.drawString(TEXT_3, 160, 120, GFXFF);
                delay(1000);
                break;
            default:
                tft.setTextDatum(MC_DATUM);
                tft.setTextColor(TFT_WHITE, TFT_BLACK);
                tft.fillScreen(TFT_BLACK);
                tft.setFreeFont(FF7);
                tft.drawString("Background", 160, 100, GFXFF);
                tft.drawString("Noise", 160, 140, GFXFF);
                delay(1000);
                break;
        }
    }
}