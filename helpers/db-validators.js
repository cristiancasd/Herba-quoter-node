const Quoter = require("../models/Quoters");

const quoterByIdExists=async(id)=>{
    const quoterExists = await Quoter.findOne({where: {id: id}});
    if (!quoterExists){
      throw new Error('El id no existe '+id)
    }
  }

  module.exports={
    quoterByIdExists
  }