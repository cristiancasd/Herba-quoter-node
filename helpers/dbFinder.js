//const Quoter = require("../models/Quoters");
//const User = require("../modelsOld/Users");
const Quoter = require("../src/models/Quoters");

/*
const quoterByIdExists=async(id)=>{
    const quoterExists = await Quoter.findOne({where: {id: id}});
    if (!quoterExists){
      throw new Error('The Quoter id dont exists ')
    }
  }

  const quotersByUserExists=async(idToDelete)=>{

    console.log('estoy en quotersByUserExists*****************')
    const quoterExists = await Quoter.findOne({where: {idUser: idToDelete}});
    if (!quoterExists){
      throw new Error('The id '+idToDelete+ ' dont have quoters')
    }
  }


  const userByIdExists=async(id)=>{
    const userExists = await User.findOne({where: {id: id}});
    if (!userExists){
      throw new Error('The id dont exists '+id)
    }
  }

  const emailExists=async(email)=>{
    const emailExists = await User.findOne({where: {email}});
    if (emailExists){
      throw new Error('the Email aready exists '+email)
    }
  }

  */

  const titleQuoterByUserExist=async(title, idUser, idQuoter=undefined )=>{
    const quoterTitleExist = await Quoter.findAll({where:{title:title, idUser:idUser}});
    
    if(!idQuoter)
      return (quoterTitleExist[0])
        ? true 
        : false
      

    if(quoterTitleExist[0]){
      console.log('Estoy en update')
      return (quoterTitleExist[0].dataValues.id===idQuoter)
        ? false
        : true;
    }else{
      return false
    }
  }

  module.exports={
    //quoterByIdExists,
    //userByIdExists,
    //emailExists,
    titleQuoterByUserExist,
    //quotersByUserExists
  }