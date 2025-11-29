const mqtt = require('mqtt');
const http = require('node:http');
const ExcelJS = require('exceljs');

// Misma configuración que el simulador
const client = mqtt.connect('mqtt://broker.hivemq.com');

const topics = [
  'arenero/+/sensor/#',
  'arenero/+/visitas/#',
  'arenero/+/estado',
  'arenero/comando/#',
];

// Estado en memoria que el dashboard va a leer
const metrics = {
  resumen: null,
  estado: null,
  visitas: [], // último historial de visitas
};

client.on('connect', () => {
  console.log('📡 Backend de Prueba escuchando MQTT...');
  topics.forEach((topic) => client.subscribe(topic));
});

client.on('message', (topic, message) => {
  const text = message.toString();

  try {
    const payload = JSON.parse(text);

    if (topic.includes('/visitas/resumen')) {
      metrics.resumen = payload;
    } else if (topic.includes('/visitas/detalle')) {
      metrics.visitas.push(payload);
      // Nos quedamos solo con las últimas 20 visitas para la tabla
      if (metrics.visitas.length > 20) {
        metrics.visitas = metrics.visitas.slice(-20);
      }
    } else if (topic.includes('/estado')) {
      metrics.estado = payload;
    }

    console.log(`[RECIBIDO] ${topic} ->`, payload);
  } catch (error) {
    console.warn(`⚠️ No se pudo parsear el mensaje JSON en ${topic}`, error);
    console.log(`[RECIBIDO] ${topic} -> ${text}`);
  }
});

// Servidor HTTP muy simple para que el Dashboard lea las métricas
const PORT = 4000;

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/metrics') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    // CORS simple para desarrollo
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.end(
      JSON.stringify({
        resumen: metrics.resumen,
        estado: metrics.estado,
        visitas: metrics.visitas,
      }),
    );
  } else if (req.method === 'GET' && req.url === '/report') {
    res.statusCode = 200;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_gato.xlsx"');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Visitas');

    worksheet.columns = [
      { header: 'Visita #', key: 'id', width: 10 },
      { header: 'Estado', key: 'estado', width: 15 },
      { header: 'Inicio', key: 'inicio', width: 20 },
      { header: 'Duración (s)', key: 'duracion', width: 15 },
      { header: 'Nota', key: 'nota', width: 25 },
    ];

    // Estilo para los encabezados
    worksheet.getRow(1).font = { bold: true };

    metrics.visitas.forEach((v, index) => {
      const nota = v.duracionSegundos === 0 ? 'Fuera del arenero' : 'Dentro de lo normal';
      worksheet.addRow({
        id: index + 1, // ID secuencial: 1, 2, 3...
        estado: v.evento || 'N/A',
        inicio: v.inicio || 'N/A',
        duracion: v.duracionSegundos || 0,
        nota: nota,
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
  console.log(`🌐 Backend HTTP de métricas escuchando en http://localhost:${PORT}/metrics`);
});