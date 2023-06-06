
const mysql = require('mysql');

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'intercambiador'
});
console.log("Programa iniciado correctamente");
// Conexión al puerto serial de Arduino
const {ReadlineParser, SerialPort} = require('serialport');
const port = new SerialPort({ // ajustar según el puerto utilizado por tu Arduino
    path:"COM12",
    baudRate: 9600
});
const parser = new ReadlineParser();
port.pipe(parser);

// Evento que se dispara cuando se recibe un dato desde Arduino
parser.on('data', (data) => {
    const datos = data.toString().split(' ');
    const sensor = datos[0];
    const valor = parseFloat(datos[1]);

    // Insertar el mensaje en la base de datos
    db.query(`INSERT INTO temperaturas (sensor, valor, fecha) VALUES ('${sensor}','${valor}',NOW())`, (error, results, fields) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Guardado: ${sensor} - ${valor}`);
        }
    });
});