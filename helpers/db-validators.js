const Quoter = require("../models/Quoters");
const User = require("../models/Users");

const quoterByIdExists=async(id)=>{
    const quoterExists = await Quoter.findOne({where: {id: id}});
    if (!quoterExists){
      throw new Error('The id dont exists '+id)
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

  module.exports={
    quoterByIdExists,
    userByIdExists,
    emailExists
  }