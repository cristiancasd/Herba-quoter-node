require('colors');

const Product = require("../models/Products");
const Quoter = require('../models/quoters');
//const { initialData } = require('../static/data/quoters-data');
const {loseweight} = require('../static/data/quoters-data.json') 


const findDefaultQuoters=(req, res) =>{
    //const loseweight=initialData();
    res.status(200).json(loseweight);
}

const findQuoter=async (req, res)=> { 
    const {id}=req.params;

    const quoter= await Quoter.findAll({
        where: {'$id$': id},
        include:[{model: Product,as: 'products',}]
    });
    res.status(200).json({ quoter,});
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

const createQuoter=async (req, res)=> {
    const {title, description="", image="", products=[]}=req.body;  
    const idUser=req.user.id;

    console.log(' el id user es ', idUser)
    
    
    const  data={
        title,
        description,
        image,
        idUser
    }

    const productsOk=await validateProductsArray(products)
    if(!productsOk) return res.status(400).json({message:'products array incorrect'});


    const quoter=new Quoter(data);
    await quoter.save();
    
    await Promise.all(
        productsOk.map(async (product)=>{
            const productToAdd={...product, quoterId: quoter.id}
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

const updateQuoter=async (req, res)=> {
    const {id}=req.params;
    const data=req.body;
    const idUser=req.user.id
    const userRole=req.user.rol

    
    let productsOk=[]
    if(data.products){ 
        productsOk=await validateProductsArray(data.products)
        if(!productsOk) return res.status(400).json({message:'products array incorrect'});
    }

    const quoter= await Quoter.findOne({where: {id}})
    console.log('quoter del put ', quoter, quoter.id);
    console.log('datc ', data);

    //const {id: quoterId, cretedAt, updatedAt, products, ...quoterBeforeToUpload}=quoter;
    const {id: quoterId}= quoter;
    if(userRole==='user')
        if(idUser!=quoter.idUser) 
            return res.status(400).json({message:'You cannot change a quoter of other user'});

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

    //if(data.products){
    if(productsOk){
        console.log('voy a destruir productos')
        await Product.destroy({
            where: { quoterId },
        });
        await Promise.all(
            productsOk.map(async (product)=>{
                const productToAdd={...product, quoterId}
                const productsDb=new Product(productToAdd)
                await productsDb.save();
            }))
        console.log('listo destrucción de productos')
    }

    res.json({
        id: quoterId,
        products: productsOk,
        //...quoterBeforeToUpload,
        ...dataToUpload,
        }
    )
}

const deleteQuoter=async (req, res)=> {
    const {id}=req.params;
    const idUser=req.user.id
    const userRole=req.user.rol

    const  quoter = await Quoter.findOne({ where : {id}});
    console.log(quoter)
    if(userRole==='user')
        if(idUser!=quoter.idUser) 
            return res.status(400).json({message:'You cannot delete a quoter of other user'});

    await Quoter.destroy({where: {id}}); 
    res.json({message: 'delete ok', id})
}

const validateProductsArray=async(products)=>{
    if(products.length==0) return false
    let arrayOk=true
    const arrayValidated=products.map(product=>{
        const {sku,quantity,}=product;
        if(sku&&quantity) return {sku, quantity};
        if (!sku||!quantity) arrayOk=false;
    })    

    return !arrayOk
                ? false
                : arrayValidated
}

module.exports={
    findDefaultQuoters,
    findQuoter,
    findAllQuoters,
    createQuoter,
    updateQuoter,
    deleteQuoter,
    findAllQuotersByUser
}