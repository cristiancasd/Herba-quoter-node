const Sequelize = require("sequelize");
const dbConfig = require("../config/database");



const Products = require("../models/Products");
const Quoters = require("../models/Quoters");
const Users = require("../models/Users");


const connection = new Sequelize(dbConfig);

Quoters.init(connection);
Products.init(connection);


Users.init(connection);
Quoters.associate(connection.models);
Products.associate(connection.models);



module.exports = connection;