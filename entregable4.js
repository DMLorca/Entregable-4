const express = require('express');
const {Router} = express;

const app = express();
const router = Router();

let modulo = require('./Contenedor.js');
let contenedor = new modulo.Contenedor('productos.txt');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//GET 'api/productos'

router.get('/', (req, res) => {
    contenedor.getAll().then((result) => {
        res.send(result);
    })
});

//GET 'api/productos/:id'

router.get('/:id', (req, res) => {
    const prodId = parseInt(req.params.id);
    contenedor.getById(prodId).then(result => {
        if(result){
            res.send(result);
        }else
            res.status(400).send({error: 'Producto no encontrado'});
    });
});

//POST 'api/productos'

router.post('/', (req, res) => {
    //res.send(req.body);
    const title = req.body.title;
    const price = req.body.price;
    const url = req.body.thumbnail;

    const obj = {
        'title': title,
        'price': price,
        'thumbnail': url
    }

    async function ejecutarSaveShow(argObj){
        await contenedor.save(argObj);
        contenedor.getAll().then((dataObj) => {
            const dataObjTitle = dataObj.find(dataObj => dataObj.title === title);
            res.send(dataObjTitle);
        });
    }

    ejecutarSaveShow(obj);      
    
});

//PUT 'api/productos/:id

router.put('/:id', (req, res) => {
    const prodId = parseInt(req.params.id);
    const title = req.body.title;
    const price = req.body.price;
    const url = req.body.thumbnail;

    const obj = {
        'title': title,
        'price': price,
        'thumbnail': url
    }

    const ejecutarFuncion = async (argObj, argId) => {
        await contenedor.deleteById(argId);
        await contenedor.save(argObj);
        contenedor.getAll().then(result => {
            res.send(result);
        });
      };
      
      ejecutarFuncion(obj, prodId);    

});

//DELETE 'api/productos/:id'

router.delete('/:id', (req, res) => {
    const prodId = parseInt(req.params.id);
    const ejecutarDelete = async (prodId) => {
        const resultado = await contenedor.deleteById(prodId);
        if (resultado == null) {
            res.status(400).send({ error: 'Producto no encontrado' });
        } else
            res.send(`Eliminado id: ${prodId}`);
    };
    ejecutarDelete(prodId);
});

app.use('/api/productos', router);

app.listen(8080, () => {
    console.log("Servidor levantado");
});