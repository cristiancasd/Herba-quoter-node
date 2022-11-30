require('express-validator')

const { check } = require('express-validator');
const express= require('express')
const cors= require('cors');
const app=express()
const { validation } = require('../middlewares/validation');

class Server{
    constructor(){
        this.app= express();
        this.port= process.env.PORT;
        this.middlewares();
        this.routes();
    }
    middlewares(){  //(.use es la palabra para saber que es un middleware)
        this.app.use(cors());            
        this.app.use(express.json());  //Lectura y parseo del body 
        this.app.use(express.static('public'))  //Directorio publico
    }
    routes(){
        this.app.get('/api/', (req, res)=> {
            res.json({msg: 'get api'})
        });

        this.app.post('/api/',
        [
            check('id', 'El nombre es obligatorio').not().isEmpty(),
            validation
        ], 
        (req, res)=> {
            const {id}=req.body;
            res.json({msg: 'post Api', id}
            )
        });
    }
    listen(){
        this.app.listen(this.port, ()=>{
            console.log('servidor corriendo en port ', this.port)
        })
    }
}
module.exports=Server