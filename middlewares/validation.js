const { validationResult } = require("express-validator");

//Recoge los errores y los manifiesta o deja pasar en caso que no haya errores
const validation=(req,res,next)=>{    

    console.log('en validation')
    const errors=validationResult(req);   
    const newErrorsArray= errors.array().map(error=>{
        return{
            message: error.msg,
            field:  error.param
        }
    })
    if(newErrorsArray[0]){
        const err= new Error(newErrorsArray)
        err.reasons= newErrorsArray
        err.status= 400
        throw err
    }
    next();         
}



module.exports={
    validation
}
    