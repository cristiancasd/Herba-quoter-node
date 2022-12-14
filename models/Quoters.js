const Sequelize=require('sequelize');
const { v4: uuid } = require('uuid');
const dbConection=require('../database/config');
const Product = require('./Products');

const Quoter=dbConection.define('quoter',{
    id:{
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
    },
    title: Sequelize.STRING(60),
    description: Sequelize.STRING(60),
    total: Sequelize.INTEGER,   
    pv: Sequelize.FLOAT,    
    idUser: Sequelize.UUID,
})

Quoter.prototype.toJSON =  function () {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.idUser;
    return values;
}

module.exports= Quoter;