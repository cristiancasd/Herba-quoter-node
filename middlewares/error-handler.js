//const { response, request } = require("express");
 
const errorHandler=(
    err,
    req,
    res, 
    next)=>{
    
        console.log('el error es ---------9999999999-----------', err)
    if (res.headersSent) {
        return next(err)
    }


    res.status(err.status).json({
        errors: err.reasons
    });
}

module.exports={
    errorHandler
}