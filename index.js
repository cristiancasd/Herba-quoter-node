require ('dotenv').config();
require('colors')
require ('dotenv').config()
const dbConnection = require('./database/config');
const { app } = require('./app2');


const start= async()=>{

    if (!process.env.PORT) {        
        console.log('no hay puerto')
        throw new Error('JWT_KEY must be defined');
    }
    const port= process.env.PORT;

    
    try{
        console.log('voy a intentar conectar')
        await dbConnection.sync();
        console.log('conectado a la db'.yellow)
    }catch(error){
        console.log('error conectand a la db'.red);
        console.log(error)
    }
    
     
    app.listen(port, ()=>{
        console.log('servidor corriendo en port ', port)
    })
}

start()
