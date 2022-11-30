const { validationResult } = require("express-validator");

//Recoge los errores y los manifiesta o deja pasar en caso que no haya errores
const validation=(req,res,next)=>{    
    const errors=validationResult(req);    
    if (!errors.isEmpty()){
        return res.status(400).json(errors);
    }
    next();         
}

module.exports={
    validation
}
    