const axios= require('axios');
const { AuthError } = require('../errors/auth-error');
const { ServiceUnvailableError } = require('../errors/service-unvailable-error');
require('colors')



const validateJWTbackendNest= async (req,res,next)=>{
    const tokenToReview=req.header('Authorization');
  

    try{
        if(!tokenToReview){
            const err= new AuthError('Token missing, ')
            return next(err)
       }

        const baseUrl=process.env.STAGE==='dev'
            ? process.env.AXIOS_URL_BACKEND_USERS_DEV
            : process.env.AXIOS_URL_BACKEND_USERS

        const config = {
            headers: { Authorization: tokenToReview }
        };
            
        const bodyParameters = {
            key: "value"
        };
        const {data}= await axios.post(
          baseUrl,
          bodyParameters,
          config
        )
        
        req.user=data.user
        req.userRol=data.user.rol
        next()
    }catch(error){
        const err= (error.response)
            ? new AuthError('Token not vaild, ')
            : new ServiceUnvailableError('Backend Auth Error, ')
        return next(err)
    }  
}

module.exports={
    validateJWTbackendNest
}