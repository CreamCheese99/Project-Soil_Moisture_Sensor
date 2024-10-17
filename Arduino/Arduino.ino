#include <WiFi.h>
#include <HTTPClient.h>

int _moisture, sensor_analog;
const int sensor_pin = A0;  // Soil moisture sensor O/P pin

const char* ssid = "Creamcheese";         // Enter your SSID
const char* password = "cccccccc"; // Enter your password
const char* serverURL = "http://172.20.10.5:3000/api/data"; // Server URL to send data

void setup() {
  Serial.begin(115200);  // Set the baudrate to 115200
  WiFi.mode(WIFI_STA);   // Set the WiFi in STA mode
  WiFi.begin(ssid, password);
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  // Wait until connected to WiFi
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  
  Serial.println();
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP()); // Print the local IP address
}

void loop() {
  // Read soil moisture sensor value
  sensor_analog = analogRead(sensor_pin);
  _moisture = 100 - ((sensor_analog / 4095.00) * 100); // Convert analog value to percentage
  
  Serial.print("Moisture = ");
  Serial.print(_moisture);
  Serial.println("%");

  // Send data to server
  if (WiFi.status() == WL_CONNECTED) {
    sendDataToServer(_moisture);
  } else {
    Serial.println("WiFi not connected");
  }

  delay(60000);  // Wait 1 minute before next reading
}

void sendDataToServer(int moisture) {
  HTTPClient http;
  
  http.begin(serverURL);  // Specify the URL
  http.addHeader("Content-Type", "application/json"); // Specify content-type header
  
  String jsonData = "{\"moisture\": " + String(moisture) + "}"; // Create JSON payload

  int httpResponseCode = http.POST(jsonData);  // Send the POST request

  // Check the response
  if (httpResponseCode > 0) {
    String response = http.getString();  // Get the response
    Serial.println("HTTP Response code: " + String(httpResponseCode));
    Serial.println("Response: " + response);
  } else {
    Serial.println("Error on sending POST: " + String(httpResponseCode));
  }

  http.end();  // Free resources
}

