const jwt = require('jsonwebtoken');
const axios= require('axios')
require('colors')



const validateJWTbackendNest= async (req,res,next)=>{
    const tokenToReview=req.header('Authorization');
  

    try{
        if(!tokenToReview){
            const err= new Error('token is missing in the request');
            err.reasons= [{message:'token is missing in the request'}];
            err.status=401;
            next(err)
            return
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
        

        /*if(!data.user || !data.user.isactive) {
            const err= new Error('You are inactive, talk with the admin');
            err.reasons= [{message:'You are inactive, talk with the admin'}]
            err.status= 403
            next(err)
            return
        }*/
            
        
        req.user=data.user
        req.userRol=data.user.rol
        next()
    }catch(error){
        const err= new Error('Token not valid');
        (error.response)
            ?   err.reasons= error.response.status==401
                    ? [{message:'Token not valid'}]
                    : [{message:'Error Network'}]
            :   err.reasons= [{message:'Error Network NEST'}];

        (error.response)
            ?   err.status= error.response.status
            :   err.status= 500
        
        console.log('err es ------------', err)
        next(err)
        return


        if(error.response)
            return error.response.status==401
                ? res.status(401).json({ message:'Token not valid'}) 
                : res.status(500).json({ message:'Error Network'})
        return res.status(500).json({ message:'Error Network NEST'})
    }  
}

module.exports={
    validateJWTbackendNest
}