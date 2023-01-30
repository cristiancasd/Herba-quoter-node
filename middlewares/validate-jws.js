const jwt = require('jsonwebtoken');
require('colors')

const User = require('../models/users');

const validateJWT= async (req,res,next)=>{
    const token=req.header('c-token');


    try{ 

        if(!token){ 
        
            const err= new Error('Token not valid')
            err.reasons= [{message:'token is missing in the requ'}]
            throw err
            return res.status(401).json({message:'token is missing in the request'});
        }
        
        const {id}= jwt.verify(token,process.env.SECRETOPRIVATEKEY); 
        const user=await User.findOne({where:{id}});
          
        if(!user) {
            const err= new Error('Token not valid')
            err.reasons= [{message:'oken not valid - User dont exist in the DB'}]
            throw err
            return res.status(401).json({message: 'Token not valid - User dont exist in the DB'})
        }  
        req.user=user;
        req.id=id; 

        next()
    }catch(error){
        console.log('error',error)

        const err= new Error('Token not valid')
        err.reasons= [{message:'Token no valid', field: ''}]
        throw err
        


        res.status(401).json({
            message:'Token not valid'
        })
    }
}

module.exports={
    validateJWT
}