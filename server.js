// Se importan las librerias a utilizar
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const port = 8080;
const app = express();

app.use(bodyParser.json());

// Funcion encargada de leer el archivo DATA.JSON que contiene
// algunos datos referentes a la API
const readData = () => {
    try {
        const data = fs.readFileSync('data.json');
        return JSON.parse(data);
    }catch(error) {
        console.log(error);
        return { tacos: [] };
    }
};

// Funcion encargada de escribir dentro del archivo DATA.JSON
const writeData = (data) => {
    try {
        fs.writeFileSync('data.json', JSON.stringify(data));
    }catch(error) {
        console.log(error);
    }
}

/**
 * Creacion de rutas
 * 1. Ruta principal, solo muestra un mensaje en el navegador
 * 2. Ruta que muestra los datos de la API, los datos se obtienen mediante el
 *    metodo GET
 * 3. Ruta que muestra un valor en especifico mediante el id usando el metodo GET
 * 4. Ruta encargada de almacenar un nuevo valor dentro de la API mediante el metodo
 *    POST
 * 5. Ruta encargada de modificar el valor de un dato mediante el id usando el metodo PUT
 * 6. Ruta encargada de eliminar un valor mediante el id usando el metodo DELETE
*/
app.get('/', (req, res) => {
    res.send('Welcome to the Tacos API');
});

app.get('/tacos', (req, res) => {
    const data = readData();
    res.json(data.tacos);
});

app.get('/tacos/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const taco = data.tacos.find((taco) => taco.id === id);
    res.json(taco);
});

app.post('/tacos', (req, res) => {
    const data = readData();
    const body = req.body;
    const newOrder = {
        id: data.tacos.length + 1,
        ...body,
    };
    data.tacos.push(newOrder);
    writeData(data);
    res.json(newOrder);
});


app.put('/tacos/:id', (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const tacoIndex = data.tacos.findIndex((taco) => taco.id === id);
    data.tacos[tacoIndex] = {
        ...data.tacos[tacoIndex],
        ...body,
    };

    writeData(data);
    res.json({ message: "Order updated successfully."})
});

app.delete('/tacos/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const tacoIndex = data.tacos.findIndex((taco) => taco.id === id);
    data.tacos.splice(tacoIndex, 1);
    writeData(data);
    res.json({ message: "Order deleted successfully" });
});

app.get('/suma/:num1/:num2', (req, res) => {
    const { num1, num2 } = req.params;
    const sum = parseFloat(num1) + parseFloat(num2);
    res.json({ result: sum });
});

app.get('/sumaTotal', (req, res) => {
    const data = readData();
    const totalSum = data.tacos.reduce((sum, taco) => sum + taco.precio_total, 0);
    res.json({ result: totalSum });
});

app.get('/mult/:num1/:num2', (req, res) => {
    const { num1, num2 } = req.params;
    const product = parseInt(num1) * parseFloat(num2);
    res.json({ result: product });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
