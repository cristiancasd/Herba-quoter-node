const jwt = require('jsonwebtoken');
require('colors')

const User = require('../models/users');

const validateJWT= async (req,res,next)=>{
    const token=req.header('c-token');

    if(!token) return res.status(401).json({message:'token is missing in the request'});
    
    try{ 
        const {id}= jwt.verify(token,process.env.SECRETOPRIVATEKEY); 
        const user=await User.findOne({where:{id}});
          
        if(!user) return res.status(401).json({message: 'Token not valid - User dont exist in the DB'})
               
        /*if(!usuario.estado){ //validar si el usuario ya fue eliminado
            return res.status(401).json({
                msg: 'Token no válido - usuario ya fue eliminado'
            })
        }*/
        
        req.user=user;
        req.id=id; 

        next()
    }catch(error){
        console.log('error',error)
        res.status(401).json({
            message:'Token not valid'
        })
    }
}

module.exports={
    validateJWT
}