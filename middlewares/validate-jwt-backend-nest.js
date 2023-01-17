const jwt = require('jsonwebtoken');
const axios= require('axios')
require('colors')



const validateJWTbackendNest= async (req,res,next)=>{
    const tokenToReview=req.header('Authorization');
    //console.log('voy a validar toker '.blue)
    //console.log(tokenToReview)
    if(!tokenToReview){
         return res.status(401).json({
             message:'token is missing in the request'
         });
    }

    try{

        //console.log('baseURL_DEV ',process.env.AXIOS_URL_BACKEND_USERS_DEV);
        //console.log('baseURL_PROD ',process.env.AXIOS_URL_BACKEND_USERS);
        //console.log('STAGE ',process.env.STAGE);
        const baseUrl=process.env.STAGE==='dev'
            ? process.env.AXIOS_URL_BACKEND_USERS_DEV
            : process.env.AXIOS_URL_BACKEND_USERS
        //console.log('baseUrl', baseUrl)

        const config = {
            headers: { Authorization: tokenToReview }
        };
            
        const bodyParameters = {
            key: "value"
        };
        const resp= await axios.post(
          baseUrl,
          bodyParameters,
          config
        )
        //console.log('good response '.yellow)

        if(!resp.data.user.isactive) 
            return res.status(401).json({ message:'You are inactive, talk with the admin'})
        //console.log(resp.data);
        req.user=resp.data.user
        req.userRol=resp.data.user.rol
        next()
    }catch(error){
        console.log('errar', error);
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