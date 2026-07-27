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

//POST: Registrar un cliente.
app.post("/api/clientes", (req, res)=>{
    const {nombre, documento, direccion, telefono, correo} = req.body;

    //Validar campos obligatorios.
    if(
        nombre === undefined||
        documento === undefined||
        direccion === undefined||
        telefono === undefined ||
        correo === undefined
    ){
        return res.status(400).json({
            error: "Todos los campos son obligatorios",
            camposRequeridos: ["nombre", "documento", "direccion", "telefono", "correo"]
        });
    }

    //Validar documento que no se repita.
    const clienteExistente = clientes.find(
    (cliente) => cliente.documento === documento
    );

    if (clienteExistente) {
        return res.status(400).json({
        error: "El documento ya se encuentra registrado."
    });
}

    //Validar contenido de los campos.
    if(typeof nombre!== "string"||nombre.trim() === ""){
        return res.status(400).json({
            error: "El nombre debe ser un texto válido"
        });
    }
    if (typeof correo !== "string" || !correo.includes("@")) {
        return res.status(400).json({
        error: "El correo electrónico no es válido."
        });
    }
    const nuevoCliente = {
        id: siguienteId,
        nombre: nombre.trim(),
        documento: documento.trim(),
        direccion: direccion.trim(),
        telefono: telefono.trim(),
        corre: correo.trim()
    };
    clientes.push(nuevoCliente);
    siguienteId++;
    res.status(201).json({
        mensaje: "Cliente registrado correctamente",
        datos: nuevoCliente
    });
});

//PUT: Actualizar completamente un cliente.
app.put("/api/clientes/:id", (req, res)=>{
    const id = Number(req.params.id);
    const {nombre, documento, direccion, telefono, correo} = req.body;
    const indice = clientes.findIndex((item)=>item.id === id);
    if(indice === -1){
        return res.status(404).json({
            error: `No se encontró un cliente con el ID ${id}`
        });
    }

    if(
        nombre === undefined||
        documento === undefined||
        direccion === undefined||
        telefono === undefined ||
        correo === undefined
    ){
        return res. status(400).json({
            error: "Para usar PUT debe enviarse todos los campos"
        });
    }

    const documentoExistente = clientes.find(
    (cliente) =>cliente.documento === documento && cliente.id !== id
    );

    if (documentoExistente) {
        return res.status(400).json({
        error: "El documento ya está registrado por otro cliente."
        });
    }

    if(typeof nombre!=="string"||nombre.trim()===""){
        return res.status(400).json({
            error: "El nombre debe ser un texto válido"
        });
    }
    if (typeof correo !== "string" || !correo.includes("@")) {
        return res.status(400).json({
        error: "El correo electrónico no es válido."
        });
    }
    clientes[indice] = {
        id,
        nombre: nombre.trim(),
        documento: documento.trim(),
        direccion: direccion.trim(),
        telefono: telefono.trim(),
        corre: correo.trim()
    };
    res.status(200).json({
        mensaje: "Cliente actualizado completamente.",
        datos: clientes[indice]
    });
});
//PATCH: Actualizar parcialmente un cliente.
app.patch("/api/clientes/:id", (req, res)=>{
    const id = Number(req.params.id);
    const indice = clientes.findIndex((item)=>item.id===id);
    if(indice===-1){
        return res.status(404).json({
            error: `No se encontró un cliente con el ID ${id}`
        });
    }
    const camposPermitidos = ["nombre", "documento", "direccion", "telefono", "correo"];
    const camposRecibidos = Object.keys(req.body);
    if(camposRecibidos.length === 0){
        return res.status(400).json({
            error: "Debe enviar al menos un campo para actualizar"
        });
    }
    const camposNoPermitidos = camposRecibidos.filter(
    (campo)=>!camposPermitidos.includes(campo)
);
if(camposNoPermitidos.length>0){
    return res.status(400).json({
        error: "Se enviaron campos no permitidos.",
        camposNoPermitidos,
        camposPermitidos
    });
}
const {nombre, documento, direccion, telefono, correo} = req.body;
if(
    nombre !== undefined &&
    (typeof nombre !== "string"|| nombre.trim() ==="")
){
    return res.status(400).json({
        error: "El nombre debe ser un texto válido."
    });
}
if (documento !== undefined) {
    const documentoExistente = clientes.find(
        (cliente) =>cliente.documento === documento && cliente.id !== id
    );

    if (documentoExistente) {
        return res.status(400).json({
            error: "El documento ya está registrado por otro cliente."
        });
    }
}

 clientes[indice] = {
    ...productos[indice],
    ...(nombre !== undefined && { nombre: nombre.trim() }),
    ...(documento !== undefined && { documento: documento.trim() }),
    ...(direccion !== undefined && { direccion: direccion.trim() }),
    ...(telefono !== undefined && { telefono: telefono.trim() }),
    ...(correo !== undefined && { correo: correo.trim() })
  };

  res.status(200).json({
    mensaje: "Cliente actualizado parcialmente",
    datos: clientes[indice]
  });
});

// DELETE: eliminar un cliente.
app.delete("/api/clientes/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = clientes.findIndex((item) => item.id === id);

  if (indice === -1) {
    return res.status(404).json({
      error: `No se encontró un cliente con el ID ${id}`
    });
  }

  const clienteEliminado = clientes[indice];
  clientes.splice(indice, 1);

  res.status(200).json({
    mensaje: "Cliente eliminado correctamente",
    datos: clienteEliminado
  });
});