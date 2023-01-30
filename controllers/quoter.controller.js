require('colors');
const { titleQuoterByUserExist } = require('../helpers/db-validators');
const Product = require("../models/Products");
const Quoter = require('../models/quoters');
const { initialData } = require('../static/data/quoters-data');
//const {loseweight} = require('../static/data/quoters-data.json') 
const { deleteImageCloudinary, } = require('../helpers/imageManage');
const { validation } = require('../middlewares/validation');
const { validationResult } = require('express-validator');


const findDefaultQuoters=(req, res) =>{

    const loseweight=initialData();
    const quotersInitial= loseweight.map(quoter=>{
           return{ 
                ...quoter,
                image: process.env.HOST_API+'/files/'+quoter.image
            }
        }
    )
    res.status(200).json(quotersInitial);
}

const findQuoter=async (req, res)=> { 
    const {id}=req.params;

    const quoter= await Quoter.findAll({ 
        where: {'$id$': id},
        include:[{model: Product,as: 'products',}]
    });
    res.status(200).json( quoter);
}

const findAllQuoters=async (req, res)=> {

    const quoters= await Quoter.findAll({include:[{
        model: Product,as: 'products'
      }]});
    res.status(200).json(quoters);
}

const findAllQuotersByUser=async (req, res)=> {
    const {idUser}=req.params;

    const quoters= await Quoter.findAll({
        where:{'$idUser$': idUser},
        include:[{model: Product, as: 'products',}]
    });
    res.status(200).json(quoters);
}

const createQuoter=async (req, res, next)=> {
    const {title, description="", image="", products=[]}=req.body;  
    const idUser=req.user.id;
    
    if (await titleQuoterByUserExist(title,idUser)){
        const err= new Error('Title already exist, try with other one')
        err.reasons= [{message:'title already exist, try with other one'}]
        err.status=400
        return next(err)
    }
   
    console.log('voy a constuir la data')
    
    const  data={
        title,
        description,
        image,
        idUser
    }

    /*const productsOk=await validateProductsArray(products)
    if(!productsOk){  //throw new Error('products array incorrect')
            const err= new Error('products array incorrect')
            err.reasons= [{message:'products array incorrect'}]
            err.status=400
            next(err)
            return
    } */
    
    const quoter=new Quoter(data);
    await quoter.save();
    
    await Promise.all(
        products.map(async (product)=>{
            const {sku, quantity} = product
            const productToAdd={sku, quantity, quoterId: quoter.id}
            const productsDb=new Product(productToAdd)
            await productsDb.save();
        })
    )

    const quoterFinal= await Quoter.findAll({
            where: {'$id$': quoter.id},
            include:[{model: Product,as: 'products',}]
    });
    res.status(201).json(quoterFinal);
}

const updateQuoter=async (req, res, next)=> {
    const {id}=req.params;
    const data=req.body;
    const idUser=req.user.id
    const userRole=req.user.rol

    if (await titleQuoterByUserExist(data.title,idUser, id)){
        const err= new Error('Title already exist, try with other one')
        err.reasons= [{message:'title already exist, try with other one'}]
        err.status=400
        return next(err)
    }
    /*let productsOk=[]
    if(data.products){ 
        productsOk=await validateProductsArray(data.products)
        if(!productsOk) {
            const err= new Error('products array incorrect')
            err.reasons= [{message:'products array incorrect'}]
            err.status=400
            return next(err)
            return res.status(400).json({message:'products array incorrect'});
        }
    } */

    //const quoter= await Quoter.findOne({where: {id}})
   
    const quoterDB= await Quoter.findAll({
        where: {'$id$': id},
        include:[{model: Product,as: 'products',}]
    });

    const quoter= quoterDB[0]


    if(!quoter){
        const err= new Error('The quoter dont exist')
        err.reasons= [{message:'The quoter dont exist'}]
        err.status=400
        return next(err)
    }

    //console.log('quoter del put ', quoter, quoter.id);
    //console.log('datc ', data);

    //const {id: quoterId, cretedAt, updatedAt, products, ...quoterBeforeToUpload}=quoter;
    const {id: quoterId}= quoter;

  

    


    if(userRole==='user')
        if(idUser!=quoter.idUser){
            const err= new Error('You cannot change a quoter of other user')
            err.reasons= [{message:'You cannot change a quoter of other user'}]
            err.status=403
            return next(err)
            return res.status(400).json({message:'You cannot change a quoter of other user'});

    }



    const  dataToUpload={
        title:data.title,
        description:data.description,
        image: data.image,
    }

        console.log('dataToUpload ', dataToUpload)

    await Quoter.upsert({
        id: quoterId,
        //...quoterBeforeToUpload,
        ...dataToUpload,
        idUser
    });

    console.log('listo el upsert')

    const products=data.products;
    const productsDb=quoter.products;

    const productsEqual=
        products.length === productsDb.length
            ? products.every((product, cont) => {
                return (product.sku!== productsDb[cont].sku ||product.sku!== productsDb[cont].sku) 
                    ? false
                    : true;
              })
            : false

    
    const arrayAdapted= products.map(product=>{
        return {sku:product.sku, quantity: product.quantity}
    })

    if(!productsEqual){
        console.log('voy a destruir productos')
        await Product.destroy({
            where: { quoterId },
        });
        await Promise.all(
            arrayAdapted.map(async (product)=>{
                const productToAdd={...product, quoterId}
                const productsDb=new Product(productToAdd)
                await productsDb.save();
            }));
        console.log('listo destrucción de productos')
    }


    res.json([{
        id: quoterId,
        products: arrayAdapted,
        ...dataToUpload,
        }]
    )
}

const deleteQuoter=async (req, res, next)=> {
    const {id}=req.params;
    const idUser=req.user.id
    const userRole=req.user.rol

    const  quoter = await Quoter.findOne({ where : {id}});
    console.log(quoter)
    if(userRole==='user')
        if(idUser!=quoter.idUser){
            const err= new Error('You cannot delete a quoter of other user')
            err.reasons= [{message:'You cannot delete a quoter of other user'}]
            err.status=403
            return next(err)
            return res.status(400).json({message:'You cannot delete a quoter of other user'});
        }

    await Quoter.destroy({where: {id}}); 
    if(quoter.image && quoter.image!=="") deleteImageCloudinary(quoter.image)
    res.json({message: 'delete ok', id})
}



module.exports={
    findDefaultQuoters,
    findQuoter,
    findAllQuoters,
    createQuoter,
    updateQuoter,
    deleteQuoter,
    findAllQuotersByUser,
}