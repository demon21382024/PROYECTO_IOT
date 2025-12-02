#include <WiFi.h>
#include <PubSubClient.h>
#include <time.h>              // Para fecha y hora


// ===== CONFIG WIFI =====
//const char* WIFI_SSID = "HUAWEI-2.4G-uzvE";
//const char* WIFI_PASS = "Eybn4PMt";
const char* WIFI_SSID = "Redmi Note 14";
const char* WIFI_PASS = "joel1234";

// ===== CONFIG MQTT =====
const char* MQTT_BROKER = "test.mosquitto.org";
const uint16_t MQTT_PORT = 1883;

const char* TOPIC_LOG = "esp32/log";   // único topic usado

// ===== CONFIG NTP (hora) =====
// Perú: UTC-5, sin DST
const long GMT_OFFSET_SEC      = -5 * 3600;
const int  DAYLIGHT_OFFSET_SEC = 0;
const char* NTP_SERVER_1       = "pool.ntp.org";
const char* NTP_SERVER_2       = "time.nist.gov";

// ===== ULTRASONIC PINS =====
const int PIN_TRIG = 5;
const int PIN_ECHO = 18;

// ===== OBJETOS WIFI/MQTT =====
WiFiClient espClient;
PubSubClient mqtt(espClient);

unsigned long lastPublish = 0;
const unsigned long PUBLISH_INTERVAL_MS = 1000;

// Umbral para log
const float DIST_THRESHOLD_CM = 30.0;
// Estado de presencia respecto al umbral
bool wasBelowThreshold = false;

// =========================
void wifiConnect() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado, IP: " + WiFi.localIP().toString());
}

void mqttConnect() {
  mqtt.setServer(MQTT_BROKER, MQTT_PORT);
  while (!mqtt.connected()) {
    String clientId = "esp32-ultra-" + String((uint32_t)ESP.getEfuseMac(), HEX);
    Serial.print("Conectando a MQTT...");
    // Conexión simple, sin LWT ni credenciales
    if (mqtt.connect(clientId.c_str())) {
      Serial.println(" conectado.");
    } else {
      Serial.print(" fallo, rc=");
      Serial.println(mqtt.state());
      delay(2000);
    }
  }
}

void setupTime() {
  configTime(GMT_OFFSET_SEC, DAYLIGHT_OFFSET_SEC, NTP_SERVER_1, NTP_SERVER_2);
  Serial.println("Sincronizando hora con NTP...");

  struct tm timeinfo;
  // Intentar obtener hora con timeout de 10 segundos
  if (!getLocalTime(&timeinfo, 10000)) {
    Serial.println("⚠ No se pudo obtener la hora (NTP)");
  } else {
    Serial.println("Hora sincronizada correctamente:");
    Serial.printf("%04d-%02d-%02d %02d:%02d:%02d\n",
                  timeinfo.tm_year + 1900,
                  timeinfo.tm_mon + 1,
                  timeinfo.tm_mday,
                  timeinfo.tm_hour,
                  timeinfo.tm_min,
                  timeinfo.tm_sec);
  }
}

float readDistanceCm() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  unsigned long duration = pulseIn(PIN_ECHO, HIGH, 30000); // timeout 30ms
  if (duration == 0) return NAN;

  float distance = (duration * 0.0343f) / 2.0f; // cm
  Serial.print("Distancia: ");
  Serial.println(distance);
  return distance;
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);

  wifiConnect();
  setupTime();    // obtener fecha/hora real
  mqttConnect();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) wifiConnect();
  if (!mqtt.connected()) mqttConnect();
  mqtt.loop();

  unsigned long now = millis();
  if (now - lastPublish >= PUBLISH_INTERVAL_MS) {
    lastPublish = now;

    float cm = readDistanceCm();

    // Estado actual respecto al umbral
    bool isBelowThreshold = (!isnan(cm) && cm < DIST_THRESHOLD_CM);

    // Queremos publicar cuando se cruza el umbral en cualquier dirección:
    //  - de "arriba" a "debajo" del umbral
    //  - de "debajo" a "arriba" del umbral
    if (isBelowThreshold != wasBelowThreshold) {
      // Aquí hay cambio de estado (flanco de subida o bajada)
      if (isBelowThreshold) {
        Serial.println("⚡ Evento: objeto ENTRA a la zona bajo el umbral, registrando fecha/hora...");
      } else {
        Serial.println("⚡ Evento: objeto SALE de la zona bajo el umbral, registrando fecha/hora...");
      }

      time_t raw = time(nullptr);
      struct tm timeinfo;
      localtime_r(&raw, &timeinfo);

      char timeStr[40];
      // Ejemplo: 2025-11-30T14:23:45-0500
      strftime(timeStr, sizeof(timeStr), "%Y-%m-%dT%H:%M:%S%z", &timeinfo);

      // Payload: solo la fecha/hora (igual que el original)
      mqtt.publish(TOPIC_LOG, timeStr);
      Serial.print("LOG -> ");
      Serial.print(TOPIC_LOG);
      Serial.print(" : ");
      Serial.println(timeStr);
    }

    // Actualizar memoria del estado respecto al umbral
    wasBelowThreshold = isBelowThreshold;
  }
}
