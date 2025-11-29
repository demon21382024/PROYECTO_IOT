const mqtt = require('mqtt');

// Conexión a tu Mosquitto local
// Si estás en la misma PC, usa localhost. Si es otra, la IP.
const client = mqtt.connect('mqtt://broker.hivemq.com');

// Configuración
const ID_ARENERO = 'Arenero-001';
const topic_presencia = `arenero/${ID_ARENERO}/sensor/presencia`;
const topic_visita_detalle = `arenero/${ID_ARENERO}/visitas/detalle`;
const topic_visita_resumen = `arenero/${ID_ARENERO}/visitas/resumen`;
const topic_estado = `arenero/${ID_ARENERO}/estado`;

let visitasHoy = 0;
let visitaActual = null;

client.on('connect', () => {
  console.log(`✅ Simulador ${ID_ARENERO} conectado al Broker!`);

  publicarEstado('Libre');

  // Simular que el gato entra cada 5 segundos
  setInterval(() => {
    if (!visitaActual) {
      simularGatoEntrando();
    }
  }, 5000);
});

function simularGatoEntrando() {
  visitaActual = {
    id: `${ID_ARENERO}-${Date.now()}`,
    inicio: Date.now(),
  };

  console.log('------------------------------------------------');
  console.log('🐈 Gato entrando al arenero...');

  client.publish(
    topic_presencia,
    JSON.stringify({
      areneroId: ID_ARENERO,
      timestamp: new Date().toISOString(),
      estado: 'dentro',
      visitaId: visitaActual.id,
    }),
  );

  client.publish(
    topic_visita_detalle,
    JSON.stringify({
      evento: 'entrada',
      visitaId: visitaActual.id,
      inicio: visitaActual.inicio,
    }),
  );

  publicarEstado('Ocupado');

  const duracion = Math.floor(Math.random() * (45 - 15) + 15) * 1000;

  setTimeout(() => {
    finalizarVisita();
  }, duracion);
}

function finalizarVisita() {
  if (!visitaActual) return;

  const fin = Date.now();
  const duracionSeg = Math.round((fin - visitaActual.inicio) / 1000);
  visitasHoy += 1;

  console.log('🐈 Gato saliendo...');
  console.log(`⏱️ Duración de la visita: ${duracionSeg} segundos`);

  client.publish(
    topic_presencia,
    JSON.stringify({
      areneroId: ID_ARENERO,
      timestamp: new Date().toISOString(),
      estado: 'fuera',
      visitaId: visitaActual.id,
    }),
  );

  client.publish(
    topic_visita_detalle,
    JSON.stringify({
      evento: 'salida',
      visitaId: visitaActual.id,
      inicio: visitaActual.inicio,
      fin,
      duracionSegundos: duracionSeg,
    }),
  );

  client.publish(
    topic_visita_resumen,
    JSON.stringify({
      areneroId: ID_ARENERO,
      visitasHoy,
      ultimaDuracion: duracionSeg,
      ultimoMovimiento: fin,
      estado: 'Libre',
    }),
  );

  publicarEstado('Libre', duracionSeg);
  visitaActual = null;
}

function publicarEstado(estado, ultimaDuracion = 0) {
  client.publish(
    topic_estado,
    JSON.stringify({
      areneroId: ID_ARENERO,
      estado,
      ultimaDuracion,
      actualizadoEn: new Date().toISOString(),
    }),
  );
}

// Escuchar comandos (para probar si tu Web App manda limpiar)
client.subscribe('arenero/comando/limpiar');

client.on('message', (topic, message) => {
  if (topic === 'arenero/comando/limpiar') {
    console.log(`🧹 COMANDO RECIBIDO DE LA WEB: ${message.toString()}`);
  }
});
