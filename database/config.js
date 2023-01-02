const Sequelize = require('sequelize');
require('dotenv').config();

module.exports=new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME ,process.env.DB_PASSWORD,{

    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    pool:{
        max: 5, 
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // No crear las columndas de created y updated date
    /*define: {
        timestamps: false
    },*/
    logging: false //NO se muestra en el console.log los reportes de la db
});