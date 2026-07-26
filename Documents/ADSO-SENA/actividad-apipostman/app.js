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

//Ruta principal
app.get("/", (req, res)=>{
    res.status(200).json({
        mensaje: "API de clientes funcionando correctamente",
        endpoints: {
            consultarTodos: "GET/api/clientes",
            consultarUno: "GET/api/clientes/:id",
            registrar: "POST/api/clientes",
            actualizar: "PUT/api/clientes/:id",
            actualizarParcialmente: "PATCH/api/clientes/:id",
            eliminar: "DELETE/api/clientes/:id"
        }
    });
});

//GET: Consultar todos los clientes.
app.get("/api/clientes", (req, res)=>{
    res.status(200).json({
        mensaje: "Clientes consultados correctamente",
        cantidad: clientes.length,
        datos: clientes
    });
});

//GET: Consultar un cliente por ID.
app.get("/api/clientes/:id", (req, res)=>{
    const id = Number(req.params.id);
    if(!Number.isInteger(id)||id<=0){
        return res.status(400).json({
            error: "El ID debe ser un número entero positivo"
        });
    }
    const cliente = clientes.find((item)=>item.id===id);
    if(!cliente){
        return res.status(404).json({
            error: `No se encontró un cliente con el ID ${id}`
        });
    }
    res.status(200).json({
        mensaje: "Cliente consultado correctamente",
        datos: cliente
    });
});