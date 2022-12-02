require('express-validator'); 
const { Router } = require("express");
const { validation } = require('../middlewares/validation');
const { check } = require('express-validator');
const { findAllUsers, updateUser, createUser, deleteUser, findUser, loginUser } = require('../controllers/user.controller');
const { userByIdExists, emailExists } = require('../helpers/db-validators');
const { validateJWT } = require('../middlewares/validate-jws');

const router=Router();

router.get('/',[validateJWT,validation] , findAllUsers);

router.get('/:id',[
    check('id', 'id UUID incorrect').isUUID(),
    check('id').custom(userByIdExists),  
    validation],
findUser);

router.post('/login',[
    check('email', 'the email is missing').not().isEmpty(),
    check('email', 'must be type email').isEmail(),
    check('password', 'password is missing').not().isEmpty(),
    check('password', 'Password almost have 5 characters').isLength(6,100),
    validation], 
    loginUser
);

router.put('/:id',[    
    check('id', 'id must be UUID').isUUID(),
    check('id').custom(userByIdExists),
    validation
] ,updateUser);



router.post('/',[
    check('name', 'the name is missing').not().isEmpty(),
    check('password', 'Password almost have 5 characters').isLength(6,100),
    check('email','must be type email').isEmail(),
    check('email').custom(emailExists), 
    //check('rol').custom(esRoleValido),    //es lo mismo que lo de abajo

    validation], 
    createUser
);

router.delete('/:id',[
    validateJWT, 
    check('id', 'id must be UUID').isUUID(),
    //mustBeRol('USER_ROLE','VENTAS_ROL'),             //Escoger el rol permitido
    check('id').custom(userByIdExists),
    validation
] ,deleteUser);

module.exports= router;

