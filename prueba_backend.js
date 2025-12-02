const mqtt = require('mqtt');
const http = require('http');
const ExcelJS = require('exceljs');

const PORT = 3001;

// Configuración MQTT
const client = mqtt.connect('mqtt://test.mosquitto.org');
const TOPIC_LOG = 'esp32/log';

// Estado en memoria
const metrics = {
  resumen: {
    visitasHoy: 0,
    ultimoMovimiento: null,
    ultimaDuracion: 0,
  },
  estado: {
    estado: 'Disponible',
    actualizadoEn: new Date().toISOString(),
  },
  visitas: [],
};

client.on('connect', () => {
  console.log('📡 Backend conectado a MQTT (test.mosquitto.org)...');
  client.subscribe(TOPIC_LOG, (err) => {
    if (!err) {
      console.log(`👂 Escuchando en: ${TOPIC_LOG}`);
    }
  });
});

client.on('message', (topic, message) => {
  if (topic === TOPIC_LOG) {
    const text = message.toString();
    console.log(`[ESP32] Señal recibida: ${text}`);

    const now = new Date();
    const timestampStr = now.toISOString();

    // 1. Actualizar Estado
    metrics.estado = {
      estado: 'Ocupado', // Asumimos ocupado al detectar
      actualizadoEn: timestampStr,
    };

    // 2. Actualizar Resumen
    metrics.resumen.visitasHoy += 1;
    metrics.resumen.ultimoMovimiento = timestampStr;

    // 3. Registrar Visita (Sin simulación de cierre)
    const nuevaVisita = {
      evento: 'entrada',
      inicio: timestampStr,
      duracionSegundos: 0, // Desconocido
      nota: 'Detectado por ESP32 (En curso)'
    };

    metrics.visitas.push(nuevaVisita);
    // Mantener solo las últimas 20
    if (metrics.visitas.length > 20) metrics.visitas = metrics.visitas.slice(-20);
  }
});

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/metrics') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(metrics));
  } else if (req.method === 'GET' && req.url === '/report') {
    res.statusCode = 200;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_gato.xlsx"');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Visitas');

    worksheet.columns = [
      { header: 'Visita #', key: 'id', width: 10 },
      { header: 'Estado', key: 'estado', width: 15 },
      { header: 'Inicio', key: 'inicio', width: 25 },
      { header: 'Duración (s)', key: 'duracion', width: 15 },
      { header: 'Nota', key: 'nota', width: 30 },
    ];

    worksheet.getRow(1).font = { bold: true };

    metrics.visitas.forEach((v, index) => {
      worksheet.addRow({
        id: index + 1,
        estado: v.evento === 'salida' ? 'Completada' : 'En curso',
        inicio: v.inicio,
        duracion: v.duracionSegundos || 0,
        nota: v.nota,
      });
    });

    await workbook.xlsx.write(res);
    res.end();
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`🌐 Backend listo en http://localhost:${PORT}/metrics`);
  console.log(`   - Modo: REAL (Sin simulación)`);
});
