const Sequelize=require('sequelize');
const bcrypt=require('bcrypt-nodejs');
const { development } = require('../database/config');
 
//todo changes
const dbConection=require('../database/config');
//const dbConection= new development()

const Users=dbConection.define('users',{
    id:{
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
    }, 
    name: Sequelize.STRING(60),
    email:{
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: {
            args: true,
            msg:  'email already registered'
        },              
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
    },
    isActive:{
        type: Sequelize.BOOLEAN,
        defaultValue:false
    },

}, /*{
    hooks:{
        beforeCreate(user){
            user.password= bcrypt.hashSync(user.password, bcrypt.genSaltSync(10),
            null)
        }
    }
}*/)

Users.prototype.validatePassword2=(password)=>{
    return bcrypt.compareSync(password, this.password);
}

Users.prototype.validatePassword=function(password){
    return bcrypt.compareSync(password, this.password);
}

Users.prototype.toJSON =  function () {
    let values = Object.assign({}, this.get());
    delete values.password;
    return values;
}

module.exports= Users;