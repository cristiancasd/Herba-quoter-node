const { response } = require("express");
const Product = require("../models/Products");
const Quoter = require('../models/quoters');

require('colors')

const findQuoter=async (req, res)=> { 
    const {id}=req.params;
    const quoter= await Quoter.findOne({ where: {id} });
    const products= await Product.findAll({ where: {quoterId: id} });

    const productsArray= products.map(data=>{
        const productData={...data.dataValues}
        const {id, createdAt, updatedAt, quoterId, ...resProduct}=productData;
        return resProduct
    })
    res.status(200).json({ ...quoter.dataValues, products: productsArray,});
}

const findAllQuoters=async (req, res)=> {

    const quoters= await Quoter.findAll({include:[{
        model: Product,as: 'products'
      }]});
    console.log('quoters, ', quoters)
    /*const quoters= await Quoter.findAll();
    const quotersArray= await Promise.all(
        quoters.map(async data=>{
            const quoterData={...data.dataValues}
            const products= await Product.findAll({ where: {quoterId: quoterData.id} });   
            
            const productsArray= products.map(data=>{
                const productData={...data.dataValues}
                const {id, createdAt, updatedAt, quoterId, ...resProduct}=productData;
                return resProduct
            })     
            const {createdAt, updatedAt, ...resQuoter}=quoterData
            return {...resQuoter, products: productsArray}
        }) 
    )*/
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
    const {idUser, title, description="", img="", total, pv, products=[]}=req.body;        
    
    const  data={
        title,
        description,
        img,
        total,
        pv,
        idUser
    }
    const quoter=new Quoter(data);
    await quoter.save();

    products.map(async (product)=>{
        const productToAdd={...product, quoterId: quoter.id}
        const productsDb=new Product(productToAdd)
        await productsDb.save();
    }) 
    //todo............... map de promesas

    const quoterFinal= await Quoter.findAll(
        {
            where: {id: quoter.id},
            include:[{model: Product,as: 'products'}]
        });

    
    res.status(201).json(quoterFinal);
}

const updateQuoter=async (req, res)=> {
    const {id}=req.params;
    const data=req.body;
    const quoter= await Quoter.findOne({where: {id}})
    console.log('quoter del put ', quoter, quoter.id);
    console.log('data input ', data);

    const {id: quoterId, cretedAt, updatedAt, products, idUser, ...quoterToUpload}=quoter;
    
    await Quoter.upsert({
        id,
        ...quoterToUpload,
        ...data,
    });

    if(data.products){
        await Product.destroy({
            where: { quoterId },
        });
        data.products.map(async product=>{
            const productToAdd={...product, quoterId}
            const productsDb=new Product(productToAdd)
            await productsDb.save();
        })  
    }

    res.json({id, ...quoterToUpload, ...data,}
    )
}

const deleteQuoter=async (req, res)=> {
    const {id}=req.params;
    const  quoter = await Quoter.findOne({ where : {id}});
    await Quoter.destroy({where: {id}}); 
    res.json({msg: 'delete ok', id})
}

module.exports={
    findQuoter,
    findAllQuoters,
    createQuoter,
    updateQuoter,
    deleteQuoter,
    findAllQuotersByUser
}