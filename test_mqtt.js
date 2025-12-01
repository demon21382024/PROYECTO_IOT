const mqtt = require('mqtt');

// Conectamos al Mosquitto Local
const client = mqtt.connect('mqtt://localhost');

client.on('connect', () => {
    console.log('✅ Conectado a Mosquitto Local!');
    
    // Nos suscribimos a un tema de prueba
    client.subscribe('test/mensaje');
    
    // Si Mosquitto funciona, deberíamos recibirlo inmediatamente
    setTimeout(() => {
        console.log('📤 Enviando mensaje de prueba...');
        client.publish('test/mensaje', 'Hola Mosquitto, soy yo!');
    }, 1000);
});

client.on('message', (topic, message) => {
    console.log(`📥 RECIBIDO [${topic}]: ${message.toString()}`);
    console.log('🎉 ¡TODO FUNCIONA CORRECTAMENTE!');
    client.end();
});

client.on('error', (err) => {
    console.error('❌ Error de conexión:', err);
});