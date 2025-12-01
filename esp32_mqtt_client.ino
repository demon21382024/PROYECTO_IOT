#include <WiFi.h>
#include <PubSubClient.h>
#include <time.h>

// --- 1. CONFIGURACIÓN WIFI (PON TUS DATOS AQUÍ) ---
const char* WIFI_SSID = "NOMBRE_DE_TU_WIFI";       // <--- CAMBIAR
const char* WIFI_PASSWORD = "TU_CONTRASEÑA_WIFI";  // <--- CAMBIAR

// --- 2. CONFIGURACIÓN MQTT (ATENCIÓN AQUÍ) ---
// Pon la IP de tu PC que viste en ipconfig (ej: "192.168.1.50")
const char* MQTT_BROKER = "192.168.X.X";
const int MQTT_PORT = 1883;

// Este tópico coincide con lo que tu Backend escucha en la línea 36 de prueba_backend.js
const char* MQTT_TOPIC = "arenero/Arenero-001/visitas/detalle"; 

// --- CONFIGURACIÓN HORA ---
const char* NTP_SERVER = "pool.ntp.org";
const long GMT_OFFSET_SEC = -3600 * 5; // Ajustado para Lima/Perú (-5 UTC)
const int DAYLIGHT_OFFSET_SEC = 0;     // En Perú no solemos usar horario de verano

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado. IP: ");
  Serial.println(WiFi.localIP());
}

void sync_time() {
  configTime(GMT_OFFSET_SEC, DAYLIGHT_OFFSET_SEC, NTP_SERVER);
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Fallo al obtener la hora");
    return;
  }
  Serial.println("Hora sincronizada.");
}

void reconnect_mqtt() {
  while (!mqttClient.connected()) {
    Serial.print("Conectando a MQTT en tu PC...");
    // ID único para que Mosquitto no se confunda
    if (mqttClient.connect("ESP32_Arenero_Fisico")) { 
      Serial.println("¡Conectado!");
    } else {
      Serial.print("falló, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" reintentando en 5s...");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  sync_time();
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
}

void loop() {
  if (!mqttClient.connected()) {
    reconnect_mqtt();
  }
  mqttClient.loop();

  // --- SIMULACIÓN DE DATOS (O LECTURA DE SENSORES) ---
  // Esto simula que el gato acaba de salir
  
  // 1. Datos simulados (Adáptalo a tus sensores reales)
  int duracion_real = random(15, 300); // Duración en segundos
  
  // 2. Obtener Timestamp
  time_t now;
  time(&now);
  char timestamp[30];
  strftime(timestamp, sizeof(timestamp), "%Y-%m-%dT%H:%M:%SZ", gmtime(&now));

  // 3. Construir JSON
  // 'duracionSegundos', 'inicio', 'visitaId', 'evento'
  char json_payload[256];
  
  // Creamos un ID único basado en el tiempo
  char visitaId[20];
  sprintf(visitaId, "VIS-%ld", now);

  sprintf(json_payload, 
    "{\"visitaId\": \"%s\", \"inicio\": \"%s\", \"duracionSegundos\": %d, \"evento\": \"salida_sensor\", \"nota\": \"Deteccion real ESP32\"}",
    visitaId, timestamp, duracion_real
  );

  // 4. Publicar
  Serial.print("Enviando datos a tu PC: ");
  Serial.println(json_payload);
  
  mqttClient.publish(MQTT_TOPIC, json_payload);

  // Esperar 10 segundos para la siguiente prueba
  delay(10000); 
}