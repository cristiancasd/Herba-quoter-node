const { response } = require("express");
const { validationResult } = require("express-validator");
 
const validateImageToUpload=(req,res=response, next)=>{
    const errors=validationResult(req)
    if(errors.isEmpty()){
        const {archivo}=req.files;
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    
            const err= new Error('Dont exist file to upload');
                err.reasons= [{message:'Dont exist file to upload'}]
                err.status= 400
                throw(err)
        } 
        const validExtensions=['png','jpg','jpeg'];
        const dividedName = archivo.name.split('.'); 
        const extension = dividedName[dividedName.length-1];

        if(!validExtensions.includes(extension)){
            console.log('======================================= hay error en extension')
            const err= new Error('Dont exist file to upload');
            err.reasons= [{message:`La extensión '.${extension}' no es permitida, ${validExtensions}`}]
            err.status= 400
            throw(err)
        };
    }
  
    next()
}
module.exports={
    validateImageToUpload
}