//Importar express para crear servidor web.
const express = require("express");

const app = express();
const PORT = 3000;

//Middleware para interpretar solicitudes JSON.
app.use(express.json());

//Base de datos temporal.
let clientes = [
    {
        id: 1,
        nombre: "Laura Cano",
        documento: "457845",
        direccion: "calle 30 # 3-30",
        telefono: "3100000",
        correo: "lauracano@gmail.com"
    },
    {
        id: 2,
        nombre: "Luis Perez",
        documento: "123112",
        direccion: "calle 20 # 8-30",
        telefono: "3123434",
        correo: "luisperez@gmail.com"
    },
    {
      id: 1,
        nombre: "Kelly Sanz",
        documento: "787878",
        direccion: "calle 80 # 4-30",
        telefono: "3235050",
        correo: "kellysanz@gmail.com"
    }
];
let siguienteId = 4;
