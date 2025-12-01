// lib/mqtt-service.ts
import mqtt, { MqttClient } from 'mqtt';

// Usamos un broker MQTT público sobre WebSockets para la compatibilidad con navegadores.
const MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';

// Este es el "canal" o "tópico" al que el dispositivo IoT debe publicar los datos.
// Y al que nuestra aplicación se suscribirá para recibir actualizaciones.
export const MQTT_TOPIC_LITTER_VISITS = 'purrtech/litterbox/visits';

let client: MqttClient | null = null;

/**
 * Establece y devuelve una única instancia del cliente MQTT (patrón Singleton).
 * Esto evita crear múltiples conexiones desde diferentes partes de la aplicación.
 */
export const getMqttClient = (): MqttClient => {
  if (!client) {
    console.log('Conectando al broker MQTT...');
    // Opciones de conexión. Dejamos que la librería maneje los reintentos.
    const options = {
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    };

    client = mqtt.connect(MQTT_BROKER_URL, options);

    client.on('connect', () => {
      console.log('Conectado exitosamente al broker MQTT.');
      // Una vez conectado, nos suscribimos al tópico de visitas.
      client?.subscribe(MQTT_TOPIC_LITTER_VISITS, (err) => {
        if (!err) {
          console.log(`Suscrito al tópico: ${MQTT_TOPIC_LITTER_VISITS}`);
        } else {
          console.error('Error en la suscripción MQTT:', err);
        }
      });
    });

    client.on('error', (err) => {
      console.error('Error en el cliente MQTT:', err);
      // Cerramos la conexión para que se intente reconectar.
      client?.end();
      client = null;
    });

    client.on('reconnect', () => {
      console.log('Reconectando al broker MQTT...');
    });

    client.on('close', () => {
      console.log('Conexión MQTT cerrada.');
      // Limpiamos la instancia para que el próximo llamado cree una nueva.
      client = null;
    });
  }
  return client;
};
