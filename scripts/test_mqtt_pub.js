const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on('connect', () => {
    console.log('🔌 Conectado al broker para prueba...');

    const topic = 'esp32/log';
    const message = new Date().toISOString(); // Simula lo que envía el ESP32

    client.publish(topic, message, () => {
        console.log(`📤 Enviado a ${topic}: ${message}`);
        client.end();
    });
});
