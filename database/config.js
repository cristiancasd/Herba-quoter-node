const Sequelize = require('sequelize');
module.exports=new Sequelize('quoters','postgres','ABCD1234',{
    host: '127.0.0.1',
    port: '5433',
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