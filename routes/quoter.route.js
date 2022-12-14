require('express-validator'); 
const { Router } = require("express");
const { validation } = require('../middlewares/validation');
const { check } = require('express-validator');
const { findAllQuoters, createQuoter, updateQuoter, deleteQuoter, findQuoter, findAllQuotersByUser } = require('../controllers/quoter.controller');
const { quoterByIdExists } = require('../helpers/db-validators');

const router=Router();

router.get('/', findAllQuoters);
router.get('/iduser/:idUser',[
    check('idUser', 'idUser must be UUID').isUUID(),
    validation
] ,findAllQuotersByUser);

router.put('/:id',[    
    check('id', 'id must be UUID').isUUID(),
    check('img', 'Img must be String').isString(),
    check('total', 'total must be int').isInt(),
    check('pv', 'pv must be number').isFloat(),
    check('products', 'products must be array').isArray(),
    validation
] ,updateQuoter);

router.delete('/:id',[
    check('id', 'id must be UUID').isUUID(),
    check('id').custom(quoterByIdExists),
    validation
] ,deleteQuoter);

router.post('/',[
    check('idUser', 'idUser missing').not().isEmpty(),
    check('idUser', 'idUser UUID incorrect').isUUID(),
    check('title', 'title es obligatorio').not().isEmpty(),
    check('img', 'Img must be String').isString(),
    check('total', 'total es obligatorio').not().isEmpty(),
    check('total', 'total must be int').isInt(),
    check('pv', 'pv es obligatorio').not().isEmpty(),
    check('pv', 'pv must be number').isFloat(),
    check('products', 'products must be array').isArray(),

    validation], 
    createQuoter
);

router.get('/:id',[
    check('id', 'id UUID incorrect').isUUID(),
    check('id').custom(quoterByIdExists),  
    validation],
findQuoter);

module.exports= router;

