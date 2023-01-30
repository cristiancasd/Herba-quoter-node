const { validationResult } = require("express-validator");


const validateProductsArray=  (req,res,next)=>{



    const {products}=req.body;
    if(products){
        if(products.length==0) return false
    let arrayOk=true
    
    products.map(product=>{
        const {sku,quantity}=product;
        if (!sku||!quantity) arrayOk=false;
    });

    if(!arrayOk) {
        const errors= validationResult(req);
        if(!errors.isEmpty()) console.log('errors.array()  ', errors.array())

        const err= new Error('each product object must have sku and quantity properties')
        err.reasons= [{
            message:'each product object must have sku and quantity properties',
            field: 'products'
        }]
        err.status=400

        if(!errors.isEmpty()){ 
            console.log('errors.array()  ', errors.array())
            const previousMistakes=errors.array().map(previousMistake=>{
                return {
                    message: previousMistake.msg,
                    field: previousMistake.param,
                }
            })
        err.reasons= [ ...previousMistakes, ...err.reasons, ]
        }
        return next(err)

        //throw err
        
        
    }
    }
    
    next()
}


module.exports={
    validateProductsArray
}