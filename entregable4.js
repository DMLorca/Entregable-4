const express = require('express');
const app = express();

let modulo = require('./Contenedor.js');
let contenedor = new modulo.Contenedor('productos.txt');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//GET 'api/productos'

app.get('/api/productos', (req, res) => {
    contenedor.getAll().then((result) => {
        res.send(result);
    })
});

//GET 'api/productos/:id'

app.get('/api/productos/:id', (req, res) => {
    const prodId = parseInt(req.params.id);
    contenedor.getById(prodId).then(result => {
        res.send(result);
    })
});

//POST 'api/productos'

app.post('/api/productos', (req, res) => {
    const title = req.body.title;
    const price = req.body.price;
    const url = req.body.url;

    const obj = {
        'title': title,
        'price': price,
        'thumbnail': url
    }

    contenedor.save(obj);
    
    contenedor.getAll().then((dataObj) => {
        const dataObjTitle = dataObj.find(dataObj => dataObj.title === title);
        res.send(dataObjTitle);
    });
});

//API 'api/productos/:id



//DELETE 'api/productos/:id'

app.delete('/api/productos/:id', (req, res) => {
    const prodId = parseInt(req.params.id);
    contenedor.deleteById(prodId);
    res.send(`Eliminado id: ${prodId}`);
});



app.listen(8080, () => {
    console.log("Servidor levantado");
});