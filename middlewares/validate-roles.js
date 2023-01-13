const validRoles = (...roles)=>{                             //...roles, crea un arreglo con nombre role de todas las entradas
    return(req,res,next)=>{                                 
        if (!req.user){
            return res.status(500).json({
                message: 'You must validate the token first'
            })
        }
        if(!roles.includes(req.user.rol)){
            return res.status(401).json({
                message:`The  ${req.user.rol} role in not valid, you must be ${roles}`
            })
        }
        next()
    }
}
module.exports={
    validRoles
}