const { response } = require("express");

const validateImageToUpload=(req,res=response, next)=>{
    const {archivo}=req.files;
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({msg:'Dont exist file to upload'});
        console.log('retorno por error')
      return;
    }
    const validExtensions=['png','jpg','jpeg'];
    const dividedName = archivo.name.split('.'); 
    const extension = dividedName[dividedName.length-1];
        
    if(!validExtensions.includes(extension)){
        res.status(400).json({msg:`La extensión '.${extension}' no es permitida, ${validExtensions}`});
        return;
    };

    next()
}
module.exports={
    validateImageToUpload
}