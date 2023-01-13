const Sequelize=require('sequelize');
const { v4: uuid } = require('uuid');
const dbConection=require('../database/config');
const Quoter = require('./quoters');

const Product=dbConection.define('product',{
    idProduct:{
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
    },
    //title: Sequelize.STRING(60),
    sku: Sequelize.STRING(10),
    quantity: Sequelize.INTEGER,
    //unitPrice: Sequelize.INTEGER,   
    //total: Sequelize.INTEGER,
    //pv: Sequelize.FLOAT,
    quoterId: {
        type: Sequelize.UUID,
        references : {
          model : Quoter,
          key : 'id'
        },
        onDelete: 'CASCADE',
    },
},{
    instanceMethods: {
        toJSON: function () {
            const productObj = Object.assign({}, this.dataValues);  
            delete productObj.title;  
            return productObj
        }
  }
})


Product.belongsTo(Quoter, {
    foreignKey: "quoterId",
    as: "quoter"
  }); 

Quoter.hasMany(Product, { as: "products" });

Product.prototype.toJSON =  function () {
    let values = Object.assign({}, this.get());
    delete values.createdAt;
    delete values.updatedAt;
    delete values.quoterId;
    delete values.id;
    return values;
}

module.exports= Product;