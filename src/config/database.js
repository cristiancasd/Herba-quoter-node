
const Sequelize = require('sequelize');

//npm config 
const config = require('config');
const dbConfig = config.get('database'); //database is into file /config/index
 

console.log('dbConfig es !!!! ', dbConfig);

module.exports= new Sequelize(
  dbConfig.database, 
  dbConfig.username, 
  dbConfig.password, {

    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    storage: dbConfig.storage,
    pool:{
      max: 5,  
      min: 0, 
      acquire: 30000,
      idle: 10000
  },
    logging: dbConfig.logging,
});




//module.exports = sequelize;

/*



module.exports = {
    dialect: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,

    //database: process.env.NODE_ENV === "test" ? "syscondom_test" : "syscondom",
    database: process.env.NODE_ENV === "test" ? "herbalifedbnode" : "herbalifedbnode",

    logging: false,
    define: {
      timestamp: true,
      underscored: true,
    },
  };

*/
