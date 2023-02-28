const Sequelize=require('sequelize');
const sequelize=require('../config/database');
const Model= Sequelize.Model;

class User extends Model {}

User.init(
    {
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
    },
    {
        sequelize,
        modelName: 'user',
    }
)


User.prototype.validatePassword2=(password)=>{
    return bcrypt.compareSync(password, this.password);
}

User.prototype.validatePassword=function(password){
    return bcrypt.compareSync(password, this.password);
}

User.prototype.toJSON =  function () {
    let values = Object.assign({}, this.get());
    delete values.password;
    return values;
}

module.exports= User;