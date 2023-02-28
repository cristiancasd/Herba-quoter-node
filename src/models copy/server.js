require('express-validator')
require('colors')
const express= require('express')
const cors= require('cors');
const fileUpload=require('express-fileupload')
const dbConnection = require('../database/config');
const { errorHandler } = require('../middlewares/error-handler');


/*
require('./Quoters');
require('./Products');
require('./Users');
*/

class Server{
    constructor(){
        this.app= express();
        this.port= process.env.PORT;
        this.conectarDB();  
        this.middlewares();
        this.routes();
        this.app.use(errorHandler) 
    }
    async conectarDB(){ 
        try{
            await dbConnection.sync();
            console.log('conectado a la db'.yellow)
        }catch(error){
            console.log('error conectand a la db'.red);
            console.log(error)
        }
        //dbConnection.sync().then(()=>console.log('DB conected')).catch((error)=>console.log('error tremendo'.red,  error));
    }
    middlewares(){  
        this.app.use(cors());            
        this.app.use(express.json());  //Lectura y parseo del body 
        this.app.use(express.static('public'))  //Directorio publico
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true //Si la carpeta no existe la creamos
        }));
        
    } 

    
    routes(){
        this.app.use('/api/quoters',require('../routes/quoter.route'));
        this.app.use('/api/users',require('../routes/user.route'));
        this.app.use('/api/files',require('../routes/uploads.route'));
    }
    listen(){
        this.app.listen(this.port, ()=>{
            console.log('servidor corriendo en port ', this.port)
        })
    }
}
module.exports=Server