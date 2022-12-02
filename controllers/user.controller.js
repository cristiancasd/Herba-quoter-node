const bcryptjs=require('bcryptjs');
const { newJWT } = require('../helpers/newJWT');
const User = require('../models/users');

require('colors')

const findUser=async (req, res)=> { 
    const {id}=req.params;
    const user= await User.findOne({ where: {id} });

    res.status(200).json(user);
}

const findAllUsers=async (req, res)=> {
    const users= await User.findAll();    
    res.status(200).json(users);
}

const loginUser=async (req, res)=> {
    const {email, password}=req.body;
    try{
        const user=await User.findOne({where:{email}});              
        if(!user){                                                   //Confirmo que el correo exista
            return res.status(400).json({
                msg:'User / email not valid'
            })
        }
    
        const validPassword=bcryptjs.compareSync(password,user.password); 
        if(!validPassword){                                             //Confirmo contraseña valida
            return res.status(400).json({
                msg:'User / password not valid'
            })
        }

        
        // Generar el JWT
        const token = await newJWT(user.id) 
        
        res.json({
            msg:'Login ok',
            user,
            token
        })

        
    }catch(error){
        console.log(error)
        res.status(500).json({  //internal server error
            msg: 'Hable con el administrador'
        })
    }

}

const createUser=async (req, res)=> {
    const {name="", email, password}=req.body;        
    const  data={
        name,
        email,
        password,
    }
    const user=new User(data);
    const salt = bcryptjs.genSaltSync();
    user.password=bcryptjs.hashSync(password, salt)
    await user.save();
    res.status(201).json(user);
}

const updateUser=async (req, res)=> {
    const {id}=req.params;
    const data=req.body;
    const user= await User.findOne({where: {id}})
  ;

    const {id: userId, cretedAt, updatedAt, password, ...userToUpload}=user;
    if (data.password){                                          //Encriptar contraseña       
        const salt = bcryptjs.genSaltSync();
        data.password=bcryptjs.hashSync(data.password,salt)     //resto ahora incluye el password encriptado
    }  

    await User.upsert({
        id,
        ...userToUpload,
        ...data,
    });

    res.json({id, ...userToUpload, ...data,}
    )
}

const deleteUser=async (req, res)=> {
    const {id}=req.params;
    const  user = await User.findOne({ where : {id}});
    await User.destroy({where: {id}}); 
    res.json({msg: 'delete ok', id})
}

module.exports={
    findUser,
    findAllUsers,
    createUser,
    updateUser,
    deleteUser,

    loginUser
}