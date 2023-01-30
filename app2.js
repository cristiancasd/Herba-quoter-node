require('express-validator')
const express= require('express')
const cors= require('cors');
const fileUpload=require('express-fileupload');
const { errorHandler } = require('./middlewares/error-handler');


const app= express();

//middlewares
app.use(cors());            
app.use(express.json());  //Lectura y parseo del body 
app.use(express.static('public'))  //Directorio publico
app.use(fileUpload({
    useTempFiles : true,
        tempFileDir : '/tmp/',
        createParentPath: true //Si la carpeta no existe la creamos
    }));
        

//routes
app.use('/api/quoters',require('./routes/quoter.route'));
app.use('/api/users',require('./routes/user.route'));
app.use('/api/files',require('./routes/uploads.route'));


app.all('*', async (req, res,next) => {
    const err= new Error('Service not found')
    err.reasons= [{message:'Service not found'}]
    err.status=404
    next(err);
  });


app.use(errorHandler);


module.exports= {app}


